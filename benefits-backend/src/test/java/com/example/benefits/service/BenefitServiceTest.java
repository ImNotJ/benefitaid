package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.repository.BenefitRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class BenefitServiceTest {

    @Mock
    private BenefitRepository benefitRepository;

    @InjectMocks
    private BenefitService benefitService;

    public BenefitServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveBenefit() {
        Benefit benefit = new Benefit();
        benefit.setBenefitName("Test Benefit");

        when(benefitRepository.save(benefit)).thenReturn(benefit);

        Benefit savedBenefit = benefitService.saveBenefit(benefit);

        assertEquals("Test Benefit", savedBenefit.getBenefitName());
        verify(benefitRepository, times(1)).save(benefit);
    }

    @Test
    public void testGetBenefitById() {
        Benefit benefit = new Benefit();
        benefit.setId(1L);
        benefit.setBenefitName("Test Benefit");

        when(benefitRepository.findById(1L)).thenReturn(Optional.of(benefit));

        Benefit foundBenefit = benefitService.getBenefitById(1L);

        assertEquals("Test Benefit", foundBenefit.getBenefitName());
        verify(benefitRepository, times(1)).findById(1L);
    }
}