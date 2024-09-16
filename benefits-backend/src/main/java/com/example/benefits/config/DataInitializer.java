package com.example.benefits.config;

import com.example.benefits.entity.Admin;
import com.example.benefits.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.annotation.PostConstruct;

@Configuration
public class DataInitializer {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        String rootAdminUsername = System.getenv("ROOT_ADMIN_USERNAME");
        String rootAdminPassword = System.getenv("ROOT_ADMIN_PASSWORD");

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