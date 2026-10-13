package com.campusconnect.repository;

import com.campusconnect.entity.Announcement;
import com.campusconnect.enums.PublicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByPublicationStatusOrderByCreatedAtDesc(PublicationStatus status);
}
