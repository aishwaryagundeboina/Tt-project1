package com.campusconnect.service;

import com.campusconnect.dto.NotificationDto;
import com.campusconnect.entity.Notification;
import com.campusconnect.entity.User;
import com.campusconnect.repository.NotificationRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<NotificationDto> getMyNotifications(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void markAsRead(Long id, String email) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getRecipient().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized");
        }
        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }

    private NotificationDto mapToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .notificationType(notification.getNotificationType().name())
                .readStatus(notification.getReadStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
