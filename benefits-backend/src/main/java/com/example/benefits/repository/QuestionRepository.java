package com.example.benefits.repository;

import com.example.benefits.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Question entities.
 * This interface provides CRUD operations for Question entities.
 */
public interface QuestionRepository extends JpaRepository<Question, Long> {
}