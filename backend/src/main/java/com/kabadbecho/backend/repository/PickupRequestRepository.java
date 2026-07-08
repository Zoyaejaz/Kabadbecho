package com.kabadbecho.backend.repository;

import com.kabadbecho.backend.model.PickupRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, Long> {
    
    // Find all requests assigned to a collector OR unassigned
    @Query("SELECT p FROM PickupRequest p WHERE p.collector.email = :email OR p.collector IS NULL")
    List<PickupRequest> findByCollectorEmailOrCollectorIsNull(String email);
    
    // Find all requests placed by a user
    List<PickupRequest> findByEmail(String email);
    
    // Find the latest request placed by a user (for autofill)
    Optional<PickupRequest> findFirstByEmailOrderByIdDesc(String email);
    
    // Count requests by status
    long countByStatus(String status);
    
    // Sum collected amount for completed requests (to calculate revenue)
    @Query("SELECT SUM(p.collectedAmount) FROM PickupRequest p WHERE p.status = 'COMPLETED'")
    Double sumCollectedAmountForCompleted();

    // Sum estimated amount for accepted requests
    @Query("SELECT SUM(p.estimatedAmount) FROM PickupRequest p WHERE p.status = 'ACCEPTED'")
    Double sumEstimatedAmountForAccepted();
}
