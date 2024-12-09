package com.example.benefits.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Set;

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

    @NotBlank
    @Enumerated(EnumType.STRING)
    private RequirementType type; // GENERAL, NECESSARY, INVALID, GENERAL_NECESSARY

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

    // Getters and Setters

    /**
     * Gets the ID of the requirement.
     *
     * @return the ID of the requirement
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the ID of the requirement.
     *
     * @param id the ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the name of the requirement.
     *
     * @return the name of the requirement
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the requirement.
     *
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the set of conditions associated with the requirement.
     *
     * @return the set of conditions
     */
    public Set<Condition> getConditions() {
        return conditions;
    }

    /**
     * Sets the set of conditions associated with the requirement.
     *
     * @param conditions the set of conditions to set
     */
    public void setConditions(Set<Condition> conditions) {
        this.conditions = conditions;
    }

    /**
     * Gets the benefit associated with the requirement.
     *
     * @return the benefit associated with the requirement
     */
    public Benefit getBenefit() {
        return benefit;
    }

    /**
     * Sets the benefit associated with the requirement.
     *
     * @param benefit the benefit to set
     */
    public void setBenefit(Benefit benefit) {
        this.benefit = benefit;
    }

    public RequirementType getType() {
        return type;
    }

    public void setType(RequirementType type) {
        this.type = type;
    }
}