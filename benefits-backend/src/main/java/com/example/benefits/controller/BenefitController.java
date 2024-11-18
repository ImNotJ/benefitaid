package com.example.benefits.controller;

import com.example.benefits.entity.Benefit;
import com.example.benefits.entity.Requirement;
import com.example.benefits.service.BenefitService;
import com.example.benefits.service.RequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.validation.Valid;
import org.apache.commons.io.IOUtils;


import java.awt.image.BufferedImage;
import java.io.IOException;
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

    @Value("${classpath:static/default-benefit-image.jpg}")
    private Resource defaultImage;

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

    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) {
        try {
            BufferedImage img = ImageIO.read(file.getInputStream());
            if (img.getWidth() != 300 || img.getHeight() != 200) {
                return ResponseEntity.badRequest()
                    .body("Image dimensions must be 300x200 pixels");
            }

            Benefit benefit = benefitService.getBenefitById(id);
            benefit.setImageData(file.getBytes());
            benefit.setImageContentType(file.getContentType());
            benefit.setImageFileName(file.getOriginalFilename());
            benefitService.saveBenefit(benefit);

            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(500)
                .body("Error processing image: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<?> getImage(@PathVariable Long id) {
        try {
            Benefit benefit = benefitService.getBenefitById(id);
            
            if (!benefit.hasImage()) {
                // Return default image
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(IOUtils.toByteArray(defaultImage.getInputStream()));
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(benefit.getImageContentType()))
                .body(benefit.getImageData());
        } catch (IOException e) {
            return ResponseEntity.status(500)
                .body("Error retrieving image");
        }
    }
}