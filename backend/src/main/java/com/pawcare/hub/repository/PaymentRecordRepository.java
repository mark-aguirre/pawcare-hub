package com.pawcare.hub.repository;

import com.pawcare.hub.entity.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
    
    List<PaymentRecord> findByInvoiceId(Long invoiceId);
    
    @Query("SELECT p FROM PaymentRecord p WHERE p.paidDate BETWEEN :startDate AND :endDate")
    List<PaymentRecord> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM PaymentRecord p WHERE p.method = :method")
    List<PaymentRecord> findByPaymentMethod(@Param("method") PaymentRecord.PaymentMethod method);
    
    @Query("SELECT p FROM PaymentRecord p ORDER BY p.paidDate DESC")
    List<PaymentRecord> findAllOrderByPaidDateDesc();
}