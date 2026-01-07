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

    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public Optional<MedicalRecord> getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id);
    }

    public MedicalRecord saveMedicalRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }

    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    public List<MedicalRecord> getMedicalRecordsByPet(Long petId) {
        return medicalRecordRepository.findByPetId(petId);
    }

    public List<MedicalRecord> getMedicalRecordsByType(MedicalRecord.RecordType type) {
        return medicalRecordRepository.findByType(type);
    }
}