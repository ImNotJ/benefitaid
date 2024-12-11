package com.example.benefits.entity;

import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Embeddable
public class Condition {

    @NotNull
    private Long questionId;

    @NotNull
    @Enumerated(EnumType.STRING)
    private OperatorType operator;

    @NotBlank
    private String value;  // For multi-choice, this will be comma-separated options

    public enum OperatorType {
        EQUALS("="),
        NOT_EQUALS("!="),
        GREATER_THAN(">"),
        LESS_THAN("<"),
        GREATER_THAN_EQUALS(">="),
        LESS_THAN_EQUALS("<=");

        private final String symbol;

        OperatorType(String symbol) {
            this.symbol = symbol;
        }

        public String getSymbol() {
            return symbol;
        }
    }

    // Getters and Setters
    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public OperatorType getOperator() {
        return operator;
    }

    public void setOperator(OperatorType operator) {
        this.operator = operator;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    // Helper methods for multi-choice comparison
    public String[] getValueArray() {
        return value != null ? value.split(",") : new String[0];
    }

    public void setValueArray(String[] valueArray) {
        this.value = String.join(",", valueArray);
    }

    /**
     * Checks if a user's response meets this condition.
     *
     * @param userResponse The user's response to the question
     * @param questionType The type of question this condition is for
     * @return true if the condition is met, false otherwise
     */
    public boolean isConditionMet(String userResponse, Question.QuestionType questionType) {
        if (userResponse == null || userResponse.isEmpty()) {
            return false;
        }

        switch (questionType) {
            case MULTI_CHOICE:
                // For multi-choice, check if any user-selected option matches any condition value
                String[] userOptions = userResponse.split(",");
                String[] conditionOptions = getValueArray();
                for (String userOption : userOptions) {
                    for (String conditionOption : conditionOptions) {
                        if (userOption.trim().equals(conditionOption.trim())) {
                            return true;
                        }
                    }
                }
                return false;

            case NUMERICAL:
                try {
                    double userValue = Double.parseDouble(userResponse);
                    double conditionValue = Double.parseDouble(value);
                    return compareNumerical(userValue, conditionValue);
                } catch (NumberFormatException e) {
                    return false;
                }

            default:
                // For text, email, and date, use simple string comparison
                return switch (operator) {
                    case EQUALS -> userResponse.equals(value);
                    case NOT_EQUALS -> !userResponse.equals(value);
                    default -> false;
                };
        }
    }

    private boolean compareNumerical(double userValue, double conditionValue) {
        return switch (operator) {
            case EQUALS -> userValue == conditionValue;
            case NOT_EQUALS -> userValue != conditionValue;
            case GREATER_THAN -> userValue > conditionValue;
            case LESS_THAN -> userValue < conditionValue;
            case GREATER_THAN_EQUALS -> userValue >= conditionValue;
            case LESS_THAN_EQUALS -> userValue <= conditionValue;
        };
    }
}