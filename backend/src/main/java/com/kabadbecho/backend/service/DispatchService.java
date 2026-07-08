package com.kabadbecho.backend.service;

import com.kabadbecho.backend.model.PickupRequest;
import com.kabadbecho.backend.model.User;
import com.kabadbecho.backend.repository.PickupRequestRepository;
import com.kabadbecho.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class DispatchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PickupRequestRepository pickupRequestRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final double EARTH_RADIUS_KM = 6371.0;
    
    // Manage scheduled timeouts for dispatch queue
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);

    /**
     * Dispatch booking to nearest online collector within X radius
     */
    public void dispatchBooking(PickupRequest booking) {
        if (booking.getPickupLat() == null || booking.getPickupLng() == null) {
            // Can't dispatch without location
            return;
        }

        List<User> onlineCollectors = userRepository.findByRole("SCRAP_COLLECTOR")
            .stream()
            .filter(u -> Boolean.TRUE.equals(u.getIsOnline()) 
                      && u.getCurrentLat() != null 
                      && u.getCurrentLng() != null)
            .collect(Collectors.toList());

        double maxRadiusKm = 10.0;
        User nearestCollector = null;
        double minDistance = Double.MAX_VALUE;

        for (User collector : onlineCollectors) {
            double distance = calculateDistance(booking.getPickupLat(), booking.getPickupLng(),
                    collector.getCurrentLat(), collector.getCurrentLng());
            if (distance <= maxRadiusKm && distance < minDistance) {
                minDistance = distance;
                nearestCollector = collector;
            }
        }

        if (nearestCollector != null) {
            // Assign successfully found collector
            booking.setCollector(nearestCollector);
            booking.setStatus("COLLECTOR_ASSIGNED");
            pickupRequestRepository.save(booking);

            System.out.println("Dispatched Booking ID " + booking.getId() + " to Collector ID " + nearestCollector.getId());
            
            // Broadcast "Incoming Job" via WebSockets to this specific collector
            messagingTemplate.convertAndSend("/topic/collector/" + nearestCollector.getId() + "/jobs", booking);

            // Schedule a check 2 minutes from now. If it's still assigned but not accepted, re-dispatch
            scheduleTimeoutCheck(booking.getId(), nearestCollector.getId());
        } else {
            System.out.println("No nearby online collector found for Booking ID " + booking.getId());
        }
    }

    private void scheduleTimeoutCheck(Long bookingId, Long collectorId) {
        scheduler.schedule(() -> {
            try {
                PickupRequest request = pickupRequestRepository.findById(bookingId).orElse(null);
                if (request != null && "COLLECTOR_ASSIGNED".equals(request.getStatus())) {
                    // Check if it's still assigned to the same person and hasn't moved to ACCEPTED
                    if (request.getCollector() != null && request.getCollector().getId().equals(collectorId)) {
                        System.out.println("Timeout reached. Collector " + collectorId + " did not accept Booking " + bookingId + ". Reassigning...");
                        // Reset and re-dispatch or assign to next available
                        request.setStatus("PENDING");
                        request.setCollector(null);
                        pickupRequestRepository.save(request);
                        
                        // Retry matching logic (ideally pass in ignored collectors)
                        dispatchBooking(request);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error in dispatch timeout thread: " + e.getMessage());
            }
        }, 2, TimeUnit.MINUTES);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}
