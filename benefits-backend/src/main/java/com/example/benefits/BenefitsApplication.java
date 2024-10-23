package com.example.benefits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;

/**
 * Main class for the Benefits Application.
 * This class is responsible for bootstrapping the Spring Boot application.
 */
@SpringBootApplication
public class BenefitsApplication {

    @Value("${DB_USERNAME}")
    private String dbUsername;

    @Value("${DB_PASSWORD}")
    private String dbPassword;

    /**
     * Main method to run the Spring Boot application.
     * 
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        // Run the Spring Boot application
        SpringApplication.run(BenefitsApplication.class, args);
    }

    /**
     * Method to set system properties for database credentials.
     * This method is called after the application context is initialized.
     */
    @PostConstruct
    public void init() {
        System.setProperty("DB_USERNAME", dbUsername);
        System.setProperty("DB_PASSWORD", dbPassword);
    }
}