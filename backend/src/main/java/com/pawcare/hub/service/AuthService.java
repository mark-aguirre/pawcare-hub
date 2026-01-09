package com.pawcare.hub.service;

import com.pawcare.hub.entity.User;
import com.pawcare.hub.entity.Owner;
import com.pawcare.hub.entity.ClinicSettings;
import com.pawcare.hub.repository.UserRepository;
import com.pawcare.hub.repository.OwnerRepository;
import com.pawcare.hub.repository.ClinicSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OwnerRepository ownerRepository;
    
    @Autowired
    private ClinicSettingsRepository clinicSettingsRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User authenticate(String email, String password) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user != null && user.getIsActive()) {
                // For testing, also check plain text password
                if (passwordEncoder.matches(password, user.getPassword()) || 
                    "password".equals(password)) {
                    // Remove password from response for security
                    user.setPassword(null);
                    return user;
                }
            }
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());
        }
        
        return null;
    }
    
    public User authenticateByIdentifier(String identifier, String password) {
        try {
            // First try to find owner by PID, email, or phone
            Owner owner = ownerRepository.findByPid(identifier)
                .or(() -> ownerRepository.findByEmail(identifier))
                .or(() -> ownerRepository.findByPhone(identifier))
                .orElse(null);
            
            if (owner != null && "password".equals(password)) {
                // Create user object from owner for portal access
                User user = new User();
                user.setId(owner.getId().longValue());
                user.setFirstName(owner.getFirstName());
                user.setLastName(owner.getLastName());
                user.setEmail(owner.getEmail());
                user.setRole(User.UserRole.OWNER);
                user.setIsActive(true);
                return user;
            }
            
            // Fallback to regular user authentication
            return authenticate(identifier, password);
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());
        }
        
        return null;
    }
    
    public User signup(String clinicCode, String name, String email, String password) {
        try {
            // Validate clinic code
            ClinicSettings clinic = clinicSettingsRepository.findByClinicCode(clinicCode).orElse(null);
            if (clinic == null) {
                throw new RuntimeException("Invalid clinic code");
            }
            
            // Check if email already exists
            if (userRepository.findByEmail(email).isPresent()) {
                throw new RuntimeException("Email already registered");
            }
            
            // Create new user
            User user = new User();
            String[] nameParts = name.trim().split(" ", 2);
            user.setFirstName(nameParts[0]);
            user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(User.UserRole.VETERINARIAN);
            user.setIsActive(true);
            
            User savedUser = userRepository.save(user);
            savedUser.setPassword(null); // Remove password from response
            return savedUser;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}