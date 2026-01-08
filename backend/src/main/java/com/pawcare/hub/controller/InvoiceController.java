package com.pawcare.hub.controller;

import com.pawcare.hub.entity.Invoice;
import com.pawcare.hub.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:3000")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public List<Invoice> getAllInvoices(@RequestParam(required = false) Long ownerId) {
        if (ownerId != null) {
            return invoiceService.getInvoicesByOwner(ownerId);
        }
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        Optional<Invoice> invoice = invoiceService.getInvoiceById(id);
        return invoice.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.saveInvoice(invoice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoiceDetails) {
        Optional<Invoice> invoice = invoiceService.getInvoiceById(id);
        if (invoice.isPresent()) {
            Invoice existingInvoice = invoice.get();
            existingInvoice.setStatus(invoiceDetails.getStatus());
            existingInvoice.setPaymentMethod(invoiceDetails.getPaymentMethod());
            existingInvoice.setPaidDate(invoiceDetails.getPaidDate());
            existingInvoice.setNotes(invoiceDetails.getNotes());
            return ResponseEntity.ok(invoiceService.saveInvoice(existingInvoice));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        if (invoiceService.getInvoiceById(id).isPresent()) {
            invoiceService.deleteInvoice(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public List<Invoice> getInvoicesByStatus(@PathVariable Invoice.InvoiceStatus status) {
        return invoiceService.getInvoicesByStatus(status);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Invoice> getInvoicesByOwner(@PathVariable Long ownerId) {
        return invoiceService.getInvoicesByOwner(ownerId);
    }

    @GetMapping("/pet/{petId}")
    public List<Invoice> getInvoicesByPet(@PathVariable Long petId) {
        return invoiceService.getInvoicesByPet(petId);
    }

    @GetMapping("/date-range")
    public List<Invoice> getInvoicesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return invoiceService.getInvoicesByDateRange(startDate, endDate);
    }

    @GetMapping("/overdue")
    public List<Invoice> getOverdueInvoices() {
        return invoiceService.getOverdueInvoices();
    }
}