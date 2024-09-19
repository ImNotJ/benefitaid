package com.example.benefits.controller;

import com.example.benefits.entity.Requirement;
import com.example.benefits.service.RequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/requirements")
public class RequirementController {
    @Autowired
    private RequirementService requirementService;

    @PostMapping
    public Requirement createRequirement(@Valid @RequestBody Requirement requirement) {
        return requirementService.saveRequirement(requirement);
    }

    @GetMapping("/{id}")
    public Requirement getRequirementById(@PathVariable Long id) {
        return requirementService.getRequirementById(id);
    }

    @GetMapping
    public List<Requirement> getAllRequirements() {
        return requirementService.getAllRequirements();
    }

    @PutMapping("/{id}")
    public Requirement updateRequirement(@PathVariable Long id, @Valid @RequestBody Requirement requirement) {
        requirement.setId(id);
        return requirementService.saveRequirement(requirement);
    }

    @DeleteMapping("/{id}")
    public void deleteRequirement(@PathVariable Long id) {
        requirementService.deleteRequirementById(id);
    }
}