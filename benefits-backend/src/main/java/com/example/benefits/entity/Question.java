    package com.example.benefits.entity;

    import javax.persistence.*;
    import javax.validation.constraints.NotBlank;
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

        @ElementCollection
        @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
        @Column(name = "option_value")
        private List<String> options; // Store options as a list of strings

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
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }

    }