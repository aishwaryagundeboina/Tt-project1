package com.campusconnect.service;

import com.campusconnect.dto.ResourceDto;
import com.campusconnect.entity.Resource;
import com.campusconnect.entity.User;
import com.campusconnect.repository.ResourceRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ResourceDto> getAllResources() {
        return resourceRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ResourceDto createResource(ResourceDto dto, String uploaderEmail) {
        User uploader = userRepository.findByEmail(uploaderEmail)
                .orElseThrow(() -> new RuntimeException("Uploader not found"));

        Resource resource = Resource.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .subject(dto.getSubject())
                .category(dto.getCategory())
                .fileUrl(dto.getFileUrl())
                .uploadedBy(uploader)
                .build();

        return mapToDto(resourceRepository.save(resource));
    }

    private ResourceDto mapToDto(Resource resource) {
        ResourceDto dto = new ResourceDto();
        dto.setId(resource.getId());
        dto.setTitle(resource.getTitle());
        dto.setDescription(resource.getDescription());
        dto.setSubject(resource.getSubject());
        dto.setCategory(resource.getCategory());
        dto.setFileUrl(resource.getFileUrl());
        dto.setUploaderName(resource.getUploadedBy().getFullName());
        dto.setCreatedAt(resource.getCreatedAt().toString());
        return dto;
    }
}
