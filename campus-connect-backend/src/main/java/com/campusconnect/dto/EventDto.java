package com.campusconnect.dto;

import com.campusconnect.enums.PublicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDto {
    private Long id;
    
    @NotBlank
    private String title;
    
    @NotBlank
    private String description;
    
    @NotBlank
    private String venue;
    
    @NotNull
    private LocalDateTime startDateTime;
    
    @NotNull
    private LocalDateTime endDateTime;
    
    private LocalDateTime registrationDeadline;
    
    @NotNull
    private Integer capacity;
    
    private String organizerName;
    
    private String category;
    
    private PublicationStatus publicationStatus;
    
    private String posterUrl;
    
    private long currentRegistrations;
}
