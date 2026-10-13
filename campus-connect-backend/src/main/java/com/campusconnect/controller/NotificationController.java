package com.campusconnect.controller;

import com.campusconnect.dto.NotificationDto;
import com.campusconnect.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getMyNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getMyNotifications(authentication.getName()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Authentication authentication) {
        try {
            notificationService.markAsRead(id, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
