package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Veterinarian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VeterinarianRepository extends JpaRepository<Veterinarian, Long> {
    
    List<Veterinarian> findByNameContainingIgnoreCase(String name);
    
    List<Veterinarian> findBySpecializationContainingIgnoreCase(String specialization);
    
    @Query("SELECT v FROM Veterinarian v WHERE v.email = :email")
    Veterinarian findByEmail(@Param("email") String email);
}