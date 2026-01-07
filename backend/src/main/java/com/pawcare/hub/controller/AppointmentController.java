package com.pawcare.hub.controller;

import com.pawcare.hub.entity.Appointment;
import com.pawcare.hub.entity.Appointment.AppointmentStatus;
import com.pawcare.hub.dto.AppointmentDTO;
import com.pawcare.hub.dto.CreateAppointmentRequest;
import com.pawcare.hub.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<AppointmentDTO> getAllAppointments(
            @RequestParam(required = false) Boolean upcoming,
            @RequestParam(required = false) Boolean today) {
        
        if (Boolean.TRUE.equals(upcoming)) {
            return appointmentService.getUpcomingAppointments().stream()
                    .map(AppointmentDTO::new)
                    .collect(Collectors.toList());
        }
        
        if (Boolean.TRUE.equals(today)) {
            return appointmentService.getAppointmentsByDate(LocalDate.now()).stream()
                    .map(AppointmentDTO::new)
                    .collect(Collectors.toList());
        }
        
        return appointmentService.getAllAppointments().stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(apt -> ResponseEntity.ok(new AppointmentDTO(apt)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public AppointmentDTO createAppointment(@RequestBody CreateAppointmentRequest request) {
        Appointment saved = appointmentService.createAppointment(request);
        return new AppointmentDTO(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        if (appointment.isPresent()) {
            Appointment existing = appointment.get();
            existing.setDate(appointmentDetails.getDate());
            existing.setTime(appointmentDetails.getTime());
            existing.setDuration(appointmentDetails.getDuration());
            existing.setType(appointmentDetails.getType());
            existing.setNotes(appointmentDetails.getNotes());
            existing.setStatus(appointmentDetails.getStatus());
            Appointment saved = appointmentService.saveAppointment(existing);
            return ResponseEntity.ok(new AppointmentDTO(saved));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        if (appointmentService.getAppointmentById(id).isPresent()) {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pet/{petId}")
    public List<AppointmentDTO> getAppointmentsByPet(@PathVariable Long petId) {
        return appointmentService.getAppointmentsByPet(petId).stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/owner/{ownerId}")
    public List<AppointmentDTO> getAppointmentsByOwner(@PathVariable Long ownerId) {
        return appointmentService.getAppointmentsByOwner(ownerId).stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/upcoming")
    public List<AppointmentDTO> getUpcomingAppointments() {
        return appointmentService.getUpcomingAppointments().stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/today")
    public List<AppointmentDTO> getTodayAppointments() {
        return appointmentService.getAppointmentsByDate(LocalDate.now()).stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/date-range")
    public List<AppointmentDTO> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return appointmentService.getAppointmentsByDateRange(start, end).stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/test")
    public List<AppointmentDTO> getTestAppointments() {
        AppointmentDTO testAppointment = new AppointmentDTO();
        testAppointment.setId(1L);
        testAppointment.setDate(LocalDate.now());
        testAppointment.setTime(LocalTime.of(10, 0));
        testAppointment.setDuration(30);
        testAppointment.setType("CHECKUP");
        testAppointment.setStatus("SCHEDULED");
        testAppointment.setPetId(1L);
        testAppointment.setPetName("Test Pet");
        testAppointment.setPetSpecies("Dog");
        testAppointment.setOwnerId(1L);
        testAppointment.setOwnerName("Test Owner");
        testAppointment.setVeterinarianId(1L);
        testAppointment.setVeterinarianName("Dr. Test");
        testAppointment.setCreatedAt(LocalDateTime.now());
        testAppointment.setUpdatedAt(LocalDateTime.now());
        
        return List.of(testAppointment);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        Appointment updated = appointmentService.updateAppointmentStatus(id, status);
        return updated != null ? ResponseEntity.ok(new AppointmentDTO(updated)) : ResponseEntity.notFound().build();
    }
}