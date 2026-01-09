package com.pawcare.hub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_records")
public class PaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    @NotNull
    private Invoice invoice;

    @Column(name = "amount")
    @NotNull
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    @NotNull
    private PaymentMethod method;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "paid_date")
    @NotNull
    private LocalDateTime paidDate;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum PaymentMethod {
        CASH, CARD, CHECK, INSURANCE, ONLINE
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (paidDate == null) {
            paidDate = LocalDateTime.now();
        }
    }

    // Constructors
    public PaymentRecord() {}

    public PaymentRecord(Invoice invoice, BigDecimal amount, PaymentMethod method) {
        this.invoice = invoice;
        this.amount = amount;
        this.method = method;
        this.paidDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDateTime paidDate) { this.paidDate = paidDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}