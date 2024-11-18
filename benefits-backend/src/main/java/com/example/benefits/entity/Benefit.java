package com.example.benefits.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Set;

/**
 * Entity class representing a Benefit.
 */
@Entity
public class Benefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String benefitName;

    private boolean federal;

    private String state;

    @NotBlank
    private String benefitUrl;

    @OneToMany(mappedBy = "benefit", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Requirement> requirements;

    // Add default values for new fields
    @Column(columnDefinition = "TEXT")
    private String description = "No description available.";

    @NotBlank
    private String displayLinkText = "Learn More";

    // New method to check if benefit has an image
    public boolean hasImage() {
        return imageData != null && imageData.length > 0;
    }

    @Lob
    private byte[] imageData;
    
    private String imageContentType;
    
    @Column(length = 100)
    private String imageFileName;

    // Getters and Setters

    /**
     * Gets the ID of the benefit.
     *
     * @return the ID of the benefit
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the ID of the benefit.
     *
     * @param id the ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the name of the benefit.
     *
     * @return the name of the benefit
     */
    public String getBenefitName() {
        return benefitName;
    }

    /**
     * Sets the name of the benefit.
     *
     * @param benefitName the name to set
     */
    public void setBenefitName(String benefitName) {
        this.benefitName = benefitName;
    }

    /**
     * Checks if the benefit is federal.
     *
     * @return true if the benefit is federal, false otherwise
     */
    public boolean isFederal() {
        return federal;
    }

    /**
     * Sets whether the benefit is federal.
     *
     * @param federal the federal status to set
     */
    public void setFederal(boolean federal) {
        this.federal = federal;
        if (federal) {
            this.state = null; // Clear state if federal is true
        }
    }

    /**
     * Gets the state associated with the benefit.
     *
     * @return the state associated with the benefit
     */
    public String getState() {
        return state;
    }

    /**
     * Sets the state associated with the benefit.
     *
     * @param state the state to set
     */
    public void setState(String state) {
        if (!this.federal) {
            this.state = state;
        }
    }

    /**
     * Gets the URL of the benefit.
     *
     * @return the URL of the benefit
     */
    public String getBenefitUrl() {
        return benefitUrl;
    }

    /**
     * Sets the URL of the benefit.
     *
     * @param benefitUrl the URL to set
     */
    public void setBenefitUrl(String benefitUrl) {
        this.benefitUrl = benefitUrl;
    }

    /**
     * Gets the requirements associated with the benefit.
     *
     * @return the requirements associated with the benefit
     */
    public Set<Requirement> getRequirements() {
        return requirements;
    }

    /**
     * Sets the requirements associated with the benefit.
     *
     * @param requirements the requirements to set
     */
    public void setRequirements(Set<Requirement> requirements) {
        this.requirements = requirements;
    }

    public String getDisplayLinkText() {
        return displayLinkText;
    }

    public void setDisplayLinkText(String displayLinkText) {
        this.displayLinkText = displayLinkText;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getImageFileName() {
        return imageFileName;
    }

    public void setImageFileName(String imageFileName) {
        this.imageFileName = imageFileName;
    }
}