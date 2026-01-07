package com.pawcare.hub.controller;

import com.pawcare.hub.entity.LabTest;
import com.pawcare.hub.repository.LabTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lab-tests")
@CrossOrigin(origins = "http://localhost:3000")
public class LabTestController {

    @Autowired
    private LabTestRepository labTestRepository;

    @GetMapping
    public List<LabTest> getAllLabTests() {
        return labTestRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabTest> getLabTestById(@PathVariable Long id) {
        Optional<LabTest> labTest = labTestRepository.findById(id);
        return labTest.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public LabTest createLabTest(@RequestBody LabTest labTest) {
        return labTestRepository.save(labTest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabTest> updateLabTest(@PathVariable Long id, @RequestBody LabTest labTestDetails) {
        Optional<LabTest> labTest = labTestRepository.findById(id);
        if (labTest.isPresent()) {
            LabTest existing = labTest.get();
            existing.setStatus(labTestDetails.getStatus());
            existing.setCompletedDate(labTestDetails.getCompletedDate());
            existing.setResults(labTestDetails.getResults());
            existing.setNotes(labTestDetails.getNotes());
            return ResponseEntity.ok(labTestRepository.save(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabTest(@PathVariable Long id) {
        if (labTestRepository.findById(id).isPresent()) {
            labTestRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pet/{petId}")
    public List<LabTest> getLabTestsByPet(@PathVariable Long petId) {
        return labTestRepository.findByPetId(petId);
    }

    @GetMapping("/status/{status}")
    public List<LabTest> getLabTestsByStatus(@PathVariable LabTest.TestStatus status) {
        return labTestRepository.findByStatus(status);
    }

    @GetMapping("/date-range")
    public List<LabTest> getLabTestsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return labTestRepository.findByDateRange(startDate, endDate);
    }
}