package com.example.benefits.entity;

import javax.persistence.*;
import java.util.Map;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;

    @ElementCollection
    @CollectionTable(name = "user_responses", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "response")
    private Map<Long, String> responses;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Map<Long, String> getResponses() {
        return responses;
    }

    public void setResponses(Map<Long, String> responses) {
        this.responses = responses;
    }
}