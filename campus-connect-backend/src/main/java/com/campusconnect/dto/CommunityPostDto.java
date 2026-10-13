package com.campusconnect.dto;

import com.campusconnect.enums.PublicationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CommunityPostDto {
    private Long id;
    
    @NotBlank
    private String title;
    
    @NotBlank
    private String content;
    
    private String authorName;
    
    private PublicationStatus publicationStatus;
    
    private String createdAt;
    
    private List<CommunityCommentDto> comments;
}
