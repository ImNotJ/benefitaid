package com.example.benefits.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String questionName;

    @NotBlank
    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    @NotBlank
    private String questionText;
    
    // For multi-choice questions, stores options as comma-separated string
    @Column(columnDefinition = "TEXT")
    private String options;

    public enum QuestionType {
        TEXT,           // Any plain text
        NUMERICAL,      // Must be a number
        DATE,          // Must be MM/DD/YYYY
        EMAIL,         // Must be valid email
        MULTI_CHOICE   // Multiple options, user can select multiple
    }

    // Standard getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionName() {
        return questionName;
    }

    public void setQuestionName(String questionName) {
        this.questionName = questionName;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    // Helper method to get options as array
    public String[] getOptionsArray() {
        return options != null ? options.split(",") : new String[0];
    }

    // Helper method to set options from array
    public void setOptionsArray(String[] optionsArray) {
        this.options = String.join(",", optionsArray);
    }
}