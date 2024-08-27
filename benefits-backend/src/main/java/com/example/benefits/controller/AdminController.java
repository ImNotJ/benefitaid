package com.example.benefits.controller;

import com.example.benefits.entity.Admin;
import com.example.benefits.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    @GetMapping("/users")
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }
}