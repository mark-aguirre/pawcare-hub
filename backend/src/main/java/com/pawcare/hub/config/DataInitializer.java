package com.pawcare.hub.config;

import com.pawcare.hub.entity.User;
import com.pawcare.hub.entity.Owner;
import com.pawcare.hub.entity.ClinicSettings;
import com.pawcare.hub.repository.UserRepository;
import com.pawcare.hub.repository.OwnerRepository;
import com.pawcare.hub.repository.ClinicSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OwnerRepository ownerRepository;
    
    @Autowired
    private ClinicSettingsRepository clinicSettingsRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        // Create clinic settings if not exists
        if (clinicSettingsRepository.count() == 0) {
            ClinicSettings clinic = new ClinicSettings();
            clinic.setClinicCode("DEMO123");
            clinic.setClinicName("Demo Veterinary Clinic");
            clinicSettingsRepository.save(clinic);
        }

        // Create test users if not exists
        if (userRepository.count() == 0) {
            // Admin user
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@pawcare.com");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole(User.UserRole.ADMINISTRATOR);
            admin.setIsActive(true);
            userRepository.save(admin);

            // Veterinarian user
            User vet = new User();
            vet.setFirstName("Dr. Sarah");
            vet.setLastName("Johnson");
            vet.setEmail("vet@pawcare.com");
            vet.setPassword(passwordEncoder.encode("password"));
            vet.setRole(User.UserRole.VETERINARIAN);
            vet.setIsActive(true);
            userRepository.save(vet);
        }

        // Create test owner if not exists
        if (ownerRepository.count() == 0) {
            Owner owner = new Owner();
            owner.setPid("PID001");
            owner.setFirstName("John");
            owner.setLastName("Doe");
            owner.setEmail("owner@pawcare.com");
            owner.setPhone("555-0123");
            owner.setAddress("123 Main St");
            owner.setCity("Demo City");
            owner.setState("Demo State");
            owner.setZipCode("12345");
            ownerRepository.save(owner);
        }
    }
}