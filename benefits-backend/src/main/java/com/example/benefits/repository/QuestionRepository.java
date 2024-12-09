package com.example.benefits.repository;

import com.example.benefits.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

/**
 * Repository interface for Question entities.
 * This interface provides CRUD operations for Question entities.
 */
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.options WHERE q.id = :id")
    Optional<Question> findByIdWithOptions(@Param("id") Long id);
}