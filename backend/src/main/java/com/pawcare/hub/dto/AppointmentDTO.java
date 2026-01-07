package com.pawcare.hub.dto;

import com.pawcare.hub.entity.Appointment;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public class AppointmentDTO {
    private Long id;
    private LocalDate date;
    private LocalTime time;
    private Integer duration;
    private String type;
    private String status;
    private String notes;
    private Long petId;
    private String petName;
    private String petSpecies;
    private Long ownerId;
    private String ownerName;
    private Long veterinarianId;
    private String veterinarianName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public AppointmentDTO() {}

    public AppointmentDTO(Appointment appointment) {
        this.id = appointment.getId();
        this.date = appointment.getDate();
        this.time = appointment.getTime();
        this.duration = appointment.getDuration();
        this.type = appointment.getType() != null ? appointment.getType().toString() : "CHECKUP";
        this.status = appointment.getStatus() != null ? appointment.getStatus().toString() : "SCHEDULED";
        this.notes = appointment.getNotes();
        this.createdAt = appointment.getCreatedAt();
        this.updatedAt = appointment.getUpdatedAt();
        
        if (appointment.getPet() != null) {
            this.petId = appointment.getPet().getId();
            this.petName = appointment.getPet().getName();
            this.petSpecies = appointment.getPet().getSpecies();
            
            if (appointment.getPet().getOwner() != null) {
                this.ownerId = appointment.getPet().getOwner().getId();
                this.ownerName = appointment.getPet().getOwner().getFirstName() + " " + 
                               appointment.getPet().getOwner().getLastName();
            }
        }
        
        if (appointment.getVeterinarian() != null) {
            this.veterinarianId = appointment.getVeterinarian().getId();
            this.veterinarianName = appointment.getVeterinarian().getName();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }

    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getPetSpecies() { return petSpecies; }
    public void setPetSpecies(String petSpecies) { this.petSpecies = petSpecies; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public Long getVeterinarianId() { return veterinarianId; }
    public void setVeterinarianId(Long veterinarianId) { this.veterinarianId = veterinarianId; }

    public String getVeterinarianName() { return veterinarianName; }
    public void setVeterinarianName(String veterinarianName) { this.veterinarianName = veterinarianName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}