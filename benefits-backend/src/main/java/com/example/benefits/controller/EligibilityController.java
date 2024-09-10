package com.example.benefits.controller;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.User;
import com.example.benefits.service.EligibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {
    @Autowired
    private EligibilityService eligibilityService;

    @PostMapping("/check")
    public List<Benefit> checkEligibility(@Valid @RequestBody User user) {
        return eligibilityService.checkEligibility(user);
    }
}