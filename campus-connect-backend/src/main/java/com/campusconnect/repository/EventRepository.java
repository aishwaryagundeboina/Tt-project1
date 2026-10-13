package com.campusconnect.repository;

import com.campusconnect.entity.Event;
import com.campusconnect.enums.PublicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByPublicationStatusOrderByStartDateTimeAsc(PublicationStatus status);
}
