package com.example.benefits.service;

import com.example.benefits.entity.User;
import com.example.benefits.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for managing User entities.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Saves a user entity.
     * If the password is not already hashed, it will be hashed before saving.
     * Assigns a default role if not set.
     *
     * @param user the user entity to save
     * @return the saved user entity
     */
    public User saveUser(User user) {
        if (!user.getPassword().startsWith("$2a$")) { // Check if the password is already hashed
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getRole() == null) {
            user.setRole("ROLE_USER"); // Assign default role if not set
        }
        return userRepository.save(user);
    }

    /**
     * Gets a user by ID.
     *
     * @param id the ID of the user
     * @return the user entity, or null if not found
     */
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Gets all users.
     *
     * @return a list of all user entities
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Deletes a user by ID.
     *
     * @param id the ID of the user to delete
     */
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Finds a user by email.
     *
     * @param email the email of the user
     * @return the user entity
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}