package com.campusconnect.service;

import com.campusconnect.dto.AuthResponse;
import com.campusconnect.dto.LoginRequest;
import com.campusconnect.dto.RegisterRequest;
import com.campusconnect.entity.User;
import com.campusconnect.enums.AccountStatus;
import com.campusconnect.enums.Role;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenProvider jwtUtils;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        String role = (user != null && user.getRole() != null) ? user.getRole().name() : "STUDENT";
        String fullName = user != null ? user.getFullName() : "";
        
        return new AuthResponse(jwt, "Bearer", role, fullName);
    }

    public User registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .passwordHash(encoder.encode(signUpRequest.getPassword()))
                .role(Role.valueOf(signUpRequest.getRole().toUpperCase()))
                .department(signUpRequest.getDepartment())
                .studentOrEmployeeId(signUpRequest.getStudentOrEmployeeId())
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        return userRepository.save(user);
    }
}
