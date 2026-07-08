package com.kabadbecho.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "scrap_rates")
public class ScrapRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category; // e.g., Metal, Plastic, E-Waste

    @Column(name = "sub_type")
    private String subType; // e.g., Copper Wire, Heavy Iron

    @Column(name = "rate_per_kg", nullable = false)
    private Double ratePerKg;

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // Constructors
    public ScrapRate() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubType() { return subType; }
    public void setSubType(String subType) { this.subType = subType; }

    public Double getRatePerKg() { return ratePerKg; }
    public void setRatePerKg(Double ratePerKg) { this.ratePerKg = ratePerKg; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
