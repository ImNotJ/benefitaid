package com.example.benefits.entity;

import javax.persistence.*;
import java.util.Map;

@Entity
public class Benefit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String benefitName;
    private boolean federal;
    private String benefitUrl;

    @ElementCollection
    @CollectionTable(name = "benefit_requirements", joinColumns = @JoinColumn(name = "benefit_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "requirement")
    private Map<Long, String> benefitRequirements;

    // Getters and Setters
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

    public String getBenefitUrl() {
        return benefitUrl;
    }

    public void setBenefitUrl(String benefitUrl) {
        this.benefitUrl = benefitUrl;
    }

    public Map<Long, String> getBenefitRequirements() {
        return benefitRequirements;
    }

    public void setBenefitRequirements(Map<Long, String> benefitRequirements) {
        this.benefitRequirements = benefitRequirements;
    }
}