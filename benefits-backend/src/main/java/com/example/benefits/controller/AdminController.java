package com.example.benefits.controller;

import com.example.benefits.entity.Admin;
import com.example.benefits.service.AdminService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * REST controller for managing Admin entities.
 */
@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private static final Logger logger = Logger.getLogger(AdminController.class.getName());

    @Value("${JWT_SECRET_KEY}")
    private String secretKey;

    @Autowired
    private AdminService adminService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // Ensure the secret key is set
        if (secretKey == null) {
            throw new IllegalStateException("JWT secret key is not set in environment variables");
        }
    }

    /**
     * Endpoint for admin login.
     *
     * @param admin the admin credentials
     * @return a ResponseEntity containing the JWT token and role if login is successful, otherwise a 401 status
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        logger.info("Attempting to log in");
        Admin existingAdmin = adminService.findByUsername(admin.getUsername());
        if (existingAdmin != null) {
            if (passwordEncoder.matches(admin.getPassword(), existingAdmin.getPassword())) {
                Map<String, String> response = new HashMap<>();
                response.put("token", generateJwtToken(existingAdmin));
                response.put("role", existingAdmin.getRole());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }

    /**
     * Endpoint to create a new admin.
     *
     * @param admin the admin entity to create
     * @return the created admin entity
     */
    @PostMapping
    public Admin createAdmin(@Valid @RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    /**
     * Endpoint to get an admin by ID.
     *
     * @param id the ID of the admin
     * @return the admin entity
     */
    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    /**
     * Endpoint to get all admins.
     *
     * @return a list of all admin entities
     */
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    /**
     * Endpoint to update an admin.
     *
     * @param id    the ID of the admin to update
     * @param admin the updated admin entity
     * @return the updated admin entity
     */
    @PutMapping("/{id}")
    public Admin updateAdmin(@PathVariable Long id, @Valid @RequestBody Admin admin) {
        admin.setId(id);
        return adminService.saveAdmin(admin);
    }

    /**
     * Endpoint to delete an admin by ID.
     *
     * @param id the ID of the admin to delete
     */
    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdminById(id);
    }

    /**
     * Generates a JWT token for the given admin.
     *
     * @param admin the admin entity
     * @return the generated JWT token
     */
    private String generateJwtToken(Admin admin) {
        long expirationTime = 1000 * 60 * 60; // 1 hour
        return Jwts.builder()
                .setSubject(admin.getUsername())
                .claim("role", admin.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }
}