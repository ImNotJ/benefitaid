package com.example.benefits.service;

import com.example.benefits.entity.Admin;
import com.example.benefits.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for managing Admin entities.
 */
@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Saves an admin entity.
     * If the password is not already hashed, it will be hashed before saving.
     *
     * @param admin the admin entity to save
     * @return the saved admin entity
     */
    public Admin saveAdmin(Admin admin) {
        if (!admin.getPassword().startsWith("$2a$")) { // Check if the password is already hashed
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        }
        validateRole(admin.getRole());
        return adminRepository.save(admin);
    }

    /**
     * Gets an admin by ID.
     *
     * @param id the ID of the admin
     * @return the admin entity, or null if not found
     */
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    /**
     * Gets all admins.
     *
     * @return a list of all admin entities
     */
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    /**
     * Deletes an admin by ID.
     *
     * @param id the ID of the admin to delete
     */
    public void deleteAdminById(Long id) {
        adminRepository.deleteById(id);
    }

    /**
     * Finds an admin by username.
     *
     * @param username the username of the admin
     * @return the admin entity
     */
    public Admin findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    /**
     * Validates the role of an admin.
     * Throws an IllegalArgumentException if the role is invalid.
     *
     * @param role the role to validate
     */
    private void validateRole(String role) {
        if (!role.equals("ROLE_ROOT_ADMIN") && !role.equals("ROLE_ADMIN")) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
    }
}