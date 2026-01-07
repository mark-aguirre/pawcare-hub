package com.pawcare.hub.repository;

import com.pawcare.hub.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    
    List<LabTest> findByPetId(Long petId);
    
    List<LabTest> findByStatus(LabTest.TestStatus status);
    
    List<LabTest> findByVeterinarianId(Long veterinarianId);
    
    @Query("SELECT l FROM LabTest l WHERE l.requestedDate BETWEEN :startDate AND :endDate")
    List<LabTest> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}