package com.pawcare.hub.controller;

import com.pawcare.hub.dto.VaccinationDTO;
import com.pawcare.hub.entity.Vaccination;
import com.pawcare.hub.entity.Pet;
import com.pawcare.hub.entity.Veterinarian;
import com.pawcare.hub.repository.VaccinationRepository;
import com.pawcare.hub.repository.PetRepository;
import com.pawcare.hub.repository.VeterinarianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/vaccinations")
@CrossOrigin(origins = "http://localhost:3000")
public class VaccinationController {

    @Autowired
    private VaccinationRepository vaccinationRepository;
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private VeterinarianRepository veterinarianRepository;

    @GetMapping
    public ResponseEntity<List<VaccinationDTO>> getAllVaccinations() {
        try {
            List<Object[]> results = vaccinationRepository.findAllWithRelations();
            List<VaccinationDTO> vaccinationDTOs = new ArrayList<>();
            
            for (Object[] row : results) {
                VaccinationDTO dto = new VaccinationDTO();
                dto.setId(((Number) row[0]).longValue());
                dto.setPetId(row[1] != null ? ((Number) row[1]).longValue() : null);
                dto.setVaccineType((String) row[2]);
                dto.setAdministeredDate(row[3] != null ? ((java.sql.Date) row[3]).toLocalDate() : null);
                dto.setNextDueDate(row[4] != null ? ((java.sql.Date) row[4]).toLocalDate() : null);
                dto.setVeterinarianId(row[5] != null ? ((Number) row[5]).longValue() : null);
                dto.setBatchNumber((String) row[6]);
                dto.setNotes((String) row[7]);
                dto.setStatus((String) row[8]);
                dto.setCreatedAt(row[9] != null ? ((java.sql.Timestamp) row[9]).toLocalDateTime() : null);
                dto.setUpdatedAt(row[10] != null ? ((java.sql.Timestamp) row[10]).toLocalDateTime() : null);
                dto.setPetName((String) row[11]);
                dto.setVeterinarianName((String) row[12]);
                vaccinationDTOs.add(dto);
            }
            
            return ResponseEntity.ok(vaccinationDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vaccination> getVaccinationById(@PathVariable Long id) {
        Optional<Vaccination> vaccination = vaccinationRepository.findById(id);
        return vaccination.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vaccination> createVaccination(@RequestBody VaccinationCreateRequest request) {
        try {
            Vaccination vaccination = new Vaccination();
            
            // Set Pet
            Optional<Pet> pet = petRepository.findById(request.getPetId());
            if (pet.isPresent()) {
                vaccination.setPet(pet.get());
            } else {
                return ResponseEntity.badRequest().build();
            }
            
            // Set Veterinarian
            Optional<Veterinarian> vet = veterinarianRepository.findById(request.getVeterinarianId());
            if (vet.isPresent()) {
                vaccination.setVeterinarian(vet.get());
            } else {
                return ResponseEntity.badRequest().build();
            }
            
            vaccination.setVaccineType(request.getVaccineType());
            vaccination.setAdministeredDate(LocalDate.parse(request.getAdministeredDate()));
            vaccination.setNextDueDate(LocalDate.parse(request.getNextDueDate()));
            vaccination.setBatchNumber(request.getBatchNumber());
            vaccination.setNotes(request.getNotes());
            vaccination.setStatus(Vaccination.VaccinationStatus.valueOf(request.getStatus()));
            
            Vaccination saved = vaccinationRepository.save(vaccination);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    public static class VaccinationCreateRequest {
        private Long petId;
        private String vaccineType;
        private String administeredDate;
        private String nextDueDate;
        private Long veterinarianId;
        private String batchNumber;
        private String notes;
        private String status;
        
        // Getters and setters
        public Long getPetId() { return petId; }
        public void setPetId(Long petId) { this.petId = petId; }
        public String getVaccineType() { return vaccineType; }
        public void setVaccineType(String vaccineType) { this.vaccineType = vaccineType; }
        public String getAdministeredDate() { return administeredDate; }
        public void setAdministeredDate(String administeredDate) { this.administeredDate = administeredDate; }
        public String getNextDueDate() { return nextDueDate; }
        public void setNextDueDate(String nextDueDate) { this.nextDueDate = nextDueDate; }
        public Long getVeterinarianId() { return veterinarianId; }
        public void setVeterinarianId(Long veterinarianId) { this.veterinarianId = veterinarianId; }
        public String getBatchNumber() { return batchNumber; }
        public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaccination> updateVaccination(@PathVariable Long id, @RequestBody Vaccination vaccinationDetails) {
        Optional<Vaccination> vaccination = vaccinationRepository.findById(id);
        if (vaccination.isPresent()) {
            Vaccination existing = vaccination.get();
            existing.setStatus(vaccinationDetails.getStatus());
            existing.setAdministeredDate(vaccinationDetails.getAdministeredDate());
            existing.setNextDueDate(vaccinationDetails.getNextDueDate());
            existing.setBatchNumber(vaccinationDetails.getBatchNumber());
            existing.setNotes(vaccinationDetails.getNotes());
            return ResponseEntity.ok(vaccinationRepository.save(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long id) {
        if (vaccinationRepository.findById(id).isPresent()) {
            vaccinationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pet/{petId}")
    public List<Vaccination> getVaccinationsByPet(@PathVariable Long petId) {
        return vaccinationRepository.findByPetId(petId);
    }

    @GetMapping("/due")
    public List<Vaccination> getDueVaccinations(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate checkDate = date != null ? date : LocalDate.now();
        return vaccinationRepository.findDueVaccinations(checkDate);
    }

    @GetMapping("/upcoming")
    public List<Vaccination> getUpcomingVaccinations(@RequestParam(defaultValue = "30") int daysAhead) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(daysAhead);
        return vaccinationRepository.findUpcomingVaccinations(startDate, endDate);
    }

    private VaccinationDTO convertToDTO(Vaccination vaccination) {
        VaccinationDTO dto = new VaccinationDTO();
        dto.setId(vaccination.getId());
        
        if (vaccination.getPet() != null) {
            dto.setPetId(vaccination.getPet().getId());
            dto.setPetName(vaccination.getPet().getName());
        }
        
        dto.setVaccineType(vaccination.getVaccineType());
        dto.setAdministeredDate(vaccination.getAdministeredDate());
        dto.setNextDueDate(vaccination.getNextDueDate());
        
        if (vaccination.getVeterinarian() != null) {
            dto.setVeterinarianId(vaccination.getVeterinarian().getId());
            String firstName = vaccination.getVeterinarian().getFirstName();
            String lastName = vaccination.getVeterinarian().getLastName();
            if (firstName != null && lastName != null) {
                dto.setVeterinarianName(firstName + " " + lastName);
            }
        }
        
        dto.setBatchNumber(vaccination.getBatchNumber());
        dto.setNotes(vaccination.getNotes());
        dto.setStatus(vaccination.getStatus() != null ? vaccination.getStatus().toString() : null);
        dto.setCreatedAt(vaccination.getCreatedAt());
        dto.setUpdatedAt(vaccination.getUpdatedAt());
        return dto;
    }
}