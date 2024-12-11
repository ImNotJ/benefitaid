package com.example.benefits.controller;

import com.example.benefits.entity.Benefit;
import com.example.benefits.service.EligibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    @Autowired
    private EligibilityService eligibilityService;

    /**
     * Endpoint to check eligibility based on user responses.
     * 
     * @param userResponses Map of question IDs to user responses
     * @return List of benefits the user is eligible for
     */
    @PostMapping("/check")
    public ResponseEntity<List<Benefit>> checkEligibility(@RequestBody Map<Long, String> userResponses) {
        try {
            List<Benefit> eligibleBenefits = eligibilityService.checkEligibility(userResponses);
            return ResponseEntity.ok(eligibleBenefits);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}