package com.pawcare.hub.controller;

import com.pawcare.hub.entity.MedicalRecord;
import com.pawcare.hub.entity.Pet;
import com.pawcare.hub.entity.Veterinarian;
import com.pawcare.hub.service.MedicalRecordService;
import com.pawcare.hub.service.PetService;
import com.pawcare.hub.service.VeterinarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;
    
    @Autowired
    private PetService petService;
    
    @Autowired
    private VeterinarianService veterinarianService;

    @GetMapping
    public List<Map<String, Object>> getAllMedicalRecords(
            @RequestHeader("x-clinic-code") String clinicCode,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(required = false) Long petId,
            @RequestParam(required = false) String search) {
        List<MedicalRecord> records;
        if (search != null && !search.trim().isEmpty()) {
            records = medicalRecordService.searchMedicalRecordsByClinic(search.trim(), clinicCode);
        } else if (petId != null) {
            records = medicalRecordService.getMedicalRecordsByPetAndClinic(petId, clinicCode);
        } else if (ownerId != null) {
            records = medicalRecordService.getMedicalRecordsByOwnerAndClinic(ownerId, clinicCode);
        } else {
            records = medicalRecordService.getAllMedicalRecordsByClinic(clinicCode);
        }
        
        return records.stream().map(this::convertToResponse).collect(java.util.stream.Collectors.toList());
    }
    
    private Map<String, Object> convertToResponse(MedicalRecord record) {
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", record.getId());
        response.put("date", record.getDate());
        response.put("type", record.getType());
        response.put("title", record.getTitle());
        response.put("description", record.getDescription());
        response.put("notes", record.getNotes());
        response.put("attachments", record.getAttachments());
        response.put("status", record.getStatus());
        response.put("createdAt", record.getCreatedAt());
        response.put("updatedAt", record.getUpdatedAt());
        
        if (record.getPet() != null) {
            Map<String, Object> pet = new java.util.HashMap<>();
            pet.put("id", record.getPet().getId());
            pet.put("name", record.getPet().getName());
            pet.put("species", record.getPet().getSpecies());
            if (record.getPet().getOwner() != null) {
                Map<String, Object> owner = new java.util.HashMap<>();
                owner.put("id", record.getPet().getOwner().getId());
                owner.put("firstName", record.getPet().getOwner().getFirstName());
                owner.put("lastName", record.getPet().getOwner().getLastName());
                pet.put("owner", owner);
            }
            response.put("pet", pet);
        }
        
        if (record.getVeterinarian() != null) {
            Map<String, Object> vet = new java.util.HashMap<>();
            vet.put("id", record.getVeterinarian().getId());
            vet.put("name", record.getVeterinarian().getName());
            vet.put("specialization", record.getVeterinarian().getSpecialization());
            response.put("veterinarian", vet);
        }
        
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        Optional<MedicalRecord> record = medicalRecordService.getMedicalRecordById(id);
        return record.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMedicalRecord(@RequestBody Map<String, Object> requestData) {
        try {
            Long petId = Long.valueOf(requestData.get("petId").toString());
            Long veterinarianId = Long.valueOf(requestData.get("veterinarianId").toString());
            
            Optional<Pet> pet = petService.getPetById(petId);
            Optional<Veterinarian> veterinarian = veterinarianService.getVeterinarianById(veterinarianId);
            
            if (!pet.isPresent()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Pet not found\"}");
            }
            if (!veterinarian.isPresent()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Veterinarian not found\"}");
            }
            
            MedicalRecord record = new MedicalRecord();
            record.setPet(pet.get());
            record.setVeterinarian(veterinarian.get());
            record.setDate(LocalDate.parse(requestData.get("date").toString()));
            record.setType(MedicalRecord.RecordType.valueOf(requestData.get("type").toString()));
            record.setTitle(requestData.get("title").toString());
            record.setDescription(requestData.get("description").toString());
            
            if (requestData.get("notes") != null) {
                record.setNotes(requestData.get("notes").toString());
            }
            if (requestData.get("attachments") != null) {
                record.setAttachments(requestData.get("attachments").toString());
            }
            if (requestData.get("status") != null) {
                record.setStatus(MedicalRecord.RecordStatus.valueOf(requestData.get("status").toString()));
            }
            
            MedicalRecord saved = medicalRecordService.saveMedicalRecord(record);
            return ResponseEntity.ok(convertToResponse(saved));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
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