package com.pawcare.hub.controller;

import com.pawcare.hub.entity.Vaccination;
import com.pawcare.hub.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vaccinations")
@CrossOrigin(origins = "http://localhost:3000")
public class VaccinationController {

    @Autowired
    private VaccinationRepository vaccinationRepository;

    @GetMapping
    public List<Vaccination> getAllVaccinations() {
        return vaccinationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vaccination> getVaccinationById(@PathVariable Long id) {
        Optional<Vaccination> vaccination = vaccinationRepository.findById(id);
        return vaccination.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vaccination createVaccination(@RequestBody Vaccination vaccination) {
        return vaccinationRepository.save(vaccination);
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
}