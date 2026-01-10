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
    
    @Autowired
    private ClinicContextService clinicContextService;

    public List<Pet> getAllPets() {
        String clinicCode = clinicContextService.getClinicCode();
        return petRepository.findByClinicCode(clinicCode);
    }

    public List<Pet> getAllPetsByClinic(String clinicCode) {
        return petRepository.findByClinicCode(clinicCode);
    }

    public Optional<Pet> getPetById(Long id) {
        String clinicCode = clinicContextService.getClinicCode();
        return petRepository.findByIdAndClinicCode(id, clinicCode);
    }

    public Pet savePet(Pet pet) {
        String clinicCode = clinicContextService.getClinicCode();
        pet.setClinicCode(clinicCode);
        
        boolean isNew = pet.getId() == null;
        Pet saved = petRepository.save(pet);
        String action = isNew ? "CREATE" : "UPDATE";
        String description = isNew ? "New pet registered" : "Pet information updated";
        activityService.logActivity(action, "PET", saved.getId(), saved.getName(), description);
        return saved;
    }

    public void deletePet(Long id) {
        String clinicCode = clinicContextService.getClinicCode();
        Optional<Pet> pet = petRepository.findByIdAndClinicCode(id, clinicCode);
        if (pet.isPresent()) {
            String petName = pet.get().getName();
            petRepository.deleteByIdAndClinicCode(id, clinicCode);
            activityService.logActivity("DELETE", "PET", id, petName, "Pet removed from system");
        }
    }

    public List<Pet> getPetsByOwnerId(Long ownerId) {
        String clinicCode = clinicContextService.getClinicCode();
        return petRepository.findByOwnerIdAndClinicCode(ownerId, clinicCode);
    }

    public List<Pet> getPetsByOwnerIdAndClinic(Long ownerId, String clinicCode) {
        return petRepository.findByOwnerIdAndClinicCode(ownerId, clinicCode);
    }

    public List<Pet> searchPetsByName(String name) {
        String clinicCode = clinicContextService.getClinicCode();
        return petRepository.findByNameContainingAndClinicCode(name, clinicCode);
    }

    public List<Pet> getPetsBySpecies(String species) {
        String clinicCode = clinicContextService.getClinicCode();
        return petRepository.findBySpeciesAndClinicCode(species, clinicCode);
    }
}