package com.pawcare.hub.controller;

import com.pawcare.hub.entity.ClinicSettings;
import com.pawcare.hub.entity.User;
import com.pawcare.hub.entity.UserPermissions;
import com.pawcare.hub.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping
    public ResponseEntity<ClinicSettings> getClinicSettings() {
        ClinicSettings settings = settingsService.getClinicSettings();
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<ClinicSettings> updateClinicSettings(@RequestBody ClinicSettings settings) {
        ClinicSettings updatedSettings = settingsService.updateClinicSettings(settings);
        return ResponseEntity.ok(updatedSettings);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = settingsService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/permissions")
    public ResponseEntity<?> getUserPermissions(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            UserPermissions permissions = settingsService.getUserPermissions(userId);
            return ResponseEntity.ok(permissions);
        } else {
            List<UserPermissions> allPermissions = settingsService.getAllUserPermissions();
            return ResponseEntity.ok(allPermissions);
        }
    }

    @PutMapping("/permissions")
    public ResponseEntity<UserPermissions> updateUserPermissions(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        @SuppressWarnings("unchecked")
        Map<String, Boolean> permissions = (Map<String, Boolean>) request.get("permissions");
        
        UserPermissions updatedPermissions = settingsService.updateUserPermissions(userId, permissions);
        return ResponseEntity.ok(updatedPermissions);
    }
}