package com.pawcare.hub.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class VaccinationDTO {
    private Long id;
    private Long petId;
    private String petName;
    private String vaccineType;
    private LocalDate administeredDate;
    private LocalDate nextDueDate;
    private Long veterinarianId;
    private String veterinarianName;
    private String batchNumber;
    private String notes;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public VaccinationDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }

    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getVaccineType() { return vaccineType; }
    public void setVaccineType(String vaccineType) { this.vaccineType = vaccineType; }

    public LocalDate getAdministeredDate() { return administeredDate; }
    public void setAdministeredDate(LocalDate administeredDate) { this.administeredDate = administeredDate; }

    public LocalDate getNextDueDate() { return nextDueDate; }
    public void setNextDueDate(LocalDate nextDueDate) { this.nextDueDate = nextDueDate; }

    public Long getVeterinarianId() { return veterinarianId; }
    public void setVeterinarianId(Long veterinarianId) { this.veterinarianId = veterinarianId; }

    public String getVeterinarianName() { return veterinarianName; }
    public void setVeterinarianName(String veterinarianName) { this.veterinarianName = veterinarianName; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}