package com.example.benefits.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String questionName;

    @NotBlank
    private String questionType;

    @NotBlank
    private String questionText;

    @Column(name = "options", columnDefinition = "TEXT")
    private String optionsString;

    // Getters and Setters

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

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<String> getOptions() {
        if (optionsString == null || optionsString.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(optionsString.split("\\|"));
    }

    public void setOptions(List<String> options) {
        if (options == null || options.isEmpty()) {
            this.optionsString = null;
        } else {
            this.optionsString = String.join("|", options);
        }
    }
}
