package com.pawcare.hub.service;

import com.pawcare.hub.entity.LabTest;
import com.pawcare.hub.repository.LabTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LabTestService {

    @Autowired
    private LabTestRepository labTestRepository;
    
    @Autowired
    private ActivityService activityService;

    public List<LabTest> getAllLabTests() {
        return labTestRepository.findAll();
    }

    public Optional<LabTest> getLabTestById(Long id) {
        return labTestRepository.findById(id);
    }

    public LabTest saveLabTest(LabTest labTest) {
        boolean isNew = labTest.getId() == null;
        LabTest saved = labTestRepository.save(labTest);
        String action = isNew ? "CREATE" : "UPDATE";
        String petName = saved.getPet() != null ? saved.getPet().getName() : "Unknown Pet";
        String description = isNew ? "Lab test ordered" : "Lab test updated";
        activityService.logActivity(action, "LAB_TEST", saved.getId(), 
            "Lab test for " + petName, description);
        return saved;
    }

    public void deleteLabTest(Long id) {
        Optional<LabTest> labTest = labTestRepository.findById(id);
        if (labTest.isPresent()) {
            String petName = labTest.get().getPet() != null ? labTest.get().getPet().getName() : "Unknown Pet";
            labTestRepository.deleteById(id);
            activityService.logActivity("DELETE", "LAB_TEST", id, 
                "Lab test for " + petName, "Lab test deleted");
        }
    }

    public List<LabTest> getLabTestsByPet(Long petId) {
        return labTestRepository.findByPetId(petId);
    }

    public LabTest updateLabTestStatus(Long id, LabTest.TestStatus status) {
        Optional<LabTest> labTest = labTestRepository.findById(id);
        if (labTest.isPresent()) {
            labTest.get().setStatus(status);
            LabTest saved = labTestRepository.save(labTest.get());
            String petName = saved.getPet() != null ? saved.getPet().getName() : "Unknown Pet";
            activityService.logActivity("STATUS_UPDATE", "LAB_TEST", saved.getId(), 
                "Lab test for " + petName, "Status changed to " + status.toString().toLowerCase());
            return saved;
        }
        return null;
    }
}