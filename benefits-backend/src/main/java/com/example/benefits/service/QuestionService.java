package com.example.benefits.service;

import com.example.benefits.entity.Question;
import com.example.benefits.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public Question saveQuestion(Question question) {
        // Save the question entity
        Question savedQuestion = questionRepository.save(question);

        // Delete existing options
        questionRepository.deleteOptionsByQuestionId(savedQuestion.getId());

        // Insert new options
        List<String> options = question.getOptionsList();
        if (options != null && !options.isEmpty()) {
            for (String option : options) {
                questionRepository.insertOption(savedQuestion.getId(), option);
            }
        }

        return savedQuestion;
    }

    public Question getQuestionById(Long id) {
        Question question = questionRepository.findById(id).orElse(null);
        if (question != null) {
            List<String> options = questionRepository.findOptionsByQuestionId(id);
            question.setOptionsList(options);
        }
        return question;
    }

    public List<Question> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        for (Question question : questions) {
            List<String> options = questionRepository.findOptionsByQuestionId(question.getId());
            question.setOptionsList(options);
        }
        return questions;
    }

    public void deleteQuestionById(Long id) {
        // Delete options first
        questionRepository.deleteOptionsByQuestionId(id);
        // Then delete the question
        questionRepository.deleteById(id);
    }
}