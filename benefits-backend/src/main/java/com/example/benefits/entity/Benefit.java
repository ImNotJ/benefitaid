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
}