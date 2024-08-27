package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.User;
import com.example.benefits.repository.BenefitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EligibilityService {
    @Autowired
    private BenefitRepository benefitRepository;

    public List<Benefit> checkEligibility(User user) {
        List<Benefit> benefits = benefitRepository.findAll();
        // Implement eligibility logic based on user responses and benefit requirements
        // For example, check if user responses meet the benefit requirements
        return benefits;
    }
}