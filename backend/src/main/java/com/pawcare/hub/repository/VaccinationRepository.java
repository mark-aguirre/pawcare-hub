package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {
    
    List<Vaccination> findByPetId(Long petId);
    
    List<Vaccination> findByStatus(Vaccination.VaccinationStatus status);
    
    @Query("SELECT v FROM Vaccination v WHERE v.nextDueDate <= :date")
    List<Vaccination> findDueVaccinations(@Param("date") LocalDate date);
    
    @Query("SELECT v FROM Vaccination v WHERE v.nextDueDate BETWEEN :startDate AND :endDate")
    List<Vaccination> findUpcomingVaccinations(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}