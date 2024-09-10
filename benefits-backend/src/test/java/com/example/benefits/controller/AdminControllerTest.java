package com.example.benefits.controller;

import com.example.benefits.entity.Admin;
import com.example.benefits.service.AdminService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private MockMvc mockMvc;

    public AdminControllerTest() {
        MockitoAnnotations.openMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
    }

    @Test
    public void testCreateAdmin() throws Exception {
        Admin admin = new Admin();
        admin.setUsername("admin");

        when(adminService.saveAdmin(any(Admin.class))).thenReturn(admin);

        mockMvc.perform(post("/api/admins")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\", \"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"));

        verify(adminService, times(1)).saveAdmin(any(Admin.class));
    }

    @Test
    public void testGetAdminById() throws Exception {
        Admin admin = new Admin();
        admin.setId(1L);
        admin.setUsername("admin");

        when(adminService.getAdminById(1L)).thenReturn(admin);

        mockMvc.perform(get("/api/admins/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"));

        verify(adminService, times(1)).getAdminById(1L);
    }

    @Test
    public void testGetAllAdmins() throws Exception {
        Admin admin1 = new Admin();
        admin1.setUsername("admin1");

        Admin admin2 = new Admin();
        admin2.setUsername("admin2");

        when(adminService.getAllAdmins()).thenReturn(Arrays.asList(admin1, admin2));

        mockMvc.perform(get("/api/admins"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("admin1"))
                .andExpect(jsonPath("$[1].username").value("admin2"));

        verify(adminService, times(1)).getAllAdmins();
    }

    @Test
    public void testDeleteAdminById() throws Exception {
        doNothing().when(adminService).deleteAdminById(1L);

        mockMvc.perform(delete("/api/admins/1"))
                .andExpect(status().isOk());

        verify(adminService, times(1)).deleteAdminById(1L);
    }
}