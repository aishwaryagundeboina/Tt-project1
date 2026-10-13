package com.campusconnect.entity;

import com.campusconnect.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"event_id", "student_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegistrationStatus registrationStatus = RegistrationStatus.REGISTERED;

    @CreationTimestamp
    private LocalDateTime registeredAt;
}
