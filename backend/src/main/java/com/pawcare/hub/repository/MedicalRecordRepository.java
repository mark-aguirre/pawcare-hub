package com.pawcare.hub.repository;

import com.pawcare.hub.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    List<MedicalRecord> findByPetId(Long petId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.pet.owner.id = :ownerId")
    List<MedicalRecord> findByPetOwnerId(@Param("ownerId") Long ownerId);
    
    List<MedicalRecord> findByType(MedicalRecord.RecordType type);
    
    List<MedicalRecord> findByStatus(MedicalRecord.RecordStatus status);
    
    List<MedicalRecord> findByVeterinarianId(Long veterinarianId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.pet.id = :petId ORDER BY mr.date DESC")
    List<MedicalRecord> findByPetIdOrderByDateDesc(@Param("petId") Long petId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.date BETWEEN :start AND :end")
    List<MedicalRecord> findByDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE LOWER(mr.pet.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<MedicalRecord> findByPetNameContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE " +
           "LOWER(mr.pet.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(mr.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(mr.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<MedicalRecord> searchByMultipleFields(@Param("search") String search);
}