package com.example.benefits.config;

import com.example.benefits.entity.Admin;
import com.example.benefits.repository.AdminRepository;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.annotation.PostConstruct;

/**
 * Configuration class to initialize data in the database.
 * This class is responsible for creating the root admin user if it does not exist.
 */
@Configuration
public class DataInitializer {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Method to initialize data after the bean is constructed.
     * This method loads environment variables and creates the root admin user if it does not exist.
     */
    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.load();

        String rootAdminUsername = dotenv.get("ROOT_ADMIN_USERNAME");
        String rootAdminPassword = dotenv.get("ROOT_ADMIN_PASSWORD");

        if (rootAdminUsername == null || rootAdminPassword == null) {
            throw new IllegalStateException("Root admin credentials are not set in environment variables");
        }

        if (adminRepository.findByUsername(rootAdminUsername) == null) {
            Admin rootAdmin = new Admin();
            rootAdmin.setUsername(rootAdminUsername);
            rootAdmin.setPassword(passwordEncoder.encode(rootAdminPassword));
            rootAdmin.setRole("ROLE_ROOT_ADMIN");
            adminRepository.save(rootAdmin);
        }
    }
}