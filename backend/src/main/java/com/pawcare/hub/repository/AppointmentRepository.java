package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Appointment;
import com.pawcare.hub.entity.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends BaseClinicRepository<Appointment, Long> {
    
    List<Appointment> findByPetIdAndClinicCode(Long petId, String clinicCode);
    
    @Query("SELECT a FROM Appointment a WHERE a.pet.owner.id = :ownerId AND a.clinicCode = :clinicCode")
    List<Appointment> findByPetOwnerIdAndClinicCode(@Param("ownerId") Long ownerId, @Param("clinicCode") String clinicCode);
    
    List<Appointment> findByStatusAndClinicCode(AppointmentStatus status, String clinicCode);
    
    List<Appointment> findByVeterinarianIdAndClinicCode(Long veterinarianId, String clinicCode);
    
    List<Appointment> findByDateAndClinicCode(LocalDate date, String clinicCode);
    
    @Query("SELECT a FROM Appointment a WHERE a.date BETWEEN :start AND :end AND a.clinicCode = :clinicCode")
    List<Appointment> findByDateBetweenAndClinicCode(@Param("start") LocalDate start, @Param("end") LocalDate end, @Param("clinicCode") String clinicCode);
    
    @Query("SELECT a FROM Appointment a WHERE a.date >= :date AND a.clinicCode = :clinicCode ORDER BY a.date ASC, a.time ASC")
    List<Appointment> findUpcomingAppointmentsByClinicCode(@Param("date") LocalDate date, @Param("clinicCode") String clinicCode);
}