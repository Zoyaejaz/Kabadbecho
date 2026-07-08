package com.kabadbecho.backend.controller;

import com.kabadbecho.backend.model.PickupRequest;
import com.kabadbecho.backend.model.User;
import com.kabadbecho.backend.repository.PickupRequestRepository;
import com.kabadbecho.backend.repository.UserRepository;
import com.kabadbecho.backend.service.DispatchService;
import com.kabadbecho.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pickups")
public class PickupController {

    @Autowired
    private PickupRequestRepository pickupRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DispatchService dispatchService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @ExceptionHandler(org.springframework.orm.ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<?> handleOptimisticLockingFailureException(org.springframework.orm.ObjectOptimisticLockingFailureException e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Conflict: Another user has already updated this request concurrently.");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @PostMapping
    public ResponseEntity<?> createPickupRequest(@RequestBody PickupRequest request) {
        // Calculate estimated amount
        Double pricePerKg = getPricePerKg(request.getScrapType());
        Double estimatedWeight = request.getWeight() != null ? request.getWeight() : 10.0;
        request.setWeight(estimatedWeight);
        request.setEstimatedAmount(pricePerKg * estimatedWeight);
        request.setStatus("PENDING");

        PickupRequest saved = pickupRequestRepository.save(request);
        
        // Dispatch booking based on location
        dispatchService.dispatchBooking(saved);
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/last")
    public ResponseEntity<?> getLastPickupRequest(@RequestParam String email) {
        Optional<PickupRequest> latestOpt = pickupRequestRepository.findFirstByEmailOrderByIdDesc(email);
        if (latestOpt.isPresent()) {
            return ResponseEntity.ok(latestOpt.get());
        }
        return ResponseEntity.ok(null);
    }

    @GetMapping("/user")
    public ResponseEntity<List<PickupRequest>> getUserPickups(@RequestParam String email) {
        List<PickupRequest> list = pickupRequestRepository.findByEmail(email);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/collector")
    public ResponseEntity<List<PickupRequest>> getCollectorPickups(@RequestParam String email) {
        List<PickupRequest> list = pickupRequestRepository.findByCollectorEmailOrCollectorIsNull(email);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptPickup(@PathVariable Long id, @RequestParam(required = false) String email) {
        Optional<PickupRequest> requestOpt = pickupRequestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Request not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        PickupRequest request = requestOpt.get();
        request.setStatus("ACCEPTED");

        if (request.getCollector() == null && email != null) {
            Optional<User> collectorOpt = userRepository.findByEmail(email);
            if (collectorOpt.isPresent()) {
                request.setCollector(collectorOpt.get());
            }
        }

        PickupRequest updated = pickupRequestRepository.save(request);

        // Notify via Abstract NotificationService
        if (request.getEmail() != null) {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            userOpt.ifPresent(user -> notificationService.notifyUserPickupStatus(updated, user, "Your pickup was accepted by " + request.getCollector().getName()));
        }

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePickupStatus(@PathVariable Long id, @RequestBody Map<String, Object> updateDetails) {
        Optional<PickupRequest> requestOpt = pickupRequestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Request not found"));
        }

        PickupRequest request = requestOpt.get();
        String newStatus = updateDetails.get("status") != null ? updateDetails.get("status").toString() : null;
        String currentStatus = request.getStatus();

        if (newStatus == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }

        // Strict State Machine validation: Edge Case B (State Hijacking)
        if ("ARRIVED".equals(newStatus)) {
            if (!"ACCEPTED".equals(currentStatus)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid State Transition: Must be ACCEPTED before ARRIVED."));
            }
        } else if ("COMPLETED".equals(newStatus)) {
            if (!"ARRIVED".equals(currentStatus) && !"ACCEPTED".equals(currentStatus)) { // Allow accepting to complete if needed, but strictly:
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid State Transition: Must be at least ACCEPTED to complete."));
            }
            if (!"ARRIVED".equals(currentStatus)) {
                // To be extremely strict matching the instruction:
                 return ResponseEntity.badRequest().body(Map.of("message", "Invalid State Transition: Bypassed ARRIVED state."));
            }

            // Calculation processing
            try {
                if (updateDetails.containsKey("actualWeight")) {
                    request.setActualWeight(Double.parseDouble(updateDetails.get("actualWeight").toString()));
                } else {
                    request.setActualWeight(request.getWeight());
                }

                if (updateDetails.containsKey("collectedAmount")) {
                    request.setCollectedAmount(Double.parseDouble(updateDetails.get("collectedAmount").toString()));
                } else {
                    Double pricePerKg = getPricePerKg(request.getScrapType());
                    request.setCollectedAmount(pricePerKg * request.getActualWeight());
                }
            } catch (Exception e) {
                request.setActualWeight(request.getWeight());
                request.setCollectedAmount(request.getEstimatedAmount());
            }

            // Phase 5: Automatic Tier and Wallet Updates
            if (request.getEmail() != null) {
                Optional<User> reqUserOpt = userRepository.findByEmail(request.getEmail());
                if (reqUserOpt.isPresent()) {
                    User reqUser = reqUserOpt.get();
                    reqUser.setTotalEarnings((reqUser.getTotalEarnings() != null ? reqUser.getTotalEarnings() : 0.0) + request.getCollectedAmount());
                    Double newLifetime = (reqUser.getLifetimeKgRecycled() != null ? reqUser.getLifetimeKgRecycled() : 0.0) + request.getActualWeight();
                    reqUser.setLifetimeKgRecycled(newLifetime);

                    // Determine Tier
                    if (newLifetime < 100) {
                        reqUser.setTier("Bronze");
                    } else if (newLifetime < 500) {
                        reqUser.setTier("Eco Warrior");
                    } else if (newLifetime < 1000) {
                        reqUser.setTier("Earth Guardian");
                    } else {
                        reqUser.setTier("Global Savior");
                    }
                    userRepository.save(reqUser);
                    
                    notificationService.notifyUserPickupStatus(request, reqUser, "Your pickup is Complete! You earned Rs." + request.getCollectedAmount());
                }
            }

        } else if ("CANCELLED".equals(newStatus)) {
             // Let it be cancelled anytime
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Unknown or invalid status requested."));
        }

        request.setStatus(newStatus);
        PickupRequest updated = pickupRequestRepository.save(request);
        
        // Broadcast the status update to the user tracking the pickup
        messagingTemplate.convertAndSend("/topic/pickup/" + updated.getId(), Map.of("type", "STATUS_UPDATE", "status", updated.getStatus()));
        
        return ResponseEntity.ok(updated);
    }


    // Helper: Rate mappings
    private Double getPricePerKg(String scrapType) {
        if (scrapType == null) return 10.0;
        String type = scrapType.toLowerCase();
        if (type.contains("metal")) return 38.0;
        if (type.contains("plastic")) return 12.0;
        if (type.contains("electronic") || type.contains("e-waste") || type.contains("ewaste")) return 120.0;
        if (type.contains("paper")) return 15.0;
        if (type.contains("glass")) return 5.0;
        return 10.0; // wood/mixed default
    }
}
