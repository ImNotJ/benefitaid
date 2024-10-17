package com.example.benefits.controller;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.User;
import com.example.benefits.service.EligibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing eligibility checks.
 */
@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    @Autowired
    private EligibilityService eligibilityService;

    /**
     * Endpoint to check eligibility for benefits.
     *
     * @param user the user entity containing the information to check eligibility
     * @return a list of benefits the user is eligible for
     */
    @PostMapping("/check")
    public List<Benefit> checkEligibility(@Valid @RequestBody User user) {
        return eligibilityService.checkEligibility(user);
    }
}