package com.example.benefits.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int familySize;
    private double income;
    private int age;
    private boolean pregnant;
    private boolean dependantUnder18;
    private boolean disability;
    private boolean unemployed;
    private String email;

    // Getters and Setters
}