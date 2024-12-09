package com.example.benefits.controller;

import com.example.benefits.entity.Question;
import com.example.benefits.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing Question entities.
 */
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    /**
     * Endpoint to create a new question.
     *
     * @param question the question entity to create
     * @return the created question entity
     */
    @PostMapping
    public Question createQuestion(@Valid @RequestBody Question question) {
        return questionService.saveQuestion(question);
    }

    /**
     * Endpoint to get a question by ID.
     *
     * @param id the ID of the question
     * @return the question entity
     */
    @GetMapping("/{id}")
    public Question getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id);
    }

    /**
     * Endpoint to get all questions.
     *
     * @return a list of all question entities
     */
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    /**
     * Endpoint to update a question.
     *
     * @param id       the ID of the question to update
     * @param question the updated question entity
     * @return the updated question entity
     */
    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @Valid @RequestBody Question updatedQuestion) {
        // Fetch the existing question
        Question existingQuestion = questionService.getQuestionById(id);
        if (existingQuestion == null) {
            throw new IllegalArgumentException("Question with ID " + id + " not found");
        }

        // Update fields
        existingQuestion.setQuestionName(updatedQuestion.getQuestionName());
        existingQuestion.setQuestionType(updatedQuestion.getQuestionType());
        existingQuestion.setQuestionText(updatedQuestion.getQuestionText());

        // Retain existing options if not provided
        if (updatedQuestion.getOptions() != null && !updatedQuestion.getOptions().isEmpty()) {
            existingQuestion.setOptions(updatedQuestion.getOptions());
        }

        // Save and return the updated question
        return questionService.saveQuestion(existingQuestion);
    }

    /**
     * Endpoint to delete a question by ID.
     *
     * @param id the ID of the question to delete
     */
    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestionById(id);
    }
}