package com.kabadbecho.backend.service;

import com.kabadbecho.backend.model.PickupRequest;
import com.kabadbecho.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendCollectorAssignedEmail(PickupRequest request, User collector) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return;
        }

        String collectorName = collector != null ? collector.getName() : "Assigned Collector";
        String collectorPhone = collector != null ? collector.getPhone() : "Not provided";

        String subject = "KabadBecho - Your Pickup Request has been Accepted!";
        String text = "Dear " + request.getName() + ",\n\n" +
                "Good news! Your scrap pickup request (ID: KB" + request.getId() + ") has been accepted.\n\n" +
                "Scrap Collector assigned: " + collectorName + "\n" +
                "Contact Number: " + collectorPhone + "\n\n" +
                "They will arrive at your address (" + request.getAddress() + ") to collect your scrap.\n" +
                "Estimated payout: Rs. " + request.getEstimatedAmount() + "\n\n" +
                "Thank you for contributing to a greener planet with KabadBecho!\n\n" +
                "Best Regards,\nThe Kabad Becho Team";

        // In an actual production scenario, this sends the email via the configured SMTP.
        // For development if SMTP fails, catch it so we don't break the transaction just because mail fails.
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("notifications@kabadbecho.com");
            message.setTo(request.getEmail());
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            System.out.println("[EMAIL SERVICE] Mock/Real mail successfully relayed to " + request.getEmail());
        } catch (Exception e) {
            System.err.println("[EMAIL SERVICE] Mail sending failed due to configuration: " + e.getMessage());
            // Logging the text so it can be seen in console anyway:
            System.out.println(text);
        }
    }
}
