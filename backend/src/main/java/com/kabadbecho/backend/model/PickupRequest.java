package com.kabadbecho.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_requests")
public class PickupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version; // Optimistic locking

    private String name;
    private String phone;
    private String email;
    private String address;

    @Column(name = "scrap_type")
    private String scrapType;

    private Double weight; // Estimated weight

    @Column(name = "actual_weight")
    private Double actualWeight; // Final weighed weight

    private String date;
    private String time;
    private String notes;
    private String status; // "PENDING", "ACCEPTED", "ARRIVED", "COMPLETED", "CANCELLED", "DISPUTED"

    @Column(name = "estimated_amount")
    private Double estimatedAmount;

    @Column(name = "collected_amount")
    private Double collectedAmount;

    @ManyToOne
    @JoinColumn(name = "collector_id")
    private User collector; // Assigned Scrap Collector

    // --- NEW Tracking & Dispatch Fields ---
    @Column(name = "pickup_lat")
    private Double pickupLat;

    @Column(name = "pickup_lng")
    private Double pickupLng;

    @Column(columnDefinition = "TEXT", name = "contact_snapshot")
    private String contactSnapshot;

    @Column(columnDefinition = "TEXT", name = "actual_weight_by_category")
    private String actualWeightByCategory; // JSON string

    @Column(columnDefinition = "TEXT", name = "rate_snapshot")
    private String rateSnapshot; // Stores Rates at the time of booking

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "dispute_reason")
    private String disputeReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public PickupRequest() {}

    // Getters and setters omitted for brevity in auto-generation, but will be generated properly...
    // Actually, I must generate them so the code compiles.

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getScrapType() { return scrapType; }
    public void setScrapType(String scrapType) { this.scrapType = scrapType; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double actualWeight) { this.actualWeight = actualWeight; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getEstimatedAmount() { return estimatedAmount; }
    public void setEstimatedAmount(Double estimatedAmount) { this.estimatedAmount = estimatedAmount; }

    public Double getCollectedAmount() { return collectedAmount; }
    public void setCollectedAmount(Double collectedAmount) { this.collectedAmount = collectedAmount; }

    public User getCollector() { return collector; }
    public void setCollector(User collector) { this.collector = collector; }

    public Double getPickupLat() { return pickupLat; }
    public void setPickupLat(Double pickupLat) { this.pickupLat = pickupLat; }

    public Double getPickupLng() { return pickupLng; }
    public void setPickupLng(Double pickupLng) { this.pickupLng = pickupLng; }

    public String getContactSnapshot() { return contactSnapshot; }
    public void setContactSnapshot(String contactSnapshot) { this.contactSnapshot = contactSnapshot; }

    public String getActualWeightByCategory() { return actualWeightByCategory; }
    public void setActualWeightByCategory(String actualWeightByCategory) { this.actualWeightByCategory = actualWeightByCategory; }

    public String getRateSnapshot() { return rateSnapshot; }
    public void setRateSnapshot(String rateSnapshot) { this.rateSnapshot = rateSnapshot; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public String getDisputeReason() { return disputeReason; }
    public void setDisputeReason(String disputeReason) { this.disputeReason = disputeReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
