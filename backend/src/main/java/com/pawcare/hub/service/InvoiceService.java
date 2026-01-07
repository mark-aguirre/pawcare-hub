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

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    public Invoice saveInvoice(Invoice invoice) {
        // Calculate totals before saving
        calculateInvoiceTotals(invoice);
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
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