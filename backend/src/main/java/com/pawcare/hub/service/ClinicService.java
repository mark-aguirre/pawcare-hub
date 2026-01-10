package com.pawcare.hub.service;

import com.pawcare.hub.entity.ClinicSettings;
import com.pawcare.hub.entity.User;
import com.pawcare.hub.repository.ClinicSettingsRepository;
import com.pawcare.hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class ClinicService {

    @Autowired
    private ClinicSettingsRepository clinicSettingsRepository;
    
    @Autowired
    private UserRepository userRepository;

    public ClinicSettings createClinic(Map<String, Object> clinicData, Long userId) {
        try {
            ClinicSettings clinic = new ClinicSettings();
            
            // Generate unique clinic code
            String clinicCode = generateClinicCode();
            clinic.setClinicCode(clinicCode);
            
            clinic.setClinicName((String) clinicData.get("name"));
            clinic.setAddress((String) clinicData.get("address"));
            clinic.setPhone((String) clinicData.get("phone"));
            clinic.setEmail((String) clinicData.get("email"));
            
            // Set defaults
            clinic.setTimezone("UTC");
            clinic.setAppointmentDuration(30);
            clinic.setWorkingHoursStart(LocalTime.parse("09:00:00"));
            clinic.setWorkingHoursEnd(LocalTime.parse("17:00:00"));
            clinic.setEmailNotifications(true);
            clinic.setSmsNotifications(false);
            clinic.setAppointmentReminders(true);
            clinic.setAutoBackup(true);
            clinic.setBackupFrequency(ClinicSettings.BackupFrequency.DAILY);
            clinic.setTheme(ClinicSettings.Theme.LIGHT);
            
            clinic.setCreatedAt(LocalDateTime.now());
            clinic.setUpdatedAt(LocalDateTime.now());
            
            ClinicSettings savedClinic = clinicSettingsRepository.save(clinic);
            
            // Update user's clinic_code
            User user = null;
            if (userId != null) {
                user = userRepository.findById(userId).orElse(null);
            } else if (clinicData.containsKey("userEmail")) {
                user = userRepository.findByEmail((String) clinicData.get("userEmail")).orElse(null);
            }
            
            if (user != null) {
                user.setClinicCode(clinicCode);
                userRepository.save(user);
            }
            
            return savedClinic;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create clinic: " + e.getMessage());
        }
    }

    public ClinicSettings createClinic(Map<String, Object> clinicData) {
        return createClinic(clinicData, null);
    }

    public List<ClinicSettings> getAllClinics() {
        return clinicSettingsRepository.findAll();
    }

    public ClinicSettings updateClinic(Long id, Map<String, Object> clinicData) {
        try {
            ClinicSettings clinic = clinicSettingsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));
            
            if (clinicData.containsKey("name")) {
                clinic.setClinicName((String) clinicData.get("name"));
            }
            if (clinicData.containsKey("address")) {
                clinic.setAddress((String) clinicData.get("address"));
            }
            if (clinicData.containsKey("phone")) {
                clinic.setPhone((String) clinicData.get("phone"));
            }
            if (clinicData.containsKey("email")) {
                clinic.setEmail((String) clinicData.get("email"));
            }
            
            clinic.setUpdatedAt(LocalDateTime.now());
            
            return clinicSettingsRepository.save(clinic);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update clinic: " + e.getMessage());
        }
    }

    private String generateClinicCode() {
        String prefix = "PC";
        long timestamp = System.currentTimeMillis();
        String code = prefix + String.valueOf(timestamp).substring(7); // Last 6 digits
        
        // Ensure uniqueness
        while (clinicSettingsRepository.findByClinicCode(code).isPresent()) {
            code = prefix + String.valueOf(System.currentTimeMillis()).substring(7);
        }
        
        return code;
    }
}