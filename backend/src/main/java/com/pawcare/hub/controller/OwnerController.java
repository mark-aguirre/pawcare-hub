package com.pawcare.hub.controller;

import com.pawcare.hub.dto.AppointmentDTO;
import com.pawcare.hub.dto.OwnerDTO;
import com.pawcare.hub.entity.Owner;
import com.pawcare.hub.service.AppointmentService;
import com.pawcare.hub.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin(origins = "http://localhost:3000")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;
    
    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<OwnerDTO> getAllOwners() {
        return ownerService.getAllOwners().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OwnerDTO> getOwnerById(@PathVariable Long id) {
        Optional<Owner> owner = ownerService.getOwnerById(id);
        return owner.map(o -> ResponseEntity.ok(convertToDTO(o)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OwnerDTO createOwner(@RequestBody Owner owner) {
        Owner saved = ownerService.saveOwner(owner);
        return convertToDTO(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OwnerDTO> updateOwner(@PathVariable Long id, @RequestBody Owner ownerDetails) {
        Optional<Owner> owner = ownerService.getOwnerById(id);
        if (owner.isPresent()) {
            Owner existingOwner = owner.get();
            existingOwner.setFirstName(ownerDetails.getFirstName());
            existingOwner.setLastName(ownerDetails.getLastName());
            existingOwner.setEmail(ownerDetails.getEmail());
            existingOwner.setPhone(ownerDetails.getPhone());
            existingOwner.setAddress(ownerDetails.getAddress());
            existingOwner.setCity(ownerDetails.getCity());
            existingOwner.setState(ownerDetails.getState());
            existingOwner.setZipCode(ownerDetails.getZipCode());
            Owner saved = ownerService.saveOwner(existingOwner);
            return ResponseEntity.ok(convertToDTO(saved));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long id) {
        if (ownerService.getOwnerById(id).isPresent()) {
            ownerService.deleteOwner(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<OwnerDTO> searchOwners(@RequestParam String name) {
        return ownerService.searchOwnersByName(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/appointments")
    public List<AppointmentDTO> getOwnerAppointments(@PathVariable Long id) {
        return appointmentService.getAppointmentsByOwner(id).stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/total-spent")
    public ResponseEntity<Double> getOwnerTotalSpent(@PathVariable Long id) {
        // This would calculate total from invoices/billing
        // For now, return 0
        return ResponseEntity.ok(0.0);
    }

    private OwnerDTO convertToDTO(Owner owner) {
        OwnerDTO dto = new OwnerDTO();
        dto.setId(owner.getId());
        dto.setFirstName(owner.getFirstName());
        dto.setLastName(owner.getLastName());
        dto.setEmail(owner.getEmail());
        dto.setPhone(owner.getPhone());
        dto.setAddress(owner.getAddress());
        dto.setCity(owner.getCity());
        dto.setState(owner.getState());
        dto.setZipCode(owner.getZipCode());
        dto.setCreatedAt(owner.getCreatedAt());
        dto.setUpdatedAt(owner.getUpdatedAt());
        
        if (owner.getPets() != null) {
            dto.setPets(owner.getPets().stream()
                    .map(pet -> new OwnerDTO.PetSummaryDTO(
                            pet.getId(),
                            pet.getName(),
                            pet.getSpecies(),
                            pet.getBreed()))
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
}