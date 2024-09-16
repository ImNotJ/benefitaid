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
        if (adminRepository.findByUsername("rootadmin") == null) {
            Admin rootAdmin = new Admin();
            rootAdmin.setUsername("rootadmin");
            rootAdmin.setPassword(passwordEncoder.encode("rootpassword"));
            rootAdmin.setRole("ROLE_ROOT_ADMIN");
            adminRepository.save(rootAdmin);
        }
    }
}