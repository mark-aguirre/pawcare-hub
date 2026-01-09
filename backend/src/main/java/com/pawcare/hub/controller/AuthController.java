package com.pawcare.hub.controller;

import com.pawcare.hub.entity.User;
import com.pawcare.hub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String identifier = credentials.get("identifier");
        String password = credentials.get("password");
        
        User user = authService.authenticateByIdentifier(identifier, password);
        if (user != null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "user", user,
                "message", "Login successful"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid credentials"
            ));
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> signupData) {
        try {
            String clinicCode = signupData.get("clinicCode");
            String name = signupData.get("name");
            String email = signupData.get("email");
            String password = signupData.get("password");
            
            User user = authService.signup(clinicCode, name, email, password);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "user", user,
                "message", "Registration successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}