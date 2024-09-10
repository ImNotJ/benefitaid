package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.repository.BenefitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BenefitService {
    @Autowired
    private BenefitRepository benefitRepository;

    public Benefit saveBenefit(Benefit benefit) {
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
}