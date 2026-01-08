package com.pawcare.hub.service;

import com.pawcare.hub.entity.ClinicSettings;
import com.pawcare.hub.entity.User;
import com.pawcare.hub.entity.UserPermissions;
import com.pawcare.hub.repository.ClinicSettingsRepository;
import com.pawcare.hub.repository.UserRepository;
import com.pawcare.hub.repository.UserPermissionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class SettingsService {

    @Autowired
    private ClinicSettingsRepository clinicSettingsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPermissionsRepository userPermissionsRepository;

    public ClinicSettings getClinicSettings() {
        return clinicSettingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(this::createDefaultSettings);
    }

    public ClinicSettings updateClinicSettings(ClinicSettings settings) {
        ClinicSettings existing = getClinicSettings();
        
        existing.setClinicName(settings.getClinicName());
        existing.setAddress(settings.getAddress());
        existing.setPhone(settings.getPhone());
        existing.setEmail(settings.getEmail());
        existing.setTimezone(settings.getTimezone());
        existing.setAppointmentDuration(settings.getAppointmentDuration());
        existing.setWorkingHoursStart(settings.getWorkingHoursStart());
        existing.setWorkingHoursEnd(settings.getWorkingHoursEnd());
        existing.setEmailNotifications(settings.getEmailNotifications());
        existing.setSmsNotifications(settings.getSmsNotifications());
        existing.setAppointmentReminders(settings.getAppointmentReminders());
        existing.setAutoBackup(settings.getAutoBackup());
        existing.setBackupFrequency(settings.getBackupFrequency());
        existing.setTheme(settings.getTheme());

        return clinicSettingsRepository.save(existing);
    }

    public List<User> getAllUsers() {
        return userRepository.findByIsActiveTrue();
    }

    public UserPermissions getUserPermissions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userPermissionsRepository.findByUser(user)
                .orElseGet(() -> createDefaultPermissions(user));
    }

    public List<UserPermissions> getAllUserPermissions() {
        return userPermissionsRepository.findAll();
    }

    public UserPermissions updateUserPermissions(Long userId, Map<String, Boolean> permissions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserPermissions userPermissions = userPermissionsRepository.findByUser(user)
                .orElseGet(() -> createDefaultPermissions(user));

        userPermissions.setAppointments(permissions.getOrDefault("appointments", false));
        userPermissions.setPets(permissions.getOrDefault("pets", false));
        userPermissions.setOwners(permissions.getOrDefault("owners", false));
        userPermissions.setRecords(permissions.getOrDefault("records", false));
        userPermissions.setInventory(permissions.getOrDefault("inventory", false));
        userPermissions.setBilling(permissions.getOrDefault("billing", false));
        userPermissions.setReports(permissions.getOrDefault("reports", false));
        userPermissions.setSettings(permissions.getOrDefault("settings", false));

        return userPermissionsRepository.save(userPermissions);
    }

    private ClinicSettings createDefaultSettings() {
        ClinicSettings settings = new ClinicSettings();
        settings.setClinicName("PawCare Veterinary Clinic");
        settings.setAddress("123 Pet Street, Animal City, AC 12345");
        settings.setPhone("(555) 123-4567");
        settings.setEmail("info@pawcare.com");
        settings.setTimezone("America/New_York");
        settings.setAppointmentDuration(30);
        settings.setWorkingHoursStart(LocalTime.of(8, 0));
        settings.setWorkingHoursEnd(LocalTime.of(18, 0));
        settings.setEmailNotifications(true);
        settings.setSmsNotifications(false);
        settings.setAppointmentReminders(true);
        settings.setAutoBackup(true);
        settings.setBackupFrequency(ClinicSettings.BackupFrequency.DAILY);
        settings.setTheme(ClinicSettings.Theme.SYSTEM);
        
        return clinicSettingsRepository.save(settings);
    }

    private UserPermissions createDefaultPermissions(User user) {
        UserPermissions permissions = new UserPermissions();
        permissions.setUser(user);
        
        // Set default permissions based on role
        switch (user.getRole()) {
            case ADMINISTRATOR:
                permissions.setAppointments(true);
                permissions.setPets(true);
                permissions.setOwners(true);
                permissions.setRecords(true);
                permissions.setInventory(true);
                permissions.setBilling(true);
                permissions.setReports(true);
                permissions.setSettings(true);
                break;
            case VETERINARIAN:
                permissions.setAppointments(true);
                permissions.setPets(true);
                permissions.setOwners(true);
                permissions.setRecords(true);
                permissions.setInventory(true);
                permissions.setBilling(true);
                permissions.setReports(true);
                permissions.setSettings(false);
                break;
            case NURSE:
            case TECHNICIAN:
                permissions.setAppointments(true);
                permissions.setPets(true);
                permissions.setOwners(true);
                permissions.setRecords(true);
                permissions.setInventory(true);
                permissions.setBilling(false);
                permissions.setReports(false);
                permissions.setSettings(false);
                break;
            case RECEPTIONIST:
                permissions.setAppointments(true);
                permissions.setPets(true);
                permissions.setOwners(true);
                permissions.setRecords(false);
                permissions.setInventory(false);
                permissions.setBilling(true);
                permissions.setReports(false);
                permissions.setSettings(false);
                break;
        }
        
        return userPermissionsRepository.save(permissions);
    }
}