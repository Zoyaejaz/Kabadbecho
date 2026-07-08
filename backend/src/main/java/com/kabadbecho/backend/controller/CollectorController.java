package com.kabadbecho.backend.controller;

import com.kabadbecho.backend.model.User;
import com.kabadbecho.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/collectors")
public class CollectorController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/kyc/submit")
    public ResponseEntity<?> submitKyc(@RequestParam String email, @RequestBody Map<String, String> kycData) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }
        
        User user = userOpt.get();
        if (!"SCRAP_COLLECTOR".equals(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only collectors can submit KYC"));
        }

        user.setKycStatus("PENDING");
        user.setVehicleType(kycData.get("vehicleType"));
        // Here we ideally store JSON array of document URLs
        user.setKycDocuments(kycData.get("kycDocuments")); 
        
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "KYC submitted successfully. Awaiting admin approval."));
    }

    @PostMapping("/status/online")
    public ResponseEntity<?> toggleOnlineStatus(@RequestParam String email, @RequestParam Boolean isOnline) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }
        
        User user = userOpt.get();
        if (!"APPROVED".equals(user.getKycStatus()) && isOnline) {
            return ResponseEntity.status(403).body(Map.of("message", "Cannot go online. KYC is not approved yet."));
        }

        user.setIsOnline(isOnline);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "isOnline", isOnline));
    }
}
