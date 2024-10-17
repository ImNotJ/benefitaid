package com.example.benefits.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;

/**
 * Entity class representing a Quiz.
 */
@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String quizName;

    @ElementCollection
    @CollectionTable(name = "quiz_question_ids", joinColumns = @JoinColumn(name = "quiz_id"))
    @Column(name = "question_id")
    @OrderColumn // Ensure order is maintained
    private List<Long> questionIds = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "quiz_questions",
        joinColumns = @JoinColumn(name = "quiz_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private Set<Question> questions = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "quiz_benefit_ids", joinColumns = @JoinColumn(name = "quiz_id"))
    @Column(name = "benefit_id")
    private Set<Long> benefitIds = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "quiz_benefits",
        joinColumns = @JoinColumn(name = "quiz_id"),
        inverseJoinColumns = @JoinColumn(name = "benefit_id")
    )
    private Set<Benefit> benefits = new HashSet<>();

    // Getters and Setters

    /**
     * Gets the ID of the quiz.
     *
     * @return the ID of the quiz
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the ID of the quiz.
     *
     * @param id the ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the name of the quiz.
     *
     * @return the name of the quiz
     */
    public String getQuizName() {
        return quizName;
    }

    /**
     * Sets the name of the quiz.
     *
     * @param quizName the name to set
     */
    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    /**
     * Gets the list of question IDs associated with the quiz.
     *
     * @return the list of question IDs
     */
    public List<Long> getQuestionIds() {
        return questionIds;
    }

    /**
     * Sets the list of question IDs associated with the quiz.
     *
     * @param questionIds the list of question IDs to set
     */
    public void setQuestionIds(List<Long> questionIds) {
        this.questionIds = questionIds;
    }

    /**
     * Gets the set of questions associated with the quiz.
     *
     * @return the set of questions
     */
    public Set<Question> getQuestions() {
        return questions;
    }

    /**
     * Sets the set of questions associated with the quiz.
     *
     * @param questions the set of questions to set
     */
    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }

    /**
     * Gets the set of benefit IDs associated with the quiz.
     *
     * @return the set of benefit IDs
     */
    public Set<Long> getBenefitIds() {
        return benefitIds;
    }

    /**
     * Sets the set of benefit IDs associated with the quiz.
     *
     * @param benefitIds the set of benefit IDs to set
     */
    public void setBenefitIds(Set<Long> benefitIds) {
        this.benefitIds = benefitIds;
    }

    /**
     * Gets the set of benefits associated with the quiz.
     *
     * @return the set of benefits
     */
    public Set<Benefit> getBenefits() {
        return benefits;
    }

    /**
     * Sets the set of benefits associated with the quiz.
     *
     * @param benefits the set of benefits to set
     */
    public void setBenefits(Set<Benefit> benefits) {
        this.benefits = benefits;
    }
}