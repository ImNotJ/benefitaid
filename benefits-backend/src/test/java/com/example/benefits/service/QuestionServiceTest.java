package com.example.benefits.service;

import com.example.benefits.entity.Question;
import com.example.benefits.repository.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuestionService questionService;

    public QuestionServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveQuestion() {
        Question question = new Question();
        question.setQuestionName("Test Question");

        when(questionRepository.save(question)).thenReturn(question);

        Question savedQuestion = questionService.saveQuestion(question);

        assertEquals("Test Question", savedQuestion.getQuestionName());
        verify(questionRepository, times(1)).save(question);
    }

    @Test
    public void testGetQuestionById() {
        Question question = new Question();
        question.setId(1L);
        question.setQuestionName("Test Question");

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));

        Question foundQuestion = questionService.getQuestionById(1L);

        assertEquals("Test Question", foundQuestion.getQuestionName());
        verify(questionRepository, times(1)).findById(1L);
    }
}