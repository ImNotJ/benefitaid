package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.Requirement;
import com.example.benefits.repository.BenefitRepository;
import com.example.benefits.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for managing Benefit entities.
 */
@Service
public class BenefitService {

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private RequirementRepository requirementRepository;

    /**
     * Saves a benefit entity.
     * Sets the benefit for each requirement before saving.
     *
     * @param benefit the benefit entity to save
     * @return the saved benefit entity
     */
    public Benefit saveBenefit(Benefit benefit) {
        for (Requirement requirement : benefit.getRequirements()) {
            requirement.setBenefit(benefit);
        }
        return benefitRepository.save(benefit);
    }

    /**
     * Gets a benefit by ID.
     *
     * @param id the ID of the benefit
     * @return the benefit entity, or null if not found
     */
    public Benefit getBenefitById(Long id) {
        return benefitRepository.findById(id).orElse(null);
    }

    /**
     * Gets all benefits.
     *
     * @return a list of all benefit entities
     */
    public List<Benefit> getAllBenefits() {
        return benefitRepository.findAll();
    }

    /**
     * Deletes a benefit by ID.
     *
     * @param id the ID of the benefit to delete
     */
    public void deleteBenefitById(Long id) {
        benefitRepository.deleteById(id);
    }

    /**
     * Saves a requirement entity.
     *
     * @param requirement the requirement entity to save
     * @return the saved requirement entity
     */
    public Requirement saveRequirement(Requirement requirement) {
        return requirementRepository.save(requirement);
    }

    /**
     * Deletes a requirement by ID.
     *
     * @param id the ID of the requirement to delete
     */
    public void deleteRequirementById(Long id) {
        requirementRepository.deleteById(id);
    }
}