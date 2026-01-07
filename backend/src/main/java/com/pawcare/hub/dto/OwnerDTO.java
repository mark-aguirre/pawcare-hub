package com.pawcare.hub.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OwnerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private List<PetSummaryDTO> pets;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class PetSummaryDTO {
        private Long id;
        private String name;
        private String species;
        private String breed;

        public PetSummaryDTO(Long id, String name, String species, String breed) {
            this.id = id;
            this.name = name;
            this.species = species;
            this.breed = breed;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSpecies() { return species; }
        public void setSpecies(String species) { this.species = species; }
        public String getBreed() { return breed; }
        public void setBreed(String breed) { this.breed = breed; }
    }

    // Constructors
    public OwnerDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public List<PetSummaryDTO> getPets() { return pets; }
    public void setPets(List<PetSummaryDTO> pets) { this.pets = pets; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}