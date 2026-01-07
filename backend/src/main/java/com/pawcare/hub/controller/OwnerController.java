package com.pawcare.hub.controller;

import com.pawcare.hub.entity.Owner;
import com.pawcare.hub.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin(origins = "http://localhost:3000")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @GetMapping
    public List<Owner> getAllOwners() {
        return ownerService.getAllOwners();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long id) {
        Optional<Owner> owner = ownerService.getOwnerById(id);
        return owner.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Owner createOwner(@RequestBody Owner owner) {
        return ownerService.saveOwner(owner);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Owner> updateOwner(@PathVariable Long id, @RequestBody Owner ownerDetails) {
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
            return ResponseEntity.ok(ownerService.saveOwner(existingOwner));
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
    public List<Owner> searchOwners(@RequestParam String name) {
        return ownerService.searchOwnersByName(name);
    }
}