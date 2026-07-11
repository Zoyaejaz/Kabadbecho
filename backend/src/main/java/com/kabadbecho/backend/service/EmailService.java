package com.kabadbecho.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${admin.email:admin@kabadbecho.com}")
    private String adminEmail;

    public void sendContactNotification(String name, String userEmail, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(adminEmail);
            mailMessage.setSubject("New Contact Us Submission from " + name);
            mailMessage.setText("You have received a new contact submission:\n\n" +
                    "Name: " + name + "\n" +
                    "Email: " + userEmail + "\n\n" +
                    "Message:\n" + message);
            
            mailSender.send(mailMessage);
            System.out.println("Contact notification email sent to admin successfully.");
        } catch (Exception e) {
            System.err.println("Failed to send contact notification email. " + e.getMessage());
            // We only print warning in development, especially with mock SMTP. Exception won't break the form submission.
        }
    }

    public void sendCollectorAssignedEmail(com.kabadbecho.backend.model.PickupRequest request, com.kabadbecho.backend.model.User collector) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                mailMessage.setTo(request.getEmail());
                mailMessage.setSubject("Collector Assigned for your Pickup (ID: " + request.getId() + ")");
                mailMessage.setText("Good news!\n\nA collector (" + collector.getName() + " - " + collector.getPhone() + 
                       ") has been assigned to your pickup request.\n\nThank you for using KabadBecho.");
                mailSender.send(mailMessage);
                System.out.println("Collector assigned email sent successfully.");
            }
        } catch (Exception e) {
            System.err.println("Failed to send collector assigned email. " + e.getMessage());
        }
    }
}
