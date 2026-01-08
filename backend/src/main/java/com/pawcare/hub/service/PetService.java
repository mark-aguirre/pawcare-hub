package com.pawcare.hub.service;

import com.pawcare.hub.entity.Pet;
import com.pawcare.hub.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private ActivityService activityService;

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Optional<Pet> getPetById(Long id) {
        return petRepository.findById(id);
    }

    public Pet savePet(Pet pet) {
        boolean isNew = pet.getId() == null;
        Pet saved = petRepository.save(pet);
        String action = isNew ? "CREATE" : "UPDATE";
        String description = isNew ? "New pet registered" : "Pet information updated";
        activityService.logActivity(action, "PET", saved.getId(), saved.getName(), description);
        return saved;
    }

    public void deletePet(Long id) {
        Optional<Pet> pet = petRepository.findById(id);
        if (pet.isPresent()) {
            String petName = pet.get().getName();
            petRepository.deleteById(id);
            activityService.logActivity("DELETE", "PET", id, petName, "Pet removed from system");
        }
    }

    public List<Pet> getPetsByOwnerId(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public List<Pet> searchPetsByName(String name) {
        return petRepository.findByNameContaining(name);
    }

    public List<Pet> getPetsBySpecies(String species) {
        return petRepository.findBySpecies(species);
    }
}