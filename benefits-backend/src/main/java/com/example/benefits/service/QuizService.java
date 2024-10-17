package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.Question;
import com.example.benefits.entity.Quiz;
import com.example.benefits.repository.BenefitRepository;
import com.example.benefits.repository.QuestionRepository;
import com.example.benefits.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service class for managing Quiz entities.
 */
@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    /**
     * Saves a quiz entity.
     * Sets the questions and benefits for the quiz before saving.
     *
     * @param quiz the quiz entity to save
     * @return the saved quiz entity
     */
    public Quiz saveQuiz(Quiz quiz) {
        Set<Question> questions = new HashSet<>();
        for (Long questionId : quiz.getQuestionIds()) {
            Question question = questionRepository.findById(questionId).orElse(null);
            if (question != null) {
                questions.add(question);
            }
        }
        quiz.setQuestions(questions);

        Set<Benefit> benefits = new HashSet<>();
        for (Long benefitId : quiz.getBenefitIds()) {
            Benefit benefit = benefitRepository.findById(benefitId).orElse(null);
            if (benefit != null) {
                benefits.add(benefit);
            }
        }
        quiz.setBenefits(benefits);

        return quizRepository.save(quiz);
    }

    /**
     * Gets a quiz by ID.
     *
     * @param id the ID of the quiz
     * @return the quiz entity, or null if not found
     */
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElse(null);
    }

    /**
     * Gets all quizzes.
     *
     * @return a list of all quiz entities
     */
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    /**
     * Deletes a quiz by ID.
     *
     * @param id the ID of the quiz to delete
     */
    public void deleteQuizById(Long id) {
        quizRepository.deleteById(id);
    }
}