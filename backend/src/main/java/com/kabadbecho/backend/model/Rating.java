package com.kabadbecho.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private PickupRequest booking;

    @ManyToOne
    @JoinColumn(name = "rated_by_id", nullable = false)
    private User ratedBy; // The person giving the rating

    @ManyToOne
    @JoinColumn(name = "rated_user_id", nullable = false)
    private User ratedUser; // The person receiving the rating

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Rating() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PickupRequest getBooking() { return booking; }
    public void setBooking(PickupRequest booking) { this.booking = booking; }

    public User getRatedBy() { return ratedBy; }
    public void setRatedBy(User ratedBy) { this.ratedBy = ratedBy; }

    public User getRatedUser() { return ratedUser; }
    public void setRatedUser(User ratedUser) { this.ratedUser = ratedUser; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
