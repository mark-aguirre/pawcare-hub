package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    
    List<Pet> findByOwnerId(Long ownerId);
    
    List<Pet> findBySpecies(String species);
    
    @Query("SELECT p FROM Pet p WHERE p.name LIKE %:name%")
    List<Pet> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT p FROM Pet p JOIN p.owner o WHERE o.lastName LIKE %:ownerName%")
    List<Pet> findByOwnerLastNameContaining(@Param("ownerName") String ownerName);
}