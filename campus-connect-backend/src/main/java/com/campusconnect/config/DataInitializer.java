package com.campusconnect.config;

import com.campusconnect.entity.*;
import com.campusconnect.enums.*;
import com.campusconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Seed Faculty - Pooja (from user's login)
        User facultyPooja = User.builder()
                .fullName("Prof. Pooja")
                .email("pooja@anurag.edu.in")
                .passwordHash(passwordEncoder.encode("faculty123"))
                .role(Role.FACULTY)
                .department("Computer Science")
                .studentOrEmployeeId("FAC-1002")
                .accountStatus(AccountStatus.ACTIVE)
                .build();
        userRepository.save(facultyPooja);

        User facultyDefault = User.builder()
                .fullName("Dr. Robert Smith")
                .email("faculty@campus.edu")
                .passwordHash(passwordEncoder.encode("faculty123"))
                .role(Role.FACULTY)
                .department("Information Technology")
                .studentOrEmployeeId("FAC-1001")
                .accountStatus(AccountStatus.ACTIVE)
                .build();
        userRepository.save(facultyDefault);

        // 2. Seed Student
        User studentUser = User.builder()
                .fullName("Alex Johnson")
                .email("student@campus.edu")
                .passwordHash(passwordEncoder.encode("student123"))
                .role(Role.STUDENT)
                .department("Computer Science")
                .studentOrEmployeeId("STU-2026-042")
                .accountStatus(AccountStatus.ACTIVE)
                .build();
        userRepository.save(studentUser);

        User studentTest = User.builder()
                .fullName("Aishwarya Gundeboina")
                .email("student@test.com")
                .passwordHash(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .department("Computer Science")
                .studentOrEmployeeId("STU-2026-001")
                .accountStatus(AccountStatus.ACTIVE)
                .build();
        userRepository.save(studentTest);

        // 3. Seed Admin
        User adminUser = User.builder()
                .fullName("System Administrator")
                .email("admin@campus.edu")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .department("Administration")
                .studentOrEmployeeId("ADM-001")
                .accountStatus(AccountStatus.ACTIVE)
                .build();
        userRepository.save(adminUser);

        User adminTest = User.builder()
                .fullName("Campus Admin")
                .email("admin@test.com")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .department("Dean Office")
                .studentOrEmployeeId("ADM-002")
                .accountStatus(AccountStatus.ACTIVE)
                .build();
        userRepository.save(adminTest);

        // 4. Seed Announcements
        Announcement ann1 = Announcement.builder()
                .title("Mid-Term Examinations Schedule Announced")
                .description("Mid-semester examination timetables have been released for all undergraduate departments.")
                .category("Academic")
                .author(facultyPooja)
                .publicationStatus(PublicationStatus.PUBLISHED)
                .build();
        announcementRepository.save(ann1);

        Announcement ann2 = Announcement.builder()
                .title("Campus Innovation & Tech Expo 2026")
                .description("Registrations are now open for project presentations and startup showcases.")
                .category("Events")
                .author(adminUser)
                .publicationStatus(PublicationStatus.PUBLISHED)
                .build();
        announcementRepository.save(ann2);

        // 5. Seed Events
        Event event1 = Event.builder()
                .title("Annual Tech Hackathon 2026")
                .description("24-hour university hackathon focused on AI, Web3, and smart campus automation.")
                .venue("Main Auditorium & Innovation Lab")
                .startDateTime(LocalDateTime.now().plusDays(5))
                .endDateTime(LocalDateTime.now().plusDays(6))
                .registrationDeadline(LocalDateTime.now().plusDays(4))
                .capacity(150)
                .organizer(facultyPooja)
                .category("Hackathon")
                .publicationStatus(PublicationStatus.PUBLISHED)
                .posterUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60")
                .build();
        eventRepository.save(event1);

        Event event2 = Event.builder()
                .title("Cloud Computing & AI Architecture Workshop")
                .description("Hands-on microservices architecture and modern continuous deployment systems.")
                .venue("CS Seminar Hall 2")
                .startDateTime(LocalDateTime.now().plusDays(8))
                .endDateTime(LocalDateTime.now().plusDays(8).plusHours(4))
                .registrationDeadline(LocalDateTime.now().plusDays(7))
                .capacity(80)
                .organizer(facultyDefault)
                .category("Workshop")
                .publicationStatus(PublicationStatus.PUBLISHED)
                .posterUrl("https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60")
                .build();
        eventRepository.save(event2);

        // 6. Seed Resources
        Resource res1 = Resource.builder()
                .title("Distributed Systems & Cloud Computing Notes")
                .description("Comprehensive lecture notes, architecture diagrams, and review questions covering consensus algorithms and microservices.")
                .subject("Distributed Computing")
                .fileUrl("https://example.com/notes/distributed-systems.pdf")
                .category("DOCUMENT")
                .uploadedBy(facultyPooja)
                .build();
        resourceRepository.save(res1);

        System.out.println(">>> Campus Connect: Seed data initialized successfully!");
    }
}
