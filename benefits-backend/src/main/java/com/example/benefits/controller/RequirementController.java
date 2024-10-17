package com.example.benefits.controller;

import com.example.benefits.entity.Requirement;
import com.example.benefits.service.RequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing Requirement entities.
 */
@RestController
@RequestMapping("/api/requirements")
public class RequirementController {

    @Autowired
    private RequirementService requirementService;

    /**
     * Endpoint to create a new requirement.
     *
     * @param requirement the requirement entity to create
     * @return the created requirement entity
     */
    @PostMapping
    public Requirement createRequirement(@Valid @RequestBody Requirement requirement) {
        return requirementService.saveRequirement(requirement);
    }

    /**
     * Endpoint to get a requirement by ID.
     *
     * @param id the ID of the requirement
     * @return the requirement entity
     */
    @GetMapping("/{id}")
    public Requirement getRequirementById(@PathVariable Long id) {
        return requirementService.getRequirementById(id);
    }

    /**
     * Endpoint to get all requirements.
     *
     * @return a list of all requirement entities
     */
    @GetMapping
    public List<Requirement> getAllRequirements() {
        return requirementService.getAllRequirements();
    }

    /**
     * Endpoint to update a requirement.
     *
     * @param id          the ID of the requirement to update
     * @param requirement the updated requirement entity
     * @return the updated requirement entity
     */
    @PutMapping("/{id}")
    public Requirement updateRequirement(@PathVariable Long id, @Valid @RequestBody Requirement requirement) {
        requirement.setId(id);
        return requirementService.saveRequirement(requirement);
    }

    /**
     * Endpoint to delete a requirement by ID.
     *
     * @param id the ID of the requirement to delete
     */
    @DeleteMapping("/{id}")
    public void deleteRequirement(@PathVariable Long id) {
        requirementService.deleteRequirementById(id);
    }
}