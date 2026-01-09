package com.pawcare.hub.service;

import com.pawcare.hub.entity.Invoice;
import com.pawcare.hub.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private ActivityService activityService;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    public Invoice saveInvoice(Invoice invoice) {
        // Set up bidirectional relationship for items
        if (invoice.getItems() != null) {
            invoice.getItems().forEach(item -> item.setInvoice(invoice));
        }
        
        // Calculate totals before saving
        calculateInvoiceTotals(invoice);
        boolean isNew = invoice.getId() == null;
        Invoice saved = invoiceRepository.save(invoice);
        String action = isNew ? "CREATE" : "UPDATE";
        String petName = saved.getPet() != null ? saved.getPet().getName() : "Unknown Pet";
        String description = isNew ? "Invoice created" : "Invoice updated";
        activityService.logActivity(action, "INVOICE", saved.getId(), 
            "Invoice for " + petName, description);
        return saved;
    }

    public void deleteInvoice(Long id) {
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        if (invoice.isPresent()) {
            String petName = invoice.get().getPet() != null ? invoice.get().getPet().getName() : "Unknown Pet";
            invoiceRepository.deleteById(id);
            activityService.logActivity("DELETE", "INVOICE", id, 
                "Invoice for " + petName, "Invoice deleted");
        }
    }

    public List<Invoice> getInvoicesByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }

    public List<Invoice> getInvoicesByOwner(Long ownerId) {
        return invoiceRepository.findByOwnerId(ownerId);
    }

    public List<Invoice> getInvoicesByPet(Long petId) {
        return invoiceRepository.findByPetId(petId);
    }

    public List<Invoice> getInvoicesByDateRange(LocalDate startDate, LocalDate endDate) {
        return invoiceRepository.findByDateRange(startDate, endDate);
    }

    public List<Invoice> getOverdueInvoices() {
        return invoiceRepository.findOverdueInvoices(LocalDate.now());
    }

    public Invoice getInvoiceByNumber(String invoiceNumber) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber);
    }

    private void calculateInvoiceTotals(Invoice invoice) {
        if (invoice.getItems() != null && !invoice.getItems().isEmpty()) {
            BigDecimal subtotal = invoice.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            invoice.setSubtotal(subtotal);
            
            BigDecimal tax = invoice.getTax() != null ? invoice.getTax() : BigDecimal.ZERO;
            BigDecimal discount = invoice.getDiscount() != null ? invoice.getDiscount() : BigDecimal.ZERO;
            
            BigDecimal total = subtotal.add(tax).subtract(discount);
            invoice.setTotal(total);
        }
    }
}