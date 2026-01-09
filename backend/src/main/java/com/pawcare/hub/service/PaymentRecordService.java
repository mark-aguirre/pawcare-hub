package com.pawcare.hub.service;

import com.pawcare.hub.entity.Invoice;
import com.pawcare.hub.entity.PaymentRecord;
import com.pawcare.hub.repository.PaymentRecordRepository;
import com.pawcare.hub.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentRecordService {

    @Autowired
    private PaymentRecordRepository paymentRecordRepository;
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private ActivityService activityService;

    public List<PaymentRecord> getAllPaymentRecords() {
        return paymentRecordRepository.findAllOrderByPaidDateDesc();
    }

    public Optional<PaymentRecord> getPaymentRecordById(Long id) {
        return paymentRecordRepository.findById(id);
    }

    public List<PaymentRecord> getPaymentRecordsByInvoice(Long invoiceId) {
        return paymentRecordRepository.findByInvoiceId(invoiceId);
    }

    @Transactional
    public PaymentRecord processPayment(Long invoiceId, BigDecimal amount, PaymentRecord.PaymentMethod method, String transactionId, String notes) {
        Optional<Invoice> invoiceOpt = invoiceRepository.findById(invoiceId);
        if (invoiceOpt.isEmpty()) {
            throw new RuntimeException("Invoice not found");
        }
        
        Invoice invoice = invoiceOpt.get();
        
        // Create payment record
        PaymentRecord paymentRecord = new PaymentRecord();
        paymentRecord.setInvoice(invoice);
        paymentRecord.setAmount(amount);
        paymentRecord.setMethod(method);
        paymentRecord.setTransactionId(transactionId);
        paymentRecord.setNotes(notes);
        paymentRecord.setPaidDate(LocalDateTime.now());
        
        PaymentRecord savedPayment = paymentRecordRepository.save(paymentRecord);
        
        // Calculate total payments for this invoice
        List<PaymentRecord> allPayments = paymentRecordRepository.findByInvoiceId(invoiceId);
        BigDecimal totalPaid = allPayments.stream()
            .map(PaymentRecord::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Update invoice status if fully paid
        if (totalPaid.compareTo(invoice.getTotal()) >= 0) {
            invoice.setStatus(Invoice.InvoiceStatus.PAID);
            invoice.setPaidDate(savedPayment.getPaidDate().toLocalDate());
            invoice.setPaymentMethod(Invoice.PaymentMethod.valueOf(method.name()));
            invoiceRepository.save(invoice);
        }
        
        // Log activity
        String petName = invoice.getPet() != null ? invoice.getPet().getName() : "Unknown Pet";
        activityService.logActivity("PAYMENT", "INVOICE", invoiceId, 
            "Payment processed for " + petName, 
            "Payment of $" + amount + " processed via " + method);
        
        return savedPayment;
    }

    public List<PaymentRecord> getPaymentRecordsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRecordRepository.findByDateRange(startDate, endDate);
    }

    public List<PaymentRecord> getPaymentRecordsByMethod(PaymentRecord.PaymentMethod method) {
        return paymentRecordRepository.findByPaymentMethod(method);
    }

    public void deletePaymentRecord(Long id) {
        Optional<PaymentRecord> paymentRecord = paymentRecordRepository.findById(id);
        if (paymentRecord.isPresent()) {
            PaymentRecord payment = paymentRecord.get();
            Invoice invoice = payment.getInvoice();
            
            paymentRecordRepository.deleteById(id);
            
            // Recalculate invoice status
            List<PaymentRecord> remainingPayments = paymentRecordRepository.findByInvoiceId(invoice.getId());
            BigDecimal totalPaid = remainingPayments.stream()
                .map(PaymentRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            if (totalPaid.compareTo(invoice.getTotal()) < 0) {
                invoice.setStatus(Invoice.InvoiceStatus.SENT);
                invoice.setPaidDate(null);
                invoiceRepository.save(invoice);
            }
            
            // Log activity
            String petName = invoice.getPet() != null ? invoice.getPet().getName() : "Unknown Pet";
            activityService.logActivity("DELETE", "PAYMENT", id, 
                "Payment deleted for " + petName, "Payment record deleted");
        }
    }
}