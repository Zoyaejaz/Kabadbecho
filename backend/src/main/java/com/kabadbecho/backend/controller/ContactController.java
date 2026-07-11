package com.kabadbecho.backend.controller;

import com.kabadbecho.backend.model.ContactMessage;
import com.kabadbecho.backend.repository.ContactMessageRepository;
import com.kabadbecho.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactMessage contactMessage) {
        if (contactMessage.getName() == null || contactMessage.getEmail() == null || contactMessage.getMessage() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required."));
        }
        
        // Save to DB
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);
        
        // Send email to admin
        emailService.sendContactNotification(
                savedMessage.getName(), 
                savedMessage.getEmail(), 
                savedMessage.getMessage()
        );
        
        return ResponseEntity.ok(Map.of("message", "Message sent successfully!", "messageId", savedMessage.getId()));
    }
}
