package com.pawcare.hub.controller;

import com.pawcare.hub.entity.ClinicSettings;
import com.pawcare.hub.service.ClinicService;
import com.pawcare.hub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clinics")
@CrossOrigin(origins = "*")
public class ClinicController {

    @Autowired
    private ClinicService clinicService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createClinic(@RequestBody Map<String, Object> clinicData) {
        try {
            if (!clinicData.containsKey("userId") || clinicData.get("userId") == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "userId must be included"
                ));
            }
            
            Long userId = Long.valueOf(clinicData.get("userId").toString());
            ClinicSettings clinic = clinicService.createClinic(clinicData, userId);
            
            userService.updateUserClinicCode(userId, clinic.getClinicCode());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "clinic", clinic,
                "message", "Clinic created successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<ClinicSettings>> getAllClinics() {
        return ResponseEntity.ok(clinicService.getAllClinics());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClinic(@PathVariable Long id, @RequestBody Map<String, Object> clinicData) {
        try {
            ClinicSettings clinic = clinicService.updateClinic(id, clinicData);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "clinic", clinic,
                "message", "Clinic updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}