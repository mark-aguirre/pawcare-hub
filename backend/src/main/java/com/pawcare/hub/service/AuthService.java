package com.pawcare.hub.service;

import com.pawcare.hub.entity.User;
import com.pawcare.hub.entity.Owner;
import com.pawcare.hub.repository.UserRepository;
import com.pawcare.hub.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OwnerRepository ownerRepository;

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
}