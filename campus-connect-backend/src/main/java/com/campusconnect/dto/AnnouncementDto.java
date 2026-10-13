package com.campusconnect.dto;

import com.campusconnect.enums.PublicationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnnouncementDto {
    private Long id;
    
    @NotBlank
    private String title;
    
    @NotBlank
    private String description;
    
    private String category;
    
    private String authorName;
    
    private PublicationStatus publicationStatus;
    
    private String attachmentUrl;
    
    private String createdAt;
}
