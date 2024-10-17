package com.example.benefits.repository;

import com.example.benefits.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Admin entities.
 * This interface provides CRUD operations for Admin entities.
 */
public interface AdminRepository extends JpaRepository<Admin, Long> {

    /**
     * Finds an admin by username.
     *
     * @param username the username of the admin
     * @return the admin entity
     */
    Admin findByUsername(String username);
}