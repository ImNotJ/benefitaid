package com.example.benefits.controller;

import com.example.benefits.entity.Quiz;
import com.example.benefits.service.QuizService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class QuizControllerTest {

    @Mock
    private QuizService quizService;

    @InjectMocks
    private QuizController quizController;

    private MockMvc mockMvc;

    public QuizControllerTest() {
        MockitoAnnotations.openMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(quizController).build();
    }

    @Test
    public void testCreateQuiz() throws Exception {
        Quiz quiz = new Quiz();
        quiz.setQuizName("Test Quiz");

        when(quizService.saveQuiz(any(Quiz.class))).thenReturn(quiz);

        mockMvc.perform(post("/api/quizzes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"quizName\":\"Test Quiz\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quizName").value("Test Quiz"));

        verify(quizService, times(1)).saveQuiz(any(Quiz.class));
    }

    @Test
    public void testGetQuizById() throws Exception {
        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setQuizName("Test Quiz");

        when(quizService.getQuizById(1L)).thenReturn(quiz);

        mockMvc.perform(get("/api/quizzes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quizName").value("Test Quiz"));

        verify(quizService, times(1)).getQuizById(1L);
    }

    @Test
    public void testGetAllQuizzes() throws Exception {
        Quiz quiz1 = new Quiz();
        quiz1.setQuizName("Test Quiz 1");

        Quiz quiz2 = new Quiz();
        quiz2.setQuizName("Test Quiz 2");

        when(quizService.getAllQuizzes()).thenReturn(Arrays.asList(quiz1, quiz2));

        mockMvc.perform(get("/api/quizzes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quizName").value("Test Quiz 1"))
                .andExpect(jsonPath("$[1].quizName").value("Test Quiz 2"));

        verify(quizService, times(1)).getAllQuizzes();
    }

    @Test
    public void testDeleteQuizById() throws Exception {
        doNothing().when(quizService).deleteQuizById(1L);

        mockMvc.perform(delete("/api/quizzes/1"))
                .andExpect(status().isOk());

        verify(quizService, times(1)).deleteQuizById(1L);
    }
}