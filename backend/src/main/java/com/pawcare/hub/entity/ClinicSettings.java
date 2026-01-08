package com.pawcare.hub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "clinic_settings")
public class ClinicSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clinicName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String timezone;

    @Column(nullable = false)
    private Integer appointmentDuration;

    @Column(nullable = false)
    private LocalTime workingHoursStart;

    @Column(nullable = false)
    private LocalTime workingHoursEnd;

    @Column(nullable = false)
    private Boolean emailNotifications = true;

    @Column(nullable = false)
    private Boolean smsNotifications = false;

    @Column(nullable = false)
    private Boolean appointmentReminders = true;

    @Column(nullable = false)
    private Boolean autoBackup = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BackupFrequency backupFrequency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Theme theme;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum BackupFrequency {
        HOURLY, DAILY, WEEKLY
    }

    public enum Theme {
        LIGHT, DARK, SYSTEM
    }

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

    public String getClinicName() { return clinicName; }
    public void setClinicName(String clinicName) { this.clinicName = clinicName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public Integer getAppointmentDuration() { return appointmentDuration; }
    public void setAppointmentDuration(Integer appointmentDuration) { this.appointmentDuration = appointmentDuration; }

    public LocalTime getWorkingHoursStart() { return workingHoursStart; }
    public void setWorkingHoursStart(LocalTime workingHoursStart) { this.workingHoursStart = workingHoursStart; }

    public LocalTime getWorkingHoursEnd() { return workingHoursEnd; }
    public void setWorkingHoursEnd(LocalTime workingHoursEnd) { this.workingHoursEnd = workingHoursEnd; }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public Boolean getSmsNotifications() { return smsNotifications; }
    public void setSmsNotifications(Boolean smsNotifications) { this.smsNotifications = smsNotifications; }

    public Boolean getAppointmentReminders() { return appointmentReminders; }
    public void setAppointmentReminders(Boolean appointmentReminders) { this.appointmentReminders = appointmentReminders; }

    public Boolean getAutoBackup() { return autoBackup; }
    public void setAutoBackup(Boolean autoBackup) { this.autoBackup = autoBackup; }

    public BackupFrequency getBackupFrequency() { return backupFrequency; }
    public void setBackupFrequency(BackupFrequency backupFrequency) { this.backupFrequency = backupFrequency; }

    public Theme getTheme() { return theme; }
    public void setTheme(Theme theme) { this.theme = theme; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}