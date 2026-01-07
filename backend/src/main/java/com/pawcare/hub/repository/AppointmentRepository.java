package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Appointment;
import com.pawcare.hub.entity.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPetId(Long petId);
    
    List<Appointment> findByStatus(AppointmentStatus status);
    
    List<Appointment> findByVeterinarianId(Long veterinarianId);
    
    List<Appointment> findByDate(LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.date BETWEEN :start AND :end")
    List<Appointment> findByDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
    
    @Query("SELECT a FROM Appointment a WHERE a.date >= :date ORDER BY a.date ASC, a.time ASC")
    List<Appointment> findUpcomingAppointments(@Param("date") LocalDate date);
}