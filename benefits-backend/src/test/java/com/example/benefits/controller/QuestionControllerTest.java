package com.example.benefits.controller;

import com.example.benefits.entity.Question;
import com.example.benefits.service.QuestionService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class QuestionControllerTest {

    @Mock
    private QuestionService questionService;

    @InjectMocks
    private QuestionController questionController;

    private MockMvc mockMvc;

    public QuestionControllerTest() {
        MockitoAnnotations.openMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(questionController).build();
    }

    @Test
    public void testCreateQuestion() throws Exception {
        Question question = new Question();
        question.setQuestionName("Test Question");
        question.setQuestionType("Multiple Choice"); // Add this field
        question.setQuestionText("What is your favorite color?"); // Add this field

        when(questionService.saveQuestion(any(Question.class))).thenReturn(question);

        mockMvc.perform(post("/api/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"questionName\":\"Test Question\", \"questionType\":\"Multiple Choice\", \"questionText\":\"What is your favorite color?\"}")) // Add
                                                                                                                                                          // these
                                                                                                                                                          // fields
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionName").value("Test Question"))
                .andExpect(jsonPath("$.questionType").value("Multiple Choice")) // Add this check
                .andExpect(jsonPath("$.questionText").value("What is your favorite color?")); // Add this check

        verify(questionService, times(1)).saveQuestion(any(Question.class));
    }

    @Test
    public void testGetQuestionById() throws Exception {
        Question question = new Question();
        question.setId(1L);
        question.setQuestionName("Test Question");

        when(questionService.getQuestionById(1L)).thenReturn(question);

        mockMvc.perform(get("/api/questions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionName").value("Test Question"));

        verify(questionService, times(1)).getQuestionById(1L);
    }

    @Test
    public void testGetAllQuestions() throws Exception {
        Question question1 = new Question();
        question1.setQuestionName("Test Question 1");

        Question question2 = new Question();
        question2.setQuestionName("Test Question 2");

        when(questionService.getAllQuestions()).thenReturn(Arrays.asList(question1, question2));

        mockMvc.perform(get("/api/questions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionName").value("Test Question 1"))
                .andExpect(jsonPath("$[1].questionName").value("Test Question 2"));

        verify(questionService, times(1)).getAllQuestions();
    }

    @Test
    public void testDeleteQuestionById() throws Exception {
        doNothing().when(questionService).deleteQuestionById(1L);

        mockMvc.perform(delete("/api/questions/1"))
                .andExpect(status().isOk());

        verify(questionService, times(1)).deleteQuestionById(1L);
    }
}