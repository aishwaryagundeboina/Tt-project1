package com.campusconnect.controller;

import com.campusconnect.dto.AnnouncementDto;
import com.campusconnect.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<List<AnnouncementDto>> getPublishedAnnouncements() {
        return ResponseEntity.ok(announcementService.getPublishedAnnouncements());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<AnnouncementDto> createAnnouncement(@Valid @RequestBody AnnouncementDto announcementDto, Authentication authentication) {
        AnnouncementDto created = announcementService.createAnnouncement(announcementDto, authentication.getName());
        return ResponseEntity.ok(created);
    }
}
