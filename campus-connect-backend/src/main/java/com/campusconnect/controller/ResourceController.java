package com.campusconnect.controller;

import com.campusconnect.dto.ResourceDto;
import com.campusconnect.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<ResourceDto>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ResourceDto> createResource(@RequestBody ResourceDto resourceDto, Authentication authentication) {
        ResourceDto created = resourceService.createResource(resourceDto, authentication.getName());
        return ResponseEntity.ok(created);
    }
}
