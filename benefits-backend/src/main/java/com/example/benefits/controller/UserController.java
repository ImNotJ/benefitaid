package com.example.benefits.controller;

import com.example.benefits.entity.User;
import com.example.benefits.service.UserService;
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
 * REST controller for managing User entities.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = Logger.getLogger(UserController.class.getName());

    @Value("${JWT_SECRET_KEY}")
    private String secretKey;

    @Autowired
    private UserService userService;

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
     * Endpoint for user login.
     *
     * @param user the user credentials
     * @return a ResponseEntity containing the JWT token and role if login is successful, otherwise a 401 status
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        logger.info("Attempting to log in");
        User existingUser = userService.findByEmail(user.getEmail());
        if (existingUser != null) {
            if (passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                Map<String, String> response = new HashMap<>();
                response.put("token", generateJwtToken(existingUser));
                response.put("role", existingUser.getRole());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    /**
     * Endpoint to create a new user.
     *
     * @param user the user entity to create
     * @return a ResponseEntity containing the created user entity or an error message
     */
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(409).body("Email already in use");
        }
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User newUser = userService.saveUser(user);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating user: " + e.getMessage());
        }
    }

    /**
     * Endpoint to get a user by ID.
     *
     * @param id the ID of the user
     * @return the user entity
     */
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    /**
     * Endpoint to get all users.
     *
     * @return a list of all user entities
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * Endpoint to update a user.
     *
     * @param id   the ID of the user to update
     * @param user the updated user entity
     * @return the updated user entity
     */
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        user.setId(id);
        return userService.saveUser(user);
    }

    /**
     * Endpoint to delete a user by ID.
     *
     * @param id the ID of the user to delete
     */
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

    /**
     * Generates a JWT token for the given user.
     *
     * @param user the user entity
     * @return the generated JWT token
     */
    private String generateJwtToken(User user) {
        long expirationTime = 1000 * 60 * 60 * 3; // 3 hours
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole()) // Include role in JWT token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }
}