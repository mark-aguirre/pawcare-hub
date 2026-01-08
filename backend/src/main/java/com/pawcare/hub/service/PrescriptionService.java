package com.pawcare.hub.service;

import com.pawcare.hub.entity.Prescription;
import com.pawcare.hub.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private ActivityService activityService;

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public Prescription savePrescription(Prescription prescription) {
        boolean isNew = prescription.getId() == null;
        Prescription saved = prescriptionRepository.save(prescription);
        String action = isNew ? "CREATE" : "UPDATE";
        String petName = saved.getPet() != null ? saved.getPet().getName() : "Unknown Pet";
        String description = isNew ? "Prescription created" : "Prescription updated";
        activityService.logActivity(action, "PRESCRIPTION", saved.getId(), 
            "Prescription for " + petName, description);
        return saved;
    }

    public void deletePrescription(Long id) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            String petName = prescription.get().getPet() != null ? prescription.get().getPet().getName() : "Unknown Pet";
            prescriptionRepository.deleteById(id);
            activityService.logActivity("DELETE", "PRESCRIPTION", id, 
                "Prescription for " + petName, "Prescription deleted");
        }
    }

    public List<Prescription> getPrescriptionsByPet(Long petId) {
        return prescriptionRepository.findByPetId(petId);
    }
}