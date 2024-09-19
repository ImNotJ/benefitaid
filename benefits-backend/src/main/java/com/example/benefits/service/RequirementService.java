package com.example.benefits.service;

import com.example.benefits.entity.Requirement;
import com.example.benefits.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequirementService {
    @Autowired
    private RequirementRepository requirementRepository;

    public Requirement saveRequirement(Requirement requirement) {
        return requirementRepository.save(requirement);
    }

    public Requirement getRequirementById(Long id) {
        return requirementRepository.findById(id).orElse(null);
    }

    public List<Requirement> getAllRequirements() {
        return requirementRepository.findAll();
    }

    public void deleteRequirementById(Long id) {
        requirementRepository.deleteById(id);
    }
}