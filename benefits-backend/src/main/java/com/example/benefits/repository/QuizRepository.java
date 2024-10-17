package com.example.benefits.repository;

import com.example.benefits.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Quiz entities.
 * This interface provides CRUD operations for Quiz entities.
 */
public interface QuizRepository extends JpaRepository<Quiz, Long> {
}