package com.example.benefits.service;

import com.example.benefits.entity.Quiz;
import com.example.benefits.repository.QuizRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuizService quizService;

    public QuizServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveQuiz() {
        Quiz quiz = new Quiz();
        quiz.setQuizName("Test Quiz");

        when(quizRepository.save(quiz)).thenReturn(quiz);

        Quiz savedQuiz = quizService.saveQuiz(quiz);

        assertEquals("Test Quiz", savedQuiz.getQuizName());
        verify(quizRepository, times(1)).save(quiz);
    }

    @Test
    public void testGetQuizById() {
        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setQuizName("Test Quiz");

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        Quiz foundQuiz = quizService.getQuizById(1L);

        assertEquals("Test Quiz", foundQuiz.getQuizName());
        verify(quizRepository, times(1)).findById(1L);
    }
}