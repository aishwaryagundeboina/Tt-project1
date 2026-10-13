package com.campusconnect.repository;

import com.campusconnect.entity.ContentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentReportRepository extends JpaRepository<ContentReport, Long> {
    List<ContentReport> findAllByOrderByCreatedAtDesc();
}
