package com.example.benefits.entity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Transient;
/**
 * Entity class representing a Question.
 */
@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String questionName;

    @NotBlank
    private String questionType; // Text, Numerical, Date, Email, MultiChoiceSingle, MultiChoiceMulti

    @NotBlank
    private String questionText;
    
    @Column(columnDefinition = "TEXT")
    private String options;

    // Getters and Setters

    /**
     * Gets the ID of the question.
     *
     * @return the ID of the question
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the ID of the question.
     *
     * @param id the ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the name of the question.
     *
     * @return the name of the question
     */
    public String getQuestionName() {
        return questionName;
    }

    /**
     * Sets the name of the question.
     *
     * @param questionName the name to set
     */
    public void setQuestionName(String questionName) {
        this.questionName = questionName;
    }

    /**
     * Gets the type of the question.
     *
     * @return the type of the question
     */
    public String getQuestionType() {
        return questionType;
    }

    /**
     * Sets the type of the question.
     *
     * @param questionType the type to set
     */
    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    /**
     * Gets the text of the question.
     *
     * @return the text of the question
     */
    public String getQuestionText() {
        return questionText;
    }

    /**
     * Sets the text of the question.
     *
     * @param questionText the text to set
     */
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
    public String getOptions() {
        return options;
    }
    public void setOptions(String options) {
        this.options = options;
    }
    // Helper method to get options as list
    @Transient
    public List<String> getOptionsList() {
        if (options == null || options.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(options.split(","));
    }
}