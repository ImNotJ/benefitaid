package com.example.benefits.controller;

import com.example.benefits.entity.Benefit;
import com.example.benefits.service.BenefitService;
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

public class BenefitControllerTest {

    @Mock
    private BenefitService benefitService;

    @InjectMocks
    private BenefitController benefitController;

    private MockMvc mockMvc;

    public BenefitControllerTest() {
        MockitoAnnotations.openMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(benefitController).build();
    }

    @Test
    public void testCreateBenefit() throws Exception {
        Benefit benefit = new Benefit();
        benefit.setBenefitName("Test Benefit");

        when(benefitService.saveBenefit(any(Benefit.class))).thenReturn(benefit);

        mockMvc.perform(post("/api/benefits")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"benefitName\":\"Test Benefit\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.benefitName").value("Test Benefit"));

        verify(benefitService, times(1)).saveBenefit(any(Benefit.class));
    }

    @Test
    public void testGetBenefitById() throws Exception {
        Benefit benefit = new Benefit();
        benefit.setId(1L);
        benefit.setBenefitName("Test Benefit");

        when(benefitService.getBenefitById(1L)).thenReturn(benefit);

        mockMvc.perform(get("/api/benefits/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.benefitName").value("Test Benefit"));

        verify(benefitService, times(1)).getBenefitById(1L);
    }

    @Test
    public void testGetAllBenefits() throws Exception {
        Benefit benefit1 = new Benefit();
        benefit1.setBenefitName("Test Benefit 1");

        Benefit benefit2 = new Benefit();
        benefit2.setBenefitName("Test Benefit 2");

        when(benefitService.getAllBenefits()).thenReturn(Arrays.asList(benefit1, benefit2));

        mockMvc.perform(get("/api/benefits"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].benefitName").value("Test Benefit 1"))
                .andExpect(jsonPath("$[1].benefitName").value("Test Benefit 2"));

        verify(benefitService, times(1)).getAllBenefits();
    }

    @Test
    public void testDeleteBenefitById() throws Exception {
        doNothing().when(benefitService).deleteBenefitById(1L);

        mockMvc.perform(delete("/api/benefits/1"))
                .andExpect(status().isOk());

        verify(benefitService, times(1)).deleteBenefitById(1L);
    }
}