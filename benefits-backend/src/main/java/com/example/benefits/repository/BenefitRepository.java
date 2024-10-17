package com.example.benefits.repository;

import com.example.benefits.entity.Benefit;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Benefit entities.
 * This interface provides CRUD operations for Benefit entities.
 */
public interface BenefitRepository extends JpaRepository<Benefit, Long> {
}