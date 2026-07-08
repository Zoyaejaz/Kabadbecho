package com.kabadbecho.backend.service;

import com.kabadbecho.backend.model.NotificationLog;
import com.kabadbecho.backend.model.PickupRequest;
import com.kabadbecho.backend.model.User;
import com.kabadbecho.backend.repository.NotificationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationLogRepository notificationLogRepository;

    public void notifyUserPickupStatus(PickupRequest request, User user, String customMessage) {
        // In a real application, we would check user.getNotificationPrefs() (JSON)
        // For example: {"email": true, "sms": false, "push": true}
        boolean prefersEmail = true; // Default true or parse JSON
        
        if (prefersEmail) {
            // Trigger EmailService
            if ("ACCEPTED".equals(request.getStatus())) {
                emailService.sendCollectorAssignedEmail(request, request.getCollector());
            } else {
                // Generic mock email trigger
                System.out.println("Sending Email to " + user.getEmail() + " : " + customMessage);
            }
            logNotification(user, request.getStatus(), "EMAIL", customMessage, "SENT");
        }
    }

    private void logNotification(User user, String type, String channel, String message, String status) {
        NotificationLog log = new NotificationLog();
        log.setUser(user);
        log.setType(type);
        log.setChannel(channel);
        log.setMessage(message);
        log.setStatus(status);
        log.setSentAt(LocalDateTime.now());
        notificationLogRepository.save(log);
    }
}
