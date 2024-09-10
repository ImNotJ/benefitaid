package com.example.benefits.service;

import com.example.benefits.entity.Admin;
import com.example.benefits.repository.AdminRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class AdminServiceTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminService adminService;

    public AdminServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveAdmin() {
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPassword("password");

        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(adminRepository.save(admin)).thenReturn(admin);

        Admin savedAdmin = adminService.saveAdmin(admin);

        assertEquals("encodedPassword", savedAdmin.getPassword());
        verify(adminRepository, times(1)).save(admin);
    }

    @Test
    public void testGetAdminById() {
        Admin admin = new Admin();
        admin.setId(1L);
        admin.setUsername("admin");

        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));

        Admin foundAdmin = adminService.getAdminById(1L);

        assertEquals("admin", foundAdmin.getUsername());
        verify(adminRepository, times(1)).findById(1L);
    }
}