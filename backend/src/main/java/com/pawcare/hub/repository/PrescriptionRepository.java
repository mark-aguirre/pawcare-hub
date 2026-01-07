package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    List<Prescription> findByPetId(Long petId);
    
    List<Prescription> findByStatus(Prescription.PrescriptionStatus status);
    
    List<Prescription> findByVeterinarianId(Long veterinarianId);
    
    @Query("SELECT p FROM Prescription p WHERE p.medicationName LIKE %:medication%")
    List<Prescription> findByMedicationName(@Param("medication") String medication);
}