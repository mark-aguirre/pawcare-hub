package com.pawcare.hub.controller;

import com.pawcare.hub.dto.PetDTO;
import com.pawcare.hub.entity.Pet;
import com.pawcare.hub.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    public List<PetDTO> getAllPets() {
        return petService.getAllPets().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetDTO> getPetById(@PathVariable Long id) {
        Optional<Pet> pet = petService.getPetById(id);
        return pet.map(p -> ResponseEntity.ok(convertToDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PetDTO createPet(@RequestBody Pet pet) {
        Pet saved = petService.savePet(pet);
        return convertToDTO(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetDTO> updatePet(@PathVariable Long id, @RequestBody Pet petDetails) {
        Optional<Pet> pet = petService.getPetById(id);
        if (pet.isPresent()) {
            Pet existing = pet.get();
            existing.setName(petDetails.getName());
            existing.setSpecies(petDetails.getSpecies());
            existing.setBreed(petDetails.getBreed());
            existing.setColor(petDetails.getColor());
            existing.setDateOfBirth(petDetails.getDateOfBirth());
            existing.setGender(petDetails.getGender());
            existing.setWeight(petDetails.getWeight());
            existing.setMicrochipId(petDetails.getMicrochipId());
            Pet saved = petService.savePet(existing);
            return ResponseEntity.ok(convertToDTO(saved));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        if (petService.getPetById(id).isPresent()) {
            petService.deletePet(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    private PetDTO convertToDTO(Pet pet) {
        PetDTO dto = new PetDTO();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setSpecies(pet.getSpecies());
        dto.setBreed(pet.getBreed());
        dto.setColor(pet.getColor());
        dto.setDateOfBirth(pet.getDateOfBirth());
        dto.setGender(pet.getGender());
        dto.setWeight(pet.getWeight());
        dto.setMicrochipId(pet.getMicrochipId());
        dto.setCreatedAt(pet.getCreatedAt());
        
        if (pet.getOwner() != null) {
            dto.setOwnerId(pet.getOwner().getId());
            dto.setOwnerName(pet.getOwner().getFirstName() + " " + pet.getOwner().getLastName());
            
            // Include full owner object
            PetDTO.OwnerSummaryDTO ownerDto = new PetDTO.OwnerSummaryDTO();
            ownerDto.setId(pet.getOwner().getId());
            ownerDto.setFirstName(pet.getOwner().getFirstName());
            ownerDto.setLastName(pet.getOwner().getLastName());
            ownerDto.setEmail(pet.getOwner().getEmail());
            ownerDto.setPhone(pet.getOwner().getPhone());
            ownerDto.setAddress(pet.getOwner().getAddress());
            ownerDto.setCreatedAt(pet.getOwner().getCreatedAt());
            dto.setOwner(ownerDto);
        }
        
        return dto;
    }
}