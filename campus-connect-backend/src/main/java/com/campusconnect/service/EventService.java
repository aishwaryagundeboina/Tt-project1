package com.campusconnect.service;

import com.campusconnect.dto.EventDto;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventRegistration;
import com.campusconnect.entity.User;
import com.campusconnect.enums.PublicationStatus;
import com.campusconnect.enums.RegistrationStatus;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<EventDto> getPublishedEvents() {
        return eventRepository.findByPublicationStatusOrderByStartDateTimeAsc(PublicationStatus.PUBLISHED)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<EventDto> getRegisteredEvents(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return registrationRepository.findByStudentId(student.getId())
                .stream()
                .map(reg -> mapToDto(reg.getEvent()))
                .collect(Collectors.toList());
    }

    public EventDto createEvent(EventDto dto, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        Event event = Event.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .venue(dto.getVenue())
                .startDateTime(dto.getStartDateTime())
                .endDateTime(dto.getEndDateTime())
                .registrationDeadline(dto.getRegistrationDeadline())
                .capacity(dto.getCapacity())
                .category(dto.getCategory())
                .organizer(organizer)
                .publicationStatus(dto.getPublicationStatus() != null ? dto.getPublicationStatus() : PublicationStatus.PUBLISHED)
                .posterUrl(dto.getPosterUrl())
                .build();

        return mapToDto(eventRepository.save(event));
    }

    public void registerForEvent(Long eventId, String studentEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
                
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (registrationRepository.existsByEventIdAndStudentId(eventId, student.getId())) {
            throw new RuntimeException("Already registered for this event");
        }
        
        if (event.getRegistrationDeadline() != null && LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            throw new RuntimeException("Registration deadline has passed");
        }
        
        long currentCount = registrationRepository.countByEventId(eventId);
        if (currentCount >= event.getCapacity()) {
            throw new RuntimeException("Event is at full capacity");
        }

        EventRegistration registration = EventRegistration.builder()
                .event(event)
                .student(student)
                .registrationStatus(RegistrationStatus.REGISTERED)
                .build();
                
        registrationRepository.save(registration);
    }

    private EventDto mapToDto(Event event) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setVenue(event.getVenue());
        dto.setStartDateTime(event.getStartDateTime());
        dto.setEndDateTime(event.getEndDateTime());
        dto.setRegistrationDeadline(event.getRegistrationDeadline());
        dto.setCapacity(event.getCapacity());
        dto.setCategory(event.getCategory());
        dto.setOrganizerName(event.getOrganizer().getFullName());
        dto.setPublicationStatus(event.getPublicationStatus());
        dto.setPosterUrl(event.getPosterUrl());
        dto.setCurrentRegistrations(registrationRepository.countByEventId(event.getId()));
        return dto;
    }
}
