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

        // Check NECESSARY requirements - must meet all of these
        boolean meetsAllNecessary = benefit.getRequirements().stream()
            .filter(req -> req.getType() == Requirement.RequirementType.NECESSARY)
            .allMatch(req -> meetsRequirement(req, responses, questionMap));

        if (!meetsAllNecessary) {
            return false;
        }

        // Check GENERAL_NECESSARY requirements - must meet all of these as well
        boolean hasGeneralNecessary = benefit.getRequirements().stream()
            .anyMatch(req -> req.getType() == Requirement.RequirementType.GENERAL_NECESSARY);

        if (hasGeneralNecessary) {
            boolean meetsAllGeneralNecessary = benefit.getRequirements().stream()
                .filter(req -> req.getType() == Requirement.RequirementType.GENERAL_NECESSARY)
                .allMatch(req -> meetsRequirement(req, responses, questionMap));

            if (!meetsAllGeneralNecessary) {
                return false;
            }
        }

        // Check GENERAL requirements - must meet at least one if they exist
        boolean hasGeneral = benefit.getRequirements().stream()
            .anyMatch(req -> req.getType() == Requirement.RequirementType.GENERAL);

        if (!hasGeneral) {
            return true; // If no general requirements and passed all other checks
        }

        // Must meet at least one GENERAL requirement if they exist
        return benefit.getRequirements().stream()
            .filter(req -> req.getType() == Requirement.RequirementType.GENERAL)
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