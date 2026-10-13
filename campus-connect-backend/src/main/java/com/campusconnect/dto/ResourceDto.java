package com.campusconnect.dto;

import lombok.Data;

@Data
public class ResourceDto {
    private Long id;
    private String title;
    private String description;
    private String subject;
    private String category;
    private String fileUrl;
    private String uploaderName;
    private String createdAt;
}
