package com.campusconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommunityCommentDto {
    private Long id;
    
    @NotBlank
    private String content;
    
    private String authorName;
    
    private String createdAt;
}
