package com.example.benefits.service;

import com.example.benefits.entity.*;
import com.example.benefits.repository.BenefitRepository;
import com.example.benefits.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EligibilityService {

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private QuestionRepository questionRepository;

    /**
     * Checks eligibility for benefits based on user responses.
     * 
     * @param userResponses Map of question IDs to user responses
     * @return List of benefits the user is eligible for
     */
    public List<Benefit> checkEligibility(Map<Long, String> userResponses) {
        List<Benefit> allBenefits = benefitRepository.findAll();
        Map<Long, Question> questionMap = questionRepository.findAll().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        return allBenefits.stream()
                .filter(benefit -> isEligibleForBenefit(benefit, userResponses, questionMap))
                .collect(Collectors.toList());
    }

    /**
     * Determines if a user is eligible for a specific benefit.
     */
    private boolean isEligibleForBenefit(Benefit benefit, Map<Long, String> userResponses, Map<Long, Question> questionMap) {
        Set<Requirement> requirements = benefit.getRequirements();
        if (requirements == null || requirements.isEmpty()) {
            return false;
        }

        // Check Invalid requirements first - if any are met, user is not eligible
        boolean hasInvalidRequirement = requirements.stream()
                .filter(req -> req.getType() == Requirement.RequirementType.INVALID)
                .anyMatch(req -> isRequirementMet(req, userResponses, questionMap));
        if (hasInvalidRequirement) {
            return false;
        }

        // Check Necessary requirements - all must be met
        boolean allNecessaryMet = requirements.stream()
                .filter(req -> req.getType() == Requirement.RequirementType.NECESSARY)
                .allMatch(req -> isRequirementMet(req, userResponses, questionMap));
        if (!allNecessaryMet) {
            return false;
        }

        // Check General+Necessary requirements
        Set<Requirement> generalNecessaryReqs = requirements.stream()
                .filter(req -> req.getType() == Requirement.RequirementType.GENERAL_NECESSARY)
                .collect(Collectors.toSet());
        
        // If there are General+Necessary requirements, at least one must be met
        if (!generalNecessaryReqs.isEmpty()) {
            boolean anyGeneralNecessaryMet = generalNecessaryReqs.stream()
                    .anyMatch(req -> isRequirementMet(req, userResponses, questionMap));
            return anyGeneralNecessaryMet;
        }

        // If no General+Necessary requirements exist, check General requirements
        // At least one General requirement must be met
        return requirements.stream()
                .filter(req -> req.getType() == Requirement.RequirementType.GENERAL)
                .anyMatch(req -> isRequirementMet(req, userResponses, questionMap));
    }

    /**
     * Checks if all conditions for a requirement are met.
     */
    private boolean isRequirementMet(Requirement requirement, Map<Long, String> userResponses, Map<Long, Question> questionMap) {
        Set<Condition> conditions = requirement.getConditions();
        if (conditions == null || conditions.isEmpty()) {
            return false;
        }

        return conditions.stream().allMatch(condition -> {
            String userResponse = userResponses.get(condition.getQuestionId());
            Question question = questionMap.get(condition.getQuestionId());
            
            // If question not found or no response provided, condition is not met
            if (question == null || userResponse == null || userResponse.isEmpty()) {
                return false;
            }

            return condition.isConditionMet(userResponse, question.getQuestionType());
        });
    }
}