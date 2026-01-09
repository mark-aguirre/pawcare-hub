package com.pawcare.hub.controller;

import com.pawcare.hub.entity.PaymentRecord;
import com.pawcare.hub.service.PaymentRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentRecordController {

    @Autowired
    private PaymentRecordService paymentRecordService;

    @GetMapping
    public List<PaymentRecord> getAllPaymentRecords() {
        return paymentRecordService.getAllPaymentRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentRecord> getPaymentRecordById(@PathVariable Long id) {
        Optional<PaymentRecord> paymentRecord = paymentRecordService.getPaymentRecordById(id);
        return paymentRecord.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/invoice/{invoiceId}")
    public List<PaymentRecord> getPaymentRecordsByInvoice(@PathVariable Long invoiceId) {
        return paymentRecordService.getPaymentRecordsByInvoice(invoiceId);
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentRecord> processPayment(@RequestBody PaymentRequest request) {
        try {
            PaymentRecord paymentRecord = paymentRecordService.processPayment(
                request.getInvoiceId(),
                request.getAmount(),
                request.getMethod(),
                request.getTransactionId(),
                request.getNotes()
            );
            return ResponseEntity.ok(paymentRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/date-range")
    public List<PaymentRecord> getPaymentRecordsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return paymentRecordService.getPaymentRecordsByDateRange(startDate, endDate);
    }

    @GetMapping("/method/{method}")
    public List<PaymentRecord> getPaymentRecordsByMethod(@PathVariable PaymentRecord.PaymentMethod method) {
        return paymentRecordService.getPaymentRecordsByMethod(method);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentRecord(@PathVariable Long id) {
        if (paymentRecordService.getPaymentRecordById(id).isPresent()) {
            paymentRecordService.deletePaymentRecord(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Inner class for payment request
    public static class PaymentRequest {
        private Long invoiceId;
        private BigDecimal amount;
        private PaymentRecord.PaymentMethod method;
        private String transactionId;
        private String notes;

        // Getters and Setters
        public Long getInvoiceId() { return invoiceId; }
        public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public PaymentRecord.PaymentMethod getMethod() { return method; }
        public void setMethod(PaymentRecord.PaymentMethod method) { this.method = method; }

        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}