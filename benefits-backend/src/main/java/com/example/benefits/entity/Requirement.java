package com.example.benefits.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Set;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;


/**
 * Entity class representing a Requirement.
 */
@Entity
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @JsonDeserialize(using = RequirementTypeDeserializer.class)
    private RequirementType type;

    @ElementCollection
    @CollectionTable(name = "requirement_conditions", joinColumns = @JoinColumn(name = "requirement_id"))
    private Set<Condition> conditions;

    @ManyToOne
    @JoinColumn(name = "benefit_id")
    @JsonBackReference
    private Benefit benefit;

    public enum RequirementType {
        GENERAL,
        NECESSARY,
        INVALID,
        GENERAL_NECESSARY
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public RequirementType getType() {
        return type;
    }

    public void setType(RequirementType type) {
        this.type = type;
    }

    public Set<Condition> getConditions() {
        return conditions;
    }

    public void setConditions(Set<Condition> conditions) {
        this.conditions = conditions;
    }

    public Benefit getBenefit() {
        return benefit;
    }

    public void setBenefit(Benefit benefit) {
        this.benefit = benefit;
    }
}