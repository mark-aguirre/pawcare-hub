package com.pawcare.hub.service;

import com.pawcare.hub.entity.User;
import com.pawcare.hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ClinicContextService clinicContextService;

    public List<User> getAllUsers() {
        String clinicCode = clinicContextService.getClinicCode();
        return userRepository.findByIsActiveTrueAndClinicCode(clinicCode);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        // Set clinic code from context
        user.setClinicCode(clinicContextService.getClinicCode());
        
        // Encode password if provided
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        
        // Set default values
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }
        if (user.getRole() == null) {
            user.setRole(User.UserRole.RECEPTIONIST);
        }
        
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public void updateUserClinicCode(Long userId, String clinicCode) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setClinicCode(clinicCode);
            userRepository.save(user);
        }
    }
}