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

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    public Optional<Owner> getOwnerById(Long id) {
        return ownerRepository.findById(id);
    }

    public Owner saveOwner(Owner owner) {
        boolean isNew = owner.getId() == null;
        Owner saved = ownerRepository.save(owner);
        String action = isNew ? "CREATE" : "UPDATE";
        String description = isNew ? "New client registered" : "Client information updated";
        activityService.logActivity(action, "OWNER", saved.getId(), saved.getName(), description);
        return saved;
    }

    public void deleteOwner(Long id) {
        Optional<Owner> owner = ownerRepository.findById(id);
        if (owner.isPresent()) {
            String ownerName = owner.get().getName();
            ownerRepository.deleteById(id);
            activityService.logActivity("DELETE", "OWNER", id, ownerName, "Client removed from system");
        }
    }

    public Optional<Owner> getOwnerByEmail(String email) {
        return ownerRepository.findByEmail(email);
    }

    public List<Owner> searchOwnersByName(String name) {
        return ownerRepository.findByNameContaining(name);
    }
}