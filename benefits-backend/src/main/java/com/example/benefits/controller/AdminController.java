package com.example.benefits.controller;

import com.example.benefits.entity.Admin;
import com.example.benefits.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private static final Logger logger = Logger.getLogger(AdminController.class.getName());

    @Autowired
    private AdminService adminService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        logger.info("Attempting to log in with username: " + admin.getUsername());
        Admin existingAdmin = adminService.findByUsername(admin.getUsername());
        if (existingAdmin != null) {
            logger.info("Admin found: " + existingAdmin.getUsername());
            if (passwordEncoder.matches(admin.getPassword(), existingAdmin.getPassword())) {
                logger.info("Password matches for admin: " + existingAdmin.getUsername());
                Map<String, String> response = new HashMap<>();
                response.put("token", "fake-jwt-token"); // Replace with actual JWT token generation
                response.put("role", existingAdmin.getRole());
                return ResponseEntity.ok(response);
            } else {
                logger.warning("Password does not match for admin: " + existingAdmin.getUsername());
            }
        } else {
            logger.warning("Admin not found with username: " + admin.getUsername());
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }

    @PostMapping
    public Admin createAdmin(@Valid @RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @PutMapping("/{id}")
    public Admin updateAdmin(@PathVariable Long id, @Valid @RequestBody Admin admin) {
        admin.setId(id);
        return adminService.saveAdmin(admin);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdminById(id);
    }
}