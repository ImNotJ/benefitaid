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
     * Creates a new question.
     *
     * @param question the question to create
     * @return the created question
     */
    @PostMapping
    public Question createQuestion(@Valid @RequestBody Question question) {
        return questionService.saveQuestion(question);
    }

    /**
     * Updates an existing question.
     *
     * @param id       the ID of the question to update
     * @param question the updated question object
     * @return the updated question
     */
    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @Valid @RequestBody Question question) {
        question.setId(id);
        return questionService.saveQuestion(question);
    }

    /**
     * Retrieves all questions.
     *
     * @return a list of all questions
     */
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // Other methods remain unchanged
}