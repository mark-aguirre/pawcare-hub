package com.pawcare.hub.service;

import com.pawcare.hub.entity.Veterinarian;
import com.pawcare.hub.repository.VeterinarianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VeterinarianService {

    @Autowired
    private VeterinarianRepository veterinarianRepository;

    public List<Veterinarian> getAllVeterinarians() {
        return veterinarianRepository.findAll();
    }

    public Optional<Veterinarian> getVeterinarianById(Long id) {
        return veterinarianRepository.findById(id);
    }

    public Veterinarian saveVeterinarian(Veterinarian veterinarian) {
        return veterinarianRepository.save(veterinarian);
    }

    public void deleteVeterinarian(Long id) {
        veterinarianRepository.deleteById(id);
    }

    public List<Veterinarian> searchVeterinariansByName(String name) {
        return veterinarianRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Veterinarian> getVeterinariansBySpecialization(String specialization) {
        return veterinarianRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    public Veterinarian getVeterinarianByEmail(String email) {
        return veterinarianRepository.findByEmail(email);
    }
}