package com.kabadbecho.backend.controller;

import com.kabadbecho.backend.model.Complaint;
import com.kabadbecho.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*") // Typically covered by config, but explicit here
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    // Create a new complaint from a user
    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaint) {
        Complaint savedComplaint = complaintRepository.save(complaint);
        return ResponseEntity.ok(savedComplaint);
    }

    // Get all complaints for the admin dashboard
    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintRepository.findAllByOrderByCreatedAtDesc());
    }

    // Get all complaints for a specific user's dashboard overview
    @GetMapping("/user")
    public ResponseEntity<List<Complaint>> getUserComplaints(@RequestParam String email) {
        return ResponseEntity.ok(complaintRepository.findByUserEmailOrderByCreatedAtDesc(email));
    }

    // Update complaint status by admin
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Complaint> complaintOp = complaintRepository.findById(id);
        if (complaintOp.isPresent()) {
            Complaint complaint = complaintOp.get();
            String status = body.get("status");
            if (status != null && !status.isEmpty()) {
                complaint.setStatus(status);
                complaintRepository.save(complaint);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.badRequest().body("Status cannot be null");
        }
        return ResponseEntity.notFound().build();
    }
}
