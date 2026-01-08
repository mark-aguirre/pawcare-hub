package com.pawcare.hub.service;

import com.pawcare.hub.entity.Vaccination;
import com.pawcare.hub.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VaccinationService {

    @Autowired
    private VaccinationRepository vaccinationRepository;
    
    @Autowired
    private ActivityService activityService;

    public List<Vaccination> getAllVaccinations() {
        return vaccinationRepository.findAll();
    }

    public Optional<Vaccination> getVaccinationById(Long id) {
        return vaccinationRepository.findById(id);
    }

    public Vaccination saveVaccination(Vaccination vaccination) {
        boolean isNew = vaccination.getId() == null;
        Vaccination saved = vaccinationRepository.save(vaccination);
        String action = isNew ? "CREATE" : "UPDATE";
        String petName = saved.getPet() != null ? saved.getPet().getName() : "Unknown Pet";
        String description = isNew ? "Vaccination recorded" : "Vaccination updated";
        activityService.logActivity(action, "VACCINATION", saved.getId(), 
            "Vaccination for " + petName, description);
        return saved;
    }

    public void deleteVaccination(Long id) {
        Optional<Vaccination> vaccination = vaccinationRepository.findById(id);
        if (vaccination.isPresent()) {
            String petName = vaccination.get().getPet() != null ? vaccination.get().getPet().getName() : "Unknown Pet";
            vaccinationRepository.deleteById(id);
            activityService.logActivity("DELETE", "VACCINATION", id, 
                "Vaccination for " + petName, "Vaccination record deleted");
        }
    }

    public List<Vaccination> getVaccinationsByPet(Long petId) {
        return vaccinationRepository.findByPetId(petId);
    }
}