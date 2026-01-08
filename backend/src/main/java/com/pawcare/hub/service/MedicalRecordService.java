package com.pawcare.hub.service;

import com.pawcare.hub.entity.MedicalRecord;
import com.pawcare.hub.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    @Autowired
    private ActivityService activityService;

    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public Optional<MedicalRecord> getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id);
    }

    public MedicalRecord saveMedicalRecord(MedicalRecord record) {
        boolean isNew = record.getId() == null;
        MedicalRecord saved = medicalRecordRepository.save(record);
        String action = isNew ? "CREATE" : "UPDATE";
        String petName = saved.getPet() != null ? saved.getPet().getName() : "Unknown Pet";
        String description = isNew ? "Medical record created" : "Medical record updated";
        activityService.logActivity(action, "MEDICAL_RECORD", saved.getId(), 
            "Record for " + petName, description);
        return saved;
    }

    public void deleteMedicalRecord(Long id) {
        Optional<MedicalRecord> record = medicalRecordRepository.findById(id);
        if (record.isPresent()) {
            String petName = record.get().getPet() != null ? record.get().getPet().getName() : "Unknown Pet";
            medicalRecordRepository.deleteById(id);
            activityService.logActivity("DELETE", "MEDICAL_RECORD", id, 
                "Record for " + petName, "Medical record deleted");
        }
    }

    public List<MedicalRecord> getMedicalRecordsByOwner(Long ownerId) {
        return medicalRecordRepository.findByPetOwnerId(ownerId);
    }

    public List<MedicalRecord> getMedicalRecordsByPet(Long petId) {
        return medicalRecordRepository.findByPetId(petId);
    }

    public List<MedicalRecord> getMedicalRecordsByType(MedicalRecord.RecordType type) {
        return medicalRecordRepository.findByType(type);
    }
}