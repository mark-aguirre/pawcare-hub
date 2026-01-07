package com.pawcare.hub.controller;

import com.pawcare.hub.entity.Veterinarian;
import com.pawcare.hub.service.VeterinarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/veterinarians")
@CrossOrigin(origins = "http://localhost:3000")
public class VeterinarianController {

    @Autowired
    private VeterinarianService veterinarianService;

    @GetMapping
    public List<Veterinarian> getAllVeterinarians() {
        return veterinarianService.getAllVeterinarians();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veterinarian> getVeterinarianById(@PathVariable Long id) {
        Optional<Veterinarian> veterinarian = veterinarianService.getVeterinarianById(id);
        return veterinarian.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Veterinarian createVeterinarian(@RequestBody Veterinarian veterinarian) {
        return veterinarianService.saveVeterinarian(veterinarian);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Veterinarian> updateVeterinarian(@PathVariable Long id, @RequestBody Veterinarian veterinarianDetails) {
        Optional<Veterinarian> veterinarian = veterinarianService.getVeterinarianById(id);
        if (veterinarian.isPresent()) {
            Veterinarian existing = veterinarian.get();
            existing.setName(veterinarianDetails.getName());
            existing.setSpecialization(veterinarianDetails.getSpecialization());
            existing.setEmail(veterinarianDetails.getEmail());
            existing.setPhone(veterinarianDetails.getPhone());
            existing.setPhotoUrl(veterinarianDetails.getPhotoUrl());
            return ResponseEntity.ok(veterinarianService.saveVeterinarian(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVeterinarian(@PathVariable Long id) {
        if (veterinarianService.getVeterinarianById(id).isPresent()) {
            veterinarianService.deleteVeterinarian(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}