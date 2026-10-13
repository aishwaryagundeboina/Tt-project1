package com.campusconnect.controller;

import com.campusconnect.dto.UserDto;
import com.campusconnect.entity.User;
import com.campusconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDto dto = UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .studentOrEmployeeId(user.getStudentOrEmployeeId())
                .build();
                
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(Authentication authentication, @RequestBody UserDto updateDto) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getDepartment() != null) user.setDepartment(updateDto.getDepartment());
        if (updateDto.getStudentOrEmployeeId() != null) user.setStudentOrEmployeeId(updateDto.getStudentOrEmployeeId());
        
        User savedUser = userRepository.save(user);
        
        UserDto dto = UserDto.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .department(savedUser.getDepartment())
                .studentOrEmployeeId(savedUser.getStudentOrEmployeeId())
                .build();
                
        return ResponseEntity.ok(dto);
    }
}
