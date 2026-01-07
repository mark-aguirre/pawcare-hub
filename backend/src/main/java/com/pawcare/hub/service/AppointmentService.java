package com.pawcare.hub.service;

import com.pawcare.hub.entity.Appointment;
import com.pawcare.hub.entity.Pet;
import com.pawcare.hub.entity.Veterinarian;
import com.pawcare.hub.entity.Appointment.AppointmentStatus;
import com.pawcare.hub.dto.CreateAppointmentRequest;
import com.pawcare.hub.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private PetService petService;
    
    @Autowired
    private VeterinarianService veterinarianService;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment saveAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> getAppointmentsByPet(Long petId) {
        return appointmentRepository.findByPetId(petId);
    }

    public List<Appointment> getAppointmentsByOwner(Long ownerId) {
        return appointmentRepository.findByPetOwnerId(ownerId);
    }

    public List<Appointment> getUpcomingAppointments() {
        return appointmentRepository.findUpcomingAppointments(LocalDate.now());
    }

    public List<Appointment> getAppointmentsByDateRange(LocalDate start, LocalDate end) {
        return appointmentRepository.findByDateBetween(start, end);
    }

    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByDate(date);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            appointment.get().setStatus(status);
            return appointmentRepository.save(appointment.get());
        }
        return null;
    }
    
    public Appointment createAppointment(CreateAppointmentRequest request) {
        Appointment appointment = new Appointment();
        appointment.setDate(request.getDate());
        appointment.setTime(LocalTime.parse(request.getTime()));
        appointment.setDuration(request.getDuration());
        appointment.setType(Appointment.AppointmentType.valueOf(request.getType().toUpperCase()));
        appointment.setStatus(AppointmentStatus.valueOf(request.getStatus().toUpperCase()));
        appointment.setNotes(request.getNotes());
        
        // Set pet and veterinarian
        Pet pet = petService.getPetById(request.getPetId()).orElse(null);
        Veterinarian veterinarian = veterinarianService.getVeterinarianById(request.getVeterinarianId()).orElse(null);
        
        appointment.setPet(pet);
        appointment.setVeterinarian(veterinarian);
        
        return appointmentRepository.save(appointment);
    }
}