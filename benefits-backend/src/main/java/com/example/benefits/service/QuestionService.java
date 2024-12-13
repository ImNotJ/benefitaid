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

    public Question saveQuestion(Question question) {
        // Save question and options
        return questionRepository.save(question);
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public void deleteQuestionById(Long id) {
        questionRepository.deleteById(id);
    }
}