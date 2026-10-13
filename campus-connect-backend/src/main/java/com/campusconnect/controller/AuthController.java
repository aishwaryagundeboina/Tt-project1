package com.campusconnect.controller;

import com.campusconnect.dto.AuthResponse;
import com.campusconnect.dto.LoginRequest;
import com.campusconnect.dto.RegisterRequest;
import com.campusconnect.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerUser(registerRequest);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}
