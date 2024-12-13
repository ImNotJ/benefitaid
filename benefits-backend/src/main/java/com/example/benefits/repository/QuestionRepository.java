package com.example.benefits.repository;

import com.example.benefits.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Fetch options for a question
    @Query(value = "SELECT option_value FROM question_options WHERE question_id = :questionId", nativeQuery = true)
    List<String> findOptionsByQuestionId(@Param("questionId") Long questionId);

    // Insert an option for a question
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO question_options (question_id, option_value) VALUES (:questionId, :optionValue)", nativeQuery = true)
    void insertOption(@Param("questionId") Long questionId, @Param("optionValue") String optionValue);

    // Delete all options for a question
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM question_options WHERE question_id = :questionId", nativeQuery = true)
    void deleteOptionsByQuestionId(@Param("questionId") Long questionId);
}