package com.pawcare.hub.controller;

import com.pawcare.hub.entity.Prescription;
import com.pawcare.hub.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        return prescription.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescriptionDetails) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            Prescription existing = prescription.get();
            existing.setStatus(prescriptionDetails.getStatus());
            existing.setRefillsRemaining(prescriptionDetails.getRefillsRemaining());
            existing.setNotes(prescriptionDetails.getNotes());
            return ResponseEntity.ok(prescriptionRepository.save(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        if (prescriptionRepository.findById(id).isPresent()) {
            prescriptionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pet/{petId}")
    public List<Prescription> getPrescriptionsByPet(@PathVariable Long petId) {
        return prescriptionRepository.findByPetId(petId);
    }

    @GetMapping("/status/{status}")
    public List<Prescription> getPrescriptionsByStatus(@PathVariable Prescription.PrescriptionStatus status) {
        return prescriptionRepository.findByStatus(status);
    }
}