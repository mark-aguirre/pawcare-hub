package com.pawcare.hub.controller;

import com.pawcare.hub.entity.MedicalRecord;
import com.pawcare.hub.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordService.getAllMedicalRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        Optional<MedicalRecord> record = medicalRecordService.getMedicalRecordById(id);
        return record.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MedicalRecord createMedicalRecord(@RequestBody MedicalRecord record) {
        return medicalRecordService.saveMedicalRecord(record);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(@PathVariable Long id, @RequestBody MedicalRecord recordDetails) {
        Optional<MedicalRecord> record = medicalRecordService.getMedicalRecordById(id);
        if (record.isPresent()) {
            MedicalRecord existing = record.get();
            existing.setTitle(recordDetails.getTitle());
            existing.setDescription(recordDetails.getDescription());
            existing.setNotes(recordDetails.getNotes());
            existing.setStatus(recordDetails.getStatus());
            existing.setAttachments(recordDetails.getAttachments());
            return ResponseEntity.ok(medicalRecordService.saveMedicalRecord(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        if (medicalRecordService.getMedicalRecordById(id).isPresent()) {
            medicalRecordService.deleteMedicalRecord(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pet/{petId}")
    public List<MedicalRecord> getMedicalRecordsByPet(@PathVariable Long petId) {
        return medicalRecordService.getMedicalRecordsByPet(petId);
    }

    @GetMapping("/type/{type}")
    public List<MedicalRecord> getMedicalRecordsByType(@PathVariable MedicalRecord.RecordType type) {
        return medicalRecordService.getMedicalRecordsByType(type);
    }
}