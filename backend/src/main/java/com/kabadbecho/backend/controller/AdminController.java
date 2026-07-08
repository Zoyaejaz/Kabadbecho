package com.kabadbecho.backend.controller;

import com.kabadbecho.backend.model.PickupRequest;
import com.kabadbecho.backend.model.User;
import com.kabadbecho.backend.repository.PickupRequestRepository;
import com.kabadbecho.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private PickupRequestRepository pickupRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/pickups")
    public ResponseEntity<List<PickupRequest>> getAllPickups() {
        // We know it's secure via SecurityConfig locking /api/admin/** to hasRole("ADMIN")
        List<PickupRequest> list = pickupRequestRepository.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        long totalCount = pickupRequestRepository.count();
        long pendingCount = pickupRequestRepository.countByStatus("PENDING");
        long acceptedCount = pickupRequestRepository.countByStatus("ACCEPTED");
        long completedCount = pickupRequestRepository.countByStatus("COMPLETED");

        Double completedRevenue = pickupRequestRepository.sumCollectedAmountForCompleted();
        Double acceptedRevenue = pickupRequestRepository.sumEstimatedAmountForAccepted();

        double totalRevenue = (completedRevenue != null ? completedRevenue : 0.0) + (acceptedRevenue != null ? acceptedRevenue : 0.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", totalCount);
        stats.put("pendingCount", pendingCount);
        stats.put("acceptedCount", acceptedCount);
        stats.put("completedCount", completedCount);
        stats.put("totalRevenue", totalRevenue);
        stats.put("completedRevenue", completedRevenue != null ? completedRevenue : 0.0);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/kyc/pending")
    public ResponseEntity<List<User>> getPendingKyc() {
        return ResponseEntity.ok(userRepository.findByKycStatus("PENDING"));
    }

    @PostMapping("/kyc/approve/{id}")
    public ResponseEntity<?> approveKyc(@PathVariable Long id, @RequestParam Boolean approved) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        if (approved) {
            user.setKycStatus("APPROVED");
        } else {
            user.setKycStatus("REJECTED");
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "KYC status updated to " + user.getKycStatus()));
    }
}
