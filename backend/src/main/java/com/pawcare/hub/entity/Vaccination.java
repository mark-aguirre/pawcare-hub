package com.pawcare.hub.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vaccinations")
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    @NotNull
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "owner"})
    private Pet pet;

    @Column(name = "vaccine_type")
    private String vaccineType;

    @Column(name = "administered_date")
    private LocalDate administeredDate;

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinarian_id")
    @NotNull
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Veterinarian veterinarian;

    @Column(name = "batch_number")
    private String batchNumber;

    private String notes;

    @Enumerated(EnumType.STRING)
    private VaccinationStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum VaccinationStatus {
        SCHEDULED, ADMINISTERED, OVERDUE
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = VaccinationStatus.SCHEDULED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Vaccination() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }

    public String getVaccineType() { return vaccineType; }
    public void setVaccineType(String vaccineType) { this.vaccineType = vaccineType; }

    public LocalDate getAdministeredDate() { return administeredDate; }
    public void setAdministeredDate(LocalDate administeredDate) { this.administeredDate = administeredDate; }

    public LocalDate getNextDueDate() { return nextDueDate; }
    public void setNextDueDate(LocalDate nextDueDate) { this.nextDueDate = nextDueDate; }

    public Veterinarian getVeterinarian() { return veterinarian; }
    public void setVeterinarian(Veterinarian veterinarian) { this.veterinarian = veterinarian; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public VaccinationStatus getStatus() { return status; }
    public void setStatus(VaccinationStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}