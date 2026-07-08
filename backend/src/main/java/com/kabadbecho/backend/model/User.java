package com.kabadbecho.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String address;

    @Column(nullable = false)
    private String role; // "USER", "SCRAP_COLLECTOR", "ADMIN"

    // --- Additional Profile Details ---
    @Column(name = "alt_phone")
    private String altPhone;

    private String city;
    private String state;
    private String pincode;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

    private String tier = "Bronze"; // Bronze, Silver, Eco Warrior, etc.

    @Column(name = "lifetime_kg_recycled")
    private Double lifetimeKgRecycled = 0.0;

    @Column(name = "total_earnings")
    private Double totalEarnings = 0.0;

    @Column(columnDefinition = "TEXT", name = "notification_prefs")
    private String notificationPrefs; // JSON representation of preferences

    // --- Scrap Collector Specific Fields ---
    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "kyc_status")
    private String kycStatus; // PENDING, APPROVED, REJECTED

    @Column(columnDefinition = "TEXT", name = "kyc_documents")
    private String kycDocuments; // JSON representation

    @Column(name = "is_online")
    private Boolean isOnline = false;

    @Column(name = "current_lat")
    private Double currentLat;

    @Column(name = "current_lng")
    private Double currentLng;

    @Column(name = "rating_avg")
    private Double ratingAvg;

    @Column(name = "total_jobs_completed")
    private Integer totalJobsCompleted = 0;

    @Column(name = "bank_details")
    private String bankDetails; // Encrypted or JSON string

    // Constructors
    public User() {}

    public User(String name, String email, String password, String phone, String address, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAltPhone() { return altPhone; }
    public void setAltPhone(String altPhone) { this.altPhone = altPhone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getProfilePicUrl() { return profilePicUrl; }
    public void setProfilePicUrl(String profilePicUrl) { this.profilePicUrl = profilePicUrl; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public Double getLifetimeKgRecycled() { return lifetimeKgRecycled; }
    public void setLifetimeKgRecycled(Double lifetimeKgRecycled) { this.lifetimeKgRecycled = lifetimeKgRecycled; }

    public Double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(Double totalEarnings) { this.totalEarnings = totalEarnings; }

    public String getNotificationPrefs() { return notificationPrefs; }
    public void setNotificationPrefs(String notificationPrefs) { this.notificationPrefs = notificationPrefs; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public String getKycDocuments() { return kycDocuments; }
    public void setKycDocuments(String kycDocuments) { this.kycDocuments = kycDocuments; }

    public Boolean getIsOnline() { return isOnline; }
    public void setIsOnline(Boolean isOnline) { this.isOnline = isOnline; }

    public Double getCurrentLat() { return currentLat; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }

    public Double getCurrentLng() { return currentLng; }
    public void setCurrentLng(Double currentLng) { this.currentLng = currentLng; }

    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getTotalJobsCompleted() { return totalJobsCompleted; }
    public void setTotalJobsCompleted(Integer totalJobsCompleted) { this.totalJobsCompleted = totalJobsCompleted; }

    public String getBankDetails() { return bankDetails; }
    public void setBankDetails(String bankDetails) { this.bankDetails = bankDetails; }
}
