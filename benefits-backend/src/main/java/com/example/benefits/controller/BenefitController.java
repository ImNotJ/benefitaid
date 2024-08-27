package com.example.benefits.controller;

import com.example.benefits.entity.Benefit;
import com.example.benefits.service.BenefitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/benefits")
public class BenefitController {
    @Autowired
    private BenefitService benefitService;

    @PostMapping
    public Benefit createBenefit(@RequestBody Benefit benefit) {
        return benefitService.saveBenefit(benefit);
    }

    @GetMapping
    public List<Benefit> getAllBenefits() {
        return benefitService.getAllBenefits();
    }
}