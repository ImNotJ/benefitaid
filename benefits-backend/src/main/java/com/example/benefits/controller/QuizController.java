package com.example.benefits.controller;

import com.example.benefits.entity.Quiz;
import com.example.benefits.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing Quiz entities.
 */
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    /**
     * Endpoint to create a new quiz.
     *
     * @param quiz the quiz entity to create
     * @return the created quiz entity
     */
    @PostMapping
    public Quiz createQuiz(@Valid @RequestBody Quiz quiz) {
        return quizService.saveQuiz(quiz);
    }

    /**
     * Endpoint to get a quiz by ID.
     *
     * @param id the ID of the quiz
     * @return the quiz entity
     */
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    /**
     * Endpoint to get all quizzes.
     *
     * @return a list of all quiz entities
     */
    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    /**
     * Endpoint to update a quiz.
     *
     * @param id   the ID of the quiz to update
     * @param quiz the updated quiz entity
     * @return the updated quiz entity
     */
    @PutMapping("/{id}")
    public Quiz updateQuiz(@PathVariable Long id, @Valid @RequestBody Quiz quiz) {
        quiz.setId(id);
        return quizService.saveQuiz(quiz);
    }

    /**
     * Endpoint to delete a quiz by ID.
     *
     * @param id the ID of the quiz to delete
     */
    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuizById(id);
    }
}