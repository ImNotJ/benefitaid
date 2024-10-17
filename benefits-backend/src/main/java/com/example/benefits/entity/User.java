package com.example.benefits.entity;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.Map;

/**
 * Entity class representing a User.
 */
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password; // Store hashed password

    @NotBlank
    private String role = "ROLE_USER"; // Add default value for role

    @ElementCollection
    @CollectionTable(name = "user_responses", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "response")
    private Map<Long, String> responses;

    // Getters and Setters

    /**
     * Gets the ID of the user.
     *
     * @return the ID of the user
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the ID of the user.
     *
     * @param id the ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the email of the user.
     *
     * @return the email of the user
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email of the user.
     *
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Gets the password of the user.
     *
     * @return the password of the user
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password of the user.
     *
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets the role of the user.
     *
     * @return the role of the user
     */
    public String getRole() {
        return role;
    }

    /**
     * Sets the role of the user.
     *
     * @param role the role to set
     */
    public void setRole(String role) {
        this.role = role;
    }

    /**
     * Gets the responses of the user.
     *
     * @return the responses of the user
     */
    public Map<Long, String> getResponses() {
        return responses;
    }

    /**
     * Sets the responses of the user.
     *
     * @param responses the responses to set
     */
    public void setResponses(Map<Long, String> responses) {
        this.responses = responses;
    }
}