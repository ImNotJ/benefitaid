package com.example.benefits.entity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;

/**
 * Embeddable class representing a Condition.
 * This class is used to define conditions for eligibility requirements.
 */
@Embeddable
public class Condition {

    private Long questionId;

    @NotBlank
    private String operator; // =, !=, >, <, >=, <=

    @NotBlank
    private String value;

    // Getters and Setters

    /**
     * Gets the ID of the question associated with the condition.
     *
     * @return the ID of the question
     */
    public Long getQuestionId() {
        return questionId;
    }

    /**
     * Sets the ID of the question associated with the condition.
     *
     * @param questionId the question ID to set
     */
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    /**
     * Gets the operator of the condition.
     *
     * @return the operator of the condition
     */
    public String getOperator() {
        return operator;
    }

    /**
     * Sets the operator of the condition.
     *
     * @param operator the operator to set
     */
    public void setOperator(String operator) {
        this.operator = operator;
    }

    /**
     * Gets the value of the condition.
     *
     * @return the value of the condition
     */
    public String getValue() {
        return value;
    }

    /**
     * Sets the value of the condition.
     *
     * @param value the value to set
     */
    public void setValue(String value) {
        this.value = value;
    }

    public boolean evaluate(String userResponse, Question question) {
        if (userResponse == null || userResponse.trim().isEmpty()) {
            return false;
        }

        switch (question.getQuestionType()) {
            case "Numerical":
                return evaluateNumerical(userResponse);
            case "Date":
                return evaluateDate(userResponse);
            case "MultiChoiceSingle":
            case "MultiChoiceMulti":
                return evaluateMultiChoice(userResponse);
            default:
                return evaluateText(userResponse);
        }
    }

    private boolean evaluateNumerical(String userResponse) {
        try {
            double userValue = Double.parseDouble(userResponse);
            double conditionValue = Double.parseDouble(value);
            
            switch (operator) {
                case "=": return userValue == conditionValue;
                case "!=": return userValue != conditionValue;
                case ">": return userValue > conditionValue;
                case "<": return userValue < conditionValue;
                case ">=": return userValue >= conditionValue;
                case "<=": return userValue <= conditionValue;
                default: return false;
            }
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean evaluateDate(String userResponse) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
            Date userDate = sdf.parse(userResponse);
            Date conditionDate = sdf.parse(value);
            
            int comparison = userDate.compareTo(conditionDate);
            switch (operator) {
                case "=": return comparison == 0;
                case "!=": return comparison != 0;
                case ">": return comparison > 0;
                case "<": return comparison < 0;
                case ">=": return comparison >= 0;
                case "<=": return comparison <= 0;
                default: return false;
            }
        } catch (ParseException e) {
            return false;
        }
    }

    private boolean evaluateMultiChoice(String userResponse) {
        List<String> userSelections = Arrays.asList(userResponse.split(","));
        
        switch (operator) {
            case "=":
                return userSelections.contains(value.trim());
            case "!=":
                return !userSelections.contains(value.trim());
            default:
                return false;
        }
    }

    private boolean evaluateText(String userResponse) {
        switch (operator) {
            case "=":
                return userResponse.equals(value);
            case "!=":
                return !userResponse.equals(value);
            default:
                return false;
        }
    }
}