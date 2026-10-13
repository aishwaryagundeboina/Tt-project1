package com.campusconnect.service;

import com.campusconnect.dto.AnnouncementDto;
import com.campusconnect.entity.Announcement;
import com.campusconnect.entity.User;
import com.campusconnect.enums.PublicationStatus;
import com.campusconnect.repository.AnnouncementRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AnnouncementDto> getPublishedAnnouncements() {
        return announcementRepository.findByPublicationStatusOrderByCreatedAtDesc(PublicationStatus.PUBLISHED)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AnnouncementDto createAnnouncement(AnnouncementDto dto, String authorEmail) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        Announcement announcement = Announcement.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .author(author)
                .publicationStatus(dto.getPublicationStatus() != null ? dto.getPublicationStatus() : PublicationStatus.PUBLISHED)
                .attachmentUrl(dto.getAttachmentUrl())
                .build();

        return mapToDto(announcementRepository.save(announcement));
    }

    private AnnouncementDto mapToDto(Announcement announcement) {
        AnnouncementDto dto = new AnnouncementDto();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setDescription(announcement.getDescription());
        dto.setCategory(announcement.getCategory());
        dto.setAuthorName(announcement.getAuthor().getFullName());
        dto.setPublicationStatus(announcement.getPublicationStatus());
        dto.setAttachmentUrl(announcement.getAttachmentUrl());
        dto.setCreatedAt(announcement.getCreatedAt().toString());
        return dto;
    }
}
