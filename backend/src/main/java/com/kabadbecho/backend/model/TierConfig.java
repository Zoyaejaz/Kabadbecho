package com.kabadbecho.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tier_config")
public class TierConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tier_name", nullable = false, unique = true)
    private String tierName; // e.g. Bronze, Eco Warrior, Earth Guardian

    @Column(name = "min_kg", nullable = false)
    private Double minKg;

    @Column(name = "badge_icon")
    private String badgeIcon;

    @Column(columnDefinition = "TEXT")
    private String benefits; // JSON of privileges

    public TierConfig() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTierName() { return tierName; }
    public void setTierName(String tierName) { this.tierName = tierName; }

    public Double getMinKg() { return minKg; }
    public void setMinKg(Double minKg) { this.minKg = minKg; }

    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }

    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
}
