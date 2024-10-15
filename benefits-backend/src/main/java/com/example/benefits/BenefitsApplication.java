package com.example.benefits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BenefitsApplication {
    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure().load();

        // Set environment variables
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        
        SpringApplication.run(BenefitsApplication.class, args);
    }
}