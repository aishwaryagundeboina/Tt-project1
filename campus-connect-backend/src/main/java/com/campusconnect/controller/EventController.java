package com.campusconnect.controller;

import com.campusconnect.dto.EventDto;
import com.campusconnect.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDto>> getPublishedEvents() {
        return ResponseEntity.ok(eventService.getPublishedEvents());
    }

    @GetMapping("/my-registrations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EventDto>> getRegisteredEvents(Authentication authentication) {
        return ResponseEntity.ok(eventService.getRegisteredEvents(authentication.getName()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody EventDto eventDto, Authentication authentication) {
        EventDto created = eventService.createEvent(eventDto, authentication.getName());
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{id}/registrations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> registerForEvent(@PathVariable Long id, Authentication authentication) {
        try {
            eventService.registerForEvent(id, authentication.getName());
            return ResponseEntity.ok("Successfully registered for the event");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
