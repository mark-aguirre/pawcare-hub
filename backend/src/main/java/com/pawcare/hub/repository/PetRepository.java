package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Pet;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PetRepository extends BaseClinicRepository<Pet, Long> {
    
    List<Pet> findByOwnerIdAndClinicCode(Long ownerId, String clinicCode);
    
    List<Pet> findBySpeciesAndClinicCode(String species, String clinicCode);
    
    @Query("SELECT p FROM Pet p WHERE p.name LIKE %:name% AND p.clinicCode = :clinicCode")
    List<Pet> findByNameContainingAndClinicCode(@Param("name") String name, @Param("clinicCode") String clinicCode);
    
    @Query("SELECT p FROM Pet p JOIN p.owner o WHERE o.lastName LIKE %:ownerName% AND p.clinicCode = :clinicCode")
    List<Pet> findByOwnerLastNameContainingAndClinicCode(@Param("ownerName") String ownerName, @Param("clinicCode") String clinicCode);
    
    Optional<Pet> findByMicrochipIdAndClinicCode(String microchipId, String clinicCode);
}