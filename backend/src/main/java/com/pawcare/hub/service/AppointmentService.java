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
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private ClinicContextService clinicContextService;

    public List<Appointment> getAllAppointments() {
        String clinicCode = clinicContextService.getClinicCode();
        return appointmentRepository.findByClinicCode(clinicCode);
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        String clinicCode = clinicContextService.getClinicCode();
        return appointmentRepository.findByIdAndClinicCode(id, clinicCode);
    }

    public Appointment saveAppointment(Appointment appointment) {
        String clinicCode = clinicContextService.getClinicCode();
        appointment.setClinicCode(clinicCode);
        
        Appointment saved = appointmentRepository.save(appointment);
        String petName = saved.getPet() != null ? saved.getPet().getName() : "Unknown Pet";
        activityService.logActivity("UPDATE", "APPOINTMENT", saved.getId(), 
            "Appointment for " + petName, "Appointment updated");
        return saved;
    }

    public void deleteAppointment(Long id) {
        String clinicCode = clinicContextService.getClinicCode();
        Optional<Appointment> appointment = appointmentRepository.findByIdAndClinicCode(id, clinicCode);
        if (appointment.isPresent()) {
            String petName = appointment.get().getPet() != null ? appointment.get().getPet().getName() : "Unknown Pet";
            appointmentRepository.deleteByIdAndClinicCode(id, clinicCode);
            activityService.logActivity("DELETE", "APPOINTMENT", id, 
                "Appointment for " + petName, "Appointment cancelled");
        }
    }

    public List<Appointment> getAppointmentsByPet(Long petId) {
        String clinicCode = clinicContextService.getClinicCode();
        return appointmentRepository.findByPetIdAndClinicCode(petId, clinicCode);
    }

    public List<Appointment> getAppointmentsByOwner(Long ownerId) {
        String clinicCode = clinicContextService.getClinicCode();
        return appointmentRepository.findByPetOwnerIdAndClinicCode(ownerId, clinicCode);
    }

    public List<Appointment> getUpcomingAppointments() {
        String clinicCode = clinicContextService.getClinicCode();
        return appointmentRepository.findUpcomingAppointmentsByClinicCode(LocalDate.now(), clinicCode);
    }

    public List<Appointment> getAppointmentsByDateRange(LocalDate start, LocalDate end) {
        String clinicCode = clinicContextService.getClinicCode();
        return appointmentRepository.findByDateBetweenAndClinicCode(start, end, clinicCode);
    }

    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        String clinicCode = clinicContextService.getClinicCode();
        return appointmentRepository.findByDateAndClinicCode(date, clinicCode);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        String clinicCode = clinicContextService.getClinicCode();
        Optional<Appointment> appointment = appointmentRepository.findByIdAndClinicCode(id, clinicCode);
        if (appointment.isPresent()) {
            appointment.get().setStatus(status);
            Appointment saved = appointmentRepository.save(appointment.get());
            String petName = saved.getPet() != null ? saved.getPet().getName() : "Unknown Pet";
            activityService.logActivity("STATUS_UPDATE", "APPOINTMENT", saved.getId(), 
                "Appointment for " + petName, "Status changed to " + status.toString().toLowerCase());
            return saved;
        }
        return null;
    }
    
    public Appointment createAppointment(CreateAppointmentRequest request) {
        String clinicCode = clinicContextService.getClinicCode();
        
        Appointment appointment = new Appointment();
        appointment.setDate(request.getDate());
        appointment.setTime(LocalTime.parse(request.getTime()));
        appointment.setDuration(request.getDuration());
        appointment.setType(Appointment.AppointmentType.valueOf(request.getType().toUpperCase()));
        appointment.setStatus(AppointmentStatus.valueOf(request.getStatus().toUpperCase()));
        appointment.setNotes(request.getNotes());
        appointment.setClinicCode(clinicCode);
        
        // Set pet and veterinarian
        Pet pet = petService.getPetById(request.getPetId()).orElse(null);
        Veterinarian veterinarian = veterinarianService.getVeterinarianById(request.getVeterinarianId()).orElse(null);
        
        appointment.setPet(pet);
        appointment.setVeterinarian(veterinarian);
        
        Appointment saved = appointmentRepository.save(appointment);
        String petName = pet != null ? pet.getName() : "Unknown Pet";
        activityService.logActivity("CREATE", "APPOINTMENT", saved.getId(), 
            "Appointment for " + petName, "New appointment scheduled");
        return saved;
    }
}