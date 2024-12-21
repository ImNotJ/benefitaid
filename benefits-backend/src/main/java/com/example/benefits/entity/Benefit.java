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

    @Column(name="description", columnDefinition = "TEXT")
    private String description;

    @Column(name="image_url")
    private String imageUrl;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBenefitName() {
        return benefitName;
    }

    public void setBenefitName(String benefitName) {
        this.benefitName = benefitName;
    }

    public boolean isFederal() {
        return federal;
    }

    public void setFederal(boolean federal) {
        this.federal = federal;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getBenefitUrl() {
        return benefitUrl;
    }

    public void setBenefitUrl(String benefitUrl) {
        this.benefitUrl = benefitUrl;
    }

    public Set<Requirement> getRequirements() {
        return requirements;
    }

    public void setRequirements(Set<Requirement> requirements) {
        this.requirements = requirements;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}