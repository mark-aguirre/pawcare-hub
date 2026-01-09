package com.pawcare.hub.config;

import com.pawcare.hub.entity.*;
import com.pawcare.hub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VeterinarianRepository veterinarianRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample data if database is empty
        if (ownerRepository.count() == 0) {
            initializeSampleData();
        }
    }
    
    private void initializeSampleData() {
        // Create sample owners
        Owner owner1 = new Owner();
        owner1.setFirstName("John");
        owner1.setLastName("Smith");
        owner1.setEmail("john.smith@email.com");
        owner1.setPhone("555-0101");
        owner1.setAddress("123 Main St");
        owner1 = ownerRepository.save(owner1);

        Owner owner2 = new Owner();
        owner2.setFirstName("Jane");
        owner2.setLastName("Doe");
        owner2.setEmail("jane.doe@email.com");
        owner2.setPhone("555-0102");
        owner2.setAddress("456 Oak Ave");
        owner2 = ownerRepository.save(owner2);

        // Create sample pets
        Pet pet1 = new Pet();
        pet1.setName("Buddy");
        pet1.setSpecies("Dog");
        pet1.setBreed("Golden Retriever");
        pet1.setOwner(owner1);
        pet1 = petRepository.save(pet1);

        Pet pet2 = new Pet();
        pet2.setName("Whiskers");
        pet2.setSpecies("Cat");
        pet2.setBreed("Persian");
        pet2.setOwner(owner2);
        pet2 = petRepository.save(pet2);

        // Create sample veterinarian
        Veterinarian vet1 = new Veterinarian();
        vet1.setFirstName("Dr. Sarah");
        vet1.setLastName("Johnson");
        vet1.setEmail("dr.johnson@pawcare.com");
        vet1.setPhone("555-0201");
        vet1.setSpecialization("General Practice");
        vet1 = veterinarianRepository.save(vet1);

        // Create sample appointments
        Appointment apt1 = new Appointment();
        apt1.setPet(pet1);
        apt1.setVeterinarian(vet1);
        apt1.setDate(LocalDate.now().plusDays(1));
        apt1.setTime(LocalTime.of(10, 0));
        apt1.setType(Appointment.AppointmentType.CHECKUP);
        apt1.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        apt1.setNotes("Regular checkup");
        appointmentRepository.save(apt1);

        Appointment apt2 = new Appointment();
        apt2.setPet(pet2);
        apt2.setVeterinarian(vet1);
        apt2.setDate(LocalDate.now().plusDays(2));
        apt2.setTime(LocalTime.of(14, 30));
        apt2.setType(Appointment.AppointmentType.VACCINATION);
        apt2.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        apt2.setNotes("Annual vaccination");
        appointmentRepository.save(apt2);

        // Create sample inventory items
        InventoryItem item1 = new InventoryItem();
        item1.setName("Antibiotics");
        item1.setCategory(InventoryItem.ItemCategory.MEDICATION);
        item1.setSku("MED-001");
        item1.setCurrentStock(5);
        item1.setMinStock(10);
        item1.setUnitPrice(new BigDecimal("25.00"));
        inventoryItemRepository.save(item1);

        InventoryItem item2 = new InventoryItem();
        item2.setName("Bandages");
        item2.setCategory(InventoryItem.ItemCategory.SUPPLIES);
        item2.setSku("SUP-001");
        item2.setCurrentStock(2);
        item2.setMinStock(15);
        item2.setUnitPrice(new BigDecimal("5.00"));
        inventoryItemRepository.save(item2);

        // Create sample invoice
        Invoice invoice1 = new Invoice();
        invoice1.setInvoiceNumber("INV-001");
        invoice1.setPet(pet1);
        invoice1.setOwner(owner1);
        invoice1.setIssueDate(LocalDate.now());
        invoice1.setTotal(new BigDecimal("150.00"));
        invoice1.setStatus(Invoice.InvoiceStatus.PAID);
        invoice1.setPaidDate(LocalDate.now());
        invoiceRepository.save(invoice1);
    }
}