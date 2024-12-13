package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.Question;
import com.example.benefits.entity.User;
import com.example.benefits.entity.Requirement;

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
            .filter(req -> req.getType() == Requirement.RequirementType.INVALID)
            .anyMatch(req -> meetsRequirement(req, responses, questionMap));
        
        if (hasInvalidMatch) {
            return false;
        }

        // Check NECESSARY requirements - all must be met
        boolean meetsAllNecessary = benefit.getRequirements().stream()
            .filter(req -> req.getType() == Requirement.RequirementType.NECESSARY)
            .allMatch(req -> meetsRequirement(req, responses, questionMap));

        if (!meetsAllNecessary) {
            return false;
        }

        // Check GENERAL_NECESSARY requirements - all must be met
        List<Requirement> generalNecessaryReqs = benefit.getRequirements().stream()
            .filter(req -> req.getType() == Requirement.RequirementType.GENERAL_NECESSARY)
            .collect(Collectors.toList());

        if (!generalNecessaryReqs.isEmpty()) {
            boolean meetsAllGeneralNecessary = generalNecessaryReqs.stream()
                .allMatch(req -> meetsRequirement(req, responses, questionMap));
            
            // If meets all GENERAL_NECESSARY, user is eligible regardless of GENERAL requirements
            if (meetsAllGeneralNecessary) {
                return true;
            }
        }

        // If no GENERAL_NECESSARY requirements exist or they weren't all met,
        // check if at least one GENERAL requirement is met
        List<Requirement> generalReqs = benefit.getRequirements().stream()
            .filter(req -> req.getType() == Requirement.RequirementType.GENERAL)
            .collect(Collectors.toList());

        if (generalReqs.isEmpty()) {
            // If no GENERAL requirements and we've passed all other checks, user is eligible
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
                
                if (response == null || question == null) {
                    return false;
                }

                return condition.evaluate(response, question);
            });
    }
}