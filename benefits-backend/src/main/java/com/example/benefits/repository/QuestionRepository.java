package com.example.benefits.repository;

import com.example.benefits.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for Question entities.
 * This interface provides CRUD operations for Question entities.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.options WHERE q.id = :id")
    Optional<Question> findByIdWithOptions(@Param("id") Long id);
}