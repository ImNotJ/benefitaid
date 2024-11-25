package com.example.benefits.service;

import com.example.benefits.entity.*;
import com.example.benefits.repository.BenefitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for checking user eligibility for benefits.
 */
@Service
public class EligibilityService {

    @Autowired
    private BenefitRepository benefitRepository;

    /**
     * Checks the eligibility of a user for various benefits.
     *
     * @param user the user entity containing the information to check eligibility
     * @return a list of benefits the user is eligible for
     */
    public List<Benefit> checkEligibility(User user) {
        List<Benefit> benefits = benefitRepository.findAll();
        return benefits.stream()
                .filter(benefit -> isEligibleForBenefit(user, benefit))
                .collect(Collectors.toList());
    }

    private boolean isEligibleForBenefit(User user, Benefit benefit) {
        boolean hasNecessary = true;
        boolean hasGeneralNecessary = false;
        boolean hasGeneral = false;
        boolean hasAuto = false;

        for (Requirement requirement : benefit.getRequirements()) {
            boolean meetsRequirement = requirement.getConditions().stream()
                    .allMatch(condition -> evaluateCondition(user, condition));

            switch (requirement.getType()) {
                case "Invalid":
                    if (meetsRequirement) {
                        return false;
                    }
                    break;
                case "Auto":
                    if (meetsRequirement) {
                        hasAuto = true;
                    }
                    break;
                case "Necessary":
                    if (!meetsRequirement) {
                        hasNecessary = false;
                    }
                    break;
                case "General + Necessary":
                    if (meetsRequirement) {
                        hasGeneralNecessary = true;
                    }
                    break;
                case "General":
                    if (meetsRequirement) {
                        hasGeneral = true;
                    }
                    break;
                default:
                    break;
            }
        }

        return hasAuto || (hasNecessary && (hasGeneralNecessary || hasGeneral));
    }

    private boolean evaluateCondition(User user, Condition condition) {
        String userResponse = user.getResponses().get(condition.getQuestionId());
        if (userResponse == null || userResponse.isEmpty()) {
            return false;
        }

        // Retrieve the question type (we may need to fetch it from the repository)
        // For this example, let's assume we have a method getQuestionById()
        Question question = getQuestionById(condition.getQuestionId());

        switch (question.getQuestionType()) {
            case "Numerical":
            case "Date":
                return evaluateNumericalCondition(userResponse, condition);
            case "Text":
            case "Email":
            case "State":
                return evaluateTextCondition(userResponse, condition);
            case "MultiChoice":
                return evaluateMultiChoiceCondition(userResponse, condition);
            default:
                return false;
        }
    }

    private boolean evaluateNumericalCondition(String userResponse, Condition condition) {
        try {
            double userValue = Double.parseDouble(userResponse);
            double conditionValue = Double.parseDouble(condition.getValue());
            switch (condition.getOperator()) {
                case "<=":
                    return userValue <= conditionValue;
                case ">=":
                    return userValue >= conditionValue;
                case "<":
                    return userValue < conditionValue;
                case ">":
                    return userValue > conditionValue;
                case "==":
                    return userValue == conditionValue;
                case "!=":
                    return userValue != conditionValue;
                default:
                    return false;
            }
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean evaluateTextCondition(String userResponse, Condition condition) {
        switch (condition.getOperator()) {
            case "==":
                return userResponse.equalsIgnoreCase(condition.getValue());
            case "!=":
                return !userResponse.equalsIgnoreCase(condition.getValue());
            default:
                return false;
        }
    }

    private boolean evaluateMultiChoiceCondition(String userResponse, Condition condition) {
        // userResponse is a comma-separated string of selected options
        String[] userOptions = userResponse.split(",");
        String[] conditionValues = condition.getValue().split(",");

        for (String userOption : userOptions) {
            for (String conditionValue : conditionValues) {
                if (conditionValue.trim().equalsIgnoreCase(userOption.trim())) {
                    switch (condition.getOperator()) {
                        case "==":
                            return true;
                        case "!=":
                            return false;
                        default:
                            break;
                    }
                }
            }
        }
        return condition.getOperator().equals("!=");
    }

    private Question getQuestionById(Long questionId) {
        // Implement this method to retrieve the question by ID from the repository
        // For this example, we'll return a dummy question
        return new Question(); // Replace with actual implementation
    }
}