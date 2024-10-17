package com.example.benefits.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

/**
 * Entity class representing an Admin.
 */
@Entity
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String username;

    @NotBlank
    private String password; // Store hashed password

    @NotBlank
    private String role; // ROLE_ROOT_ADMIN or ROLE_ADMIN

    // Getters and Setters

    /**
     * Gets the ID of the admin.
     *
     * @return the ID of the admin
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the ID of the admin.
     *
     * @param id the ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the username of the admin.
     *
     * @return the username of the admin
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username of the admin.
     *
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the password of the admin.
     *
     * @return the password of the admin
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password of the admin.
     *
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets the role of the admin.
     *
     * @return the role of the admin
     */
    public String getRole() {
        return role;
    }

    /**
     * Sets the role of the admin.
     *
     * @param role the role to set
     */
    public void setRole(String role) {
        this.role = role;
    }
}