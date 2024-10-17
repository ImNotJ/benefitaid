package com.example.benefits.repository;

import com.example.benefits.entity.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Requirement entities.
 * This interface provides CRUD operations for Requirement entities.
 */
public interface RequirementRepository extends JpaRepository<Requirement, Long> {
}