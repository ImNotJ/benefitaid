package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.User;
import com.example.benefits.repository.BenefitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for checking user eligibility for benefits.
 */
@Service
public class EligibilityService {

    @Autowired
    private BenefitRepository benefitRepository;

    /**
     * Checks the eligibility of a user for various benefits.
     *
     * @param user the user entity containing the information to check eligibility
     * @return a list of benefits the user is eligible for
     */
    public List<Benefit> checkEligibility(User user) {
        List<Benefit> benefits = benefitRepository.findAll();
        // Implement eligibility logic based on user responses and benefit requirements
        // For example, check if user responses meet the benefit requirements
        return benefits;
    }
}