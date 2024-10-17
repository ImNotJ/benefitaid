package com.example.benefits.service;

import com.example.benefits.entity.Requirement;
import com.example.benefits.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for managing Requirement entities.
 */
@Service
public class RequirementService {

    @Autowired
    private RequirementRepository requirementRepository;

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
     * Gets a requirement by ID.
     *
     * @param id the ID of the requirement
     * @return the requirement entity, or null if not found
     */
    public Requirement getRequirementById(Long id) {
        return requirementRepository.findById(id).orElse(null);
    }

    /**
     * Gets all requirements.
     *
     * @return a list of all requirement entities
     */
    public List<Requirement> getAllRequirements() {
        return requirementRepository.findAll();
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