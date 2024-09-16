package com.example.benefits.service;

import com.example.benefits.entity.Admin;
import com.example.benefits.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Admin saveAdmin(Admin admin) {
        if (!admin.getPassword().startsWith("$2a$")) { // Check if the password is already hashed
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        }
        validateRole(admin.getRole());
        return adminRepository.save(admin);
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public void deleteAdminById(Long id) {
        adminRepository.deleteById(id);
    }

    public Admin findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    private void validateRole(String role) {
        if (!role.equals("ROLE_ROOT_ADMIN") && !role.equals("ROLE_ADMIN")) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
    }
}