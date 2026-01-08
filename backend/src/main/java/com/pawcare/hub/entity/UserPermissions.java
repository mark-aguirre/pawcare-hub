package com.pawcare.hub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_permissions")
public class UserPermissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Boolean appointments = true;

    @Column(nullable = false)
    private Boolean pets = true;

    @Column(nullable = false)
    private Boolean owners = true;

    @Column(nullable = false)
    private Boolean records = true;

    @Column(nullable = false)
    private Boolean inventory = true;

    @Column(nullable = false)
    private Boolean billing = true;

    @Column(nullable = false)
    private Boolean reports = false;

    @Column(nullable = false)
    private Boolean settings = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Boolean getAppointments() { return appointments; }
    public void setAppointments(Boolean appointments) { this.appointments = appointments; }

    public Boolean getPets() { return pets; }
    public void setPets(Boolean pets) { this.pets = pets; }

    public Boolean getOwners() { return owners; }
    public void setOwners(Boolean owners) { this.owners = owners; }

    public Boolean getRecords() { return records; }
    public void setRecords(Boolean records) { this.records = records; }

    public Boolean getInventory() { return inventory; }
    public void setInventory(Boolean inventory) { this.inventory = inventory; }

    public Boolean getBilling() { return billing; }
    public void setBilling(Boolean billing) { this.billing = billing; }

    public Boolean getReports() { return reports; }
    public void setReports(Boolean reports) { this.reports = reports; }

    public Boolean getSettings() { return settings; }
    public void setSettings(Boolean settings) { this.settings = settings; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}