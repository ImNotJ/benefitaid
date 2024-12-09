package com.example.benefits.service;

import com.example.benefits.entity.Question;
import com.example.benefits.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for managing Question entities.
 */
@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    /**
     * Saves a question entity.
     *
     * @param question the question entity to save
     * @return the saved question entity
     */
    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    /**
     * Gets a question by ID.
     *
     * @param id the ID of the question
     * @return the question entity, or null if not found
     */
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    /**
     * Gets all questions.
     *
     * @return a list of all question entities
     */
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    /**
     * Deletes a question by ID.
     *
     * @param id the ID of the question to delete
     */
    public void deleteQuestionById(Long id) {
        questionRepository.deleteById(id);
    }

    /**
     * Updates the options for a specific question.
     *
     * @param questionId the ID of the question to update
     * @param options    the new list of options
     * @return the updated question entity, or null if not found
     */
    public Question updateQuestionOptions(Long questionId, List<String> options) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question != null) {
            question.setOptions(options);
            return questionRepository.save(question);
        }
        return null;
    }

}