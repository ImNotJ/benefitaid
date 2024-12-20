package com.example.benefits.service;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.Requirement;
import com.example.benefits.repository.BenefitRepository;
import com.example.benefits.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Logger;

/**
 * Service class for managing Benefit entities.
 */
@Service
public class BenefitService {

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private RequirementRepository requirementRepository;

    private static final Logger logger = Logger.getLogger(BenefitService.class.getName());

    /**
     * Saves a benefit entity.
     * Sets the benefit for each requirement before saving.
     *
     * @param benefit the benefit entity to save
     * @return the saved benefit entity
     */
    public Benefit saveBenefit(Benefit benefit) {
        // Ensure null values are preserved rather than omitted
        if (benefit != null) {
            // If updating an existing benefit, preserve existing values if not provided
            if (benefit.getId() != null) {
                Benefit existingBenefit = benefitRepository.findById(benefit.getId()).orElse(null);
                if (existingBenefit != null) {
                    // Only update description and imageUrl if they are explicitly set
                    if (benefit.getDescription() == null) {
                        benefit.setDescription(existingBenefit.getDescription());
                    }
                    if (benefit.getImageUrl() == null) {
                        benefit.setImageUrl(existingBenefit.getImageUrl());
                    }
                }
            }
            
            // Set requirements benefit reference
            if (benefit.getRequirements() != null) {
                benefit.getRequirements().forEach(requirement -> requirement.setBenefit(benefit));
            }
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
        Benefit benefit = benefitRepository.findById(id).orElse(null);
        logger.info(() -> "Fetched Benefit for ID " + id + ": " + (benefit == null ? "null" : benefit.toString()));
        return benefit;
    }

    

    /**
     * Gets all benefits.
     *
     * @return a list of all benefit entities
     */
    public List<Benefit> getAllBenefits() {
        List<Benefit> benefits = benefitRepository.findAll();
        logger.info(() -> "Fetched all Benefits: " + benefits);
        return benefits;
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