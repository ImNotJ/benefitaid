package com.example.benefits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

/**
 * Main class for the Benefits Application.
 * This class is responsible for bootstrapping the Spring Boot application.
 */
@SpringBootApplication
public class BenefitsApplication {

    /**
     * Main method to run the Spring Boot application.
     * 
     * @param args Command line arguments
     */
    public static void main(String[] args) {

        // Load environment variables from .env file
        Dotenv dotenv = Dotenv.configure().load();

        // Set environment variables for database credentials
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        
        // Run the Spring Boot application
        SpringApplication.run(BenefitsApplication.class, args);
    }
}