package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.Requirement;
import com.example.benefits.repository.BenefitRepository;
import com.example.benefits.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BenefitService {
    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private RequirementRepository requirementRepository;

    public Benefit saveBenefit(Benefit benefit) {
        for (Requirement requirement : benefit.getRequirements()) {
            requirement.setBenefit(benefit);
        }
        return benefitRepository.save(benefit);
    }

    public Benefit getBenefitById(Long id) {
        return benefitRepository.findById(id).orElse(null);
    }

    public List<Benefit> getAllBenefits() {
        return benefitRepository.findAll();
    }

    public void deleteBenefitById(Long id) {
        benefitRepository.deleteById(id);
    }

    public Requirement saveRequirement(Requirement requirement) {
        return requirementRepository.save(requirement);
    }

    public void deleteRequirementById(Long id) {
        requirementRepository.deleteById(id);
    }
}