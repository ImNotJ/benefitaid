package com.example.benefits.entity;

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
    private String operator;

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
}