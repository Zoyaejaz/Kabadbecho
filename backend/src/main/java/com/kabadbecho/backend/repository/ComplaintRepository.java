package com.kabadbecho.backend.repository;

import com.kabadbecho.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<Complaint> findAllByOrderByCreatedAtDesc();
}
