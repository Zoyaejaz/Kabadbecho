package com.kabadbecho.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_status_history")
public class BookingStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private PickupRequest booking;

    @Column(nullable = false)
    private String status;

    @CreationTimestamp
    @Column(name = "changed_at", updatable = false)
    private LocalDateTime changedAt;

    @ManyToOne
    @JoinColumn(name = "changed_by_user_id")
    private User changedBy; // Who triggered the transition (User, Collector, Admin)

    public BookingStatusHistory() {}

    // Getters and Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PickupRequest getBooking() { return booking; }
    public void setBooking(PickupRequest booking) { this.booking = booking; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public User getChangedBy() { return changedBy; }
    public void setChangedBy(User changedBy) { this.changedBy = changedBy; }
}
