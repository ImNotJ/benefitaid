package com.example.benefits.repository;

import com.example.benefits.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for User entities.
 * This interface provides CRUD operations for User entities.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by email.
     *
     * @param email the email of the user
     * @return the user entity
     */
    User findByEmail(String email);
}