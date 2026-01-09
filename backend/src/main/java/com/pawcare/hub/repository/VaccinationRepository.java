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
    
    @Query(value = "SELECT v.id, v.pet_id, v.vaccine_type, v.administered_date, v.next_due_date, " +
           "v.veterinarian_id, v.batch_number, v.notes, v.status, v.created_at, v.updated_at, " +
           "p.name AS pet_name, v2.name AS veterinarian_name " +
           "FROM vaccinations v " +
           "LEFT JOIN pets p ON p.id = v.pet_id " +
           "LEFT JOIN veterinarians v2 ON v2.id = v.veterinarian_id", nativeQuery = true)
    List<Object[]> findAllWithRelations();
    
    List<Vaccination> findByPetId(Long petId);
    
    List<Vaccination> findByStatus(Vaccination.VaccinationStatus status);
    
    @Query("SELECT v FROM Vaccination v WHERE v.nextDueDate <= :date")
    List<Vaccination> findDueVaccinations(@Param("date") LocalDate date);
    
    @Query("SELECT v FROM Vaccination v WHERE v.nextDueDate BETWEEN :startDate AND :endDate")
    List<Vaccination> findUpcomingVaccinations(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}