package com.kabadbecho.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;

@Controller
public class LiveTrackingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Receives live location updates from a Collector via STOMP: destination "/app/track/update"
     * Payload expected: { "bookingId": 12, "lat": 28.7, "lng": 77.2 }
     */
    @MessageMapping("/track/update")
    public void receiveLocationUpdate(@Payload Map<String, Object> locationData) {
        if (locationData.containsKey("bookingId")) {
            String bookingId = locationData.get("bookingId").toString();
            // Broadcast it to the specific topic for this booking so the User can listen
            // User subscribes to "/topic/pickup/12"
            messagingTemplate.convertAndSend("/topic/pickup/" + bookingId, locationData);
        }
    }
}
