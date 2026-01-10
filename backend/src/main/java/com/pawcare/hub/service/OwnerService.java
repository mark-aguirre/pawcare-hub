package com.pawcare.hub.service;

import com.pawcare.hub.entity.Owner;
import com.pawcare.hub.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private ClinicContextService clinicContextService;

    public List<Owner> getAllOwners() {
        String clinicCode = clinicContextService.getClinicCode();
        return ownerRepository.findByClinicCode(clinicCode);
    }

    public Optional<Owner> getOwnerById(Long id) {
        String clinicCode = clinicContextService.getClinicCode();
        return ownerRepository.findByIdAndClinicCode(id, clinicCode);
    }

    public Owner saveOwner(Owner owner) {
        String clinicCode = clinicContextService.getClinicCode();
        owner.setClinicCode(clinicCode);
        
        boolean isNew = owner.getId() == null;
        Owner saved = ownerRepository.save(owner);
        String action = isNew ? "CREATE" : "UPDATE";
        String description = isNew ? "New client registered" : "Client information updated";
        activityService.logActivity(action, "OWNER", saved.getId(), saved.getName(), description);
        return saved;
    }

    public void deleteOwner(Long id) {
        String clinicCode = clinicContextService.getClinicCode();
        Optional<Owner> owner = ownerRepository.findByIdAndClinicCode(id, clinicCode);
        if (owner.isPresent()) {
            String ownerName = owner.get().getName();
            ownerRepository.deleteByIdAndClinicCode(id, clinicCode);
            activityService.logActivity("DELETE", "OWNER", id, ownerName, "Client removed from system");
        }
    }

    public Optional<Owner> getOwnerByEmail(String email) {
        String clinicCode = clinicContextService.getClinicCode();
        return ownerRepository.findByEmailAndClinicCode(email, clinicCode);
    }

    public List<Owner> searchOwnersByName(String name) {
        String clinicCode = clinicContextService.getClinicCode();
        return ownerRepository.findByNameContainingAndClinicCode(name, clinicCode);
    }
}