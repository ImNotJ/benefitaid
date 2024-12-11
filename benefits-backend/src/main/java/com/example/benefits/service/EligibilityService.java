package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.Question;
import com.example.benefits.entity.User;
import com.example.benefits.entity.Requirement;
import com.example.benefits.entity.Requirement.RequirementType;


import com.example.benefits.repository.BenefitRepository;
import com.example.benefits.repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service class for checking user eligibility for benefits.
 */
@Service
public class EligibilityService {

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public List<Benefit> checkEligibility(User user) {
        // Check if at least one response exists
        if (user.getResponses() == null || user.getResponses().isEmpty()) {
            throw new IllegalArgumentException("At least one question must be answered");
        }

        // Check if any response has a non-empty value
        boolean hasValidResponse = user.getResponses().values().stream()
            .anyMatch(response -> response != null && !response.trim().isEmpty());

        if (!hasValidResponse) {
            throw new IllegalArgumentException("At least one question must be answered");
        }

        List<Benefit> allBenefits = benefitRepository.findAll();
        Map<Long, Question> questionMap = questionRepository.findAll().stream()
            .collect(Collectors.toMap(Question::getId, q -> q));

        return allBenefits.stream()
            .filter(benefit -> isEligible(benefit, user.getResponses(), questionMap))
            .collect(Collectors.toList());
    }

    private boolean isEligible(Benefit benefit, Map<Long, String> responses, Map<Long, Question> questionMap) {
        if (benefit.getRequirements() == null || benefit.getRequirements().isEmpty()) {
            return false;
        }

        // First check INVALID requirements - if any are met, user is not eligible
        boolean hasInvalidMatch = benefit.getRequirements().stream()
            .filter(req -> req.getType() == RequirementType.INVALID)
            .anyMatch(req -> meetsRequirement(req, responses, questionMap));
        
        if (hasInvalidMatch) {
            return false;
        }

        // Check NECESSARY requirements - all must be met
        boolean meetsAllNecessary = benefit.getRequirements().stream()
            .filter(req -> req.getType() == RequirementType.NECESSARY)
            .allMatch(req -> meetsRequirement(req, responses, questionMap));

        if (!meetsAllNecessary) {
            return false;
        }

        // Check GENERAL_NECESSARY requirements - all must be met if they exist
        List<Requirement> generalNecessaryReqs = benefit.getRequirements().stream()
            .filter(req -> req.getType() == RequirementType.GENERAL_NECESSARY)
            .collect(Collectors.toList());

        if (!generalNecessaryReqs.isEmpty()) {
            boolean meetsAllGeneralNecessary = generalNecessaryReqs.stream()
                .allMatch(req -> meetsRequirement(req, responses, questionMap));
            
            if (meetsAllGeneralNecessary) {
                return true;
            }
        }

        // Check GENERAL requirements - must meet at least one if they exist
        List<Requirement> generalReqs = benefit.getRequirements().stream()
            .filter(req -> req.getType() == RequirementType.GENERAL)
            .collect(Collectors.toList());

        // If no GENERAL requirements exist and we've passed all other checks, user is eligible
        if (generalReqs.isEmpty()) {
            return true;
        }

        // Must meet at least one GENERAL requirement
        return generalReqs.stream()
            .anyMatch(req -> meetsRequirement(req, responses, questionMap));
    }

    private boolean meetsRequirement(Requirement requirement, Map<Long, String> responses, Map<Long, Question> questionMap) {
        return requirement.getConditions().stream()
            .allMatch(condition -> {
                String response = responses.get(condition.getQuestionId());
                Question question = questionMap.get(condition.getQuestionId());
                
                // Missing response or question fails the condition
                if (response == null || response.trim().isEmpty() || question == null) {
                    return false;
                }

                return condition.evaluate(response, question);
            });
    }
}