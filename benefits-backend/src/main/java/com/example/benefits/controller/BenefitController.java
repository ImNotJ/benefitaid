package com.example.benefits.controller;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.Requirement;
import com.example.benefits.service.BenefitService;
import com.example.benefits.service.RequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing Benefit entities.
 */
@RestController
@RequestMapping("/api/benefits")
public class BenefitController {

    @Autowired
    private BenefitService benefitService;

    @Autowired
    private RequirementService requirementService;

    /**
     * Endpoint to create a new benefit.
     *
     * @param benefit the benefit entity to create
     * @return the created benefit entity
     */
    @PostMapping
    public Benefit createBenefit(@Valid @RequestBody Benefit benefit) {
        return benefitService.saveBenefit(benefit);
    }

    /**
     * Endpoint to get a benefit by ID.
     *
     * @param id the ID of the benefit
     * @return the benefit entity
     */
    @GetMapping("/{id}")
    public Benefit getBenefitById(@PathVariable Long id) {
        return benefitService.getBenefitById(id);
    }

    /**
     * Endpoint to get all benefits.
     *
     * @return a list of all benefit entities
     */
    @GetMapping
    public List<Benefit> getAllBenefits() {
        return benefitService.getAllBenefits();
    }

    /**
     * Endpoint to update a benefit.
     *
     * @param id      the ID of the benefit to update
     * @param benefit the updated benefit entity
     * @return the updated benefit entity
     */
    @PutMapping("/{id}")
    public Benefit updateBenefit(@PathVariable Long id, @Valid @RequestBody Benefit benefit) {
        benefit.setId(id);
        System.out.println("Received Benefit: " + benefit);
        return benefitService.saveBenefit(benefit);
    }

    /**
     * Endpoint to delete a benefit by ID.
     *
     * @param id the ID of the benefit to delete
     */
    @DeleteMapping("/{id}")
    public void deleteBenefit(@PathVariable Long id) {
        benefitService.deleteBenefitById(id);
    }

    /**
     * Endpoint to create a new requirement for a benefit.
     *
     * @param benefitId   the ID of the benefit
     * @param requirement the requirement entity to create
     * @return the created requirement entity
     */
    @PostMapping("/{benefitId}/requirements")
    public Requirement createRequirement(@PathVariable Long benefitId, @Valid @RequestBody Requirement requirement) {
        Benefit benefit = benefitService.getBenefitById(benefitId);
        requirement.setBenefit(benefit);
        return requirementService.saveRequirement(requirement);
    }

    /**
     * Endpoint to delete a requirement by ID.
     *
     * @param id the ID of the requirement to delete
     */
    @DeleteMapping("/requirements/{id}")
    public void deleteRequirement(@PathVariable Long id) {
        requirementService.deleteRequirementById(id);
    }
}