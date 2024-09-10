package com.example.benefits.controller;

import com.example.benefits.entity.Benefit;
import com.example.benefits.service.BenefitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/benefits")
public class BenefitController {
    @Autowired
    private BenefitService benefitService;

    @PostMapping
    public Benefit createBenefit(@Valid @RequestBody Benefit benefit) {
        return benefitService.saveBenefit(benefit);
    }

    @GetMapping("/{id}")
    public Benefit getBenefitById(@PathVariable Long id) {
        return benefitService.getBenefitById(id);
    }

    @GetMapping
    public List<Benefit> getAllBenefits() {
        return benefitService.getAllBenefits();
    }

    @PutMapping("/{id}")
    public Benefit updateBenefit(@PathVariable Long id, @Valid @RequestBody Benefit benefit) {
        benefit.setId(id);
        return benefitService.saveBenefit(benefit);
    }

    @DeleteMapping("/{id}")
    public void deleteBenefit(@PathVariable Long id) {
        benefitService.deleteBenefitById(id);
    }
}