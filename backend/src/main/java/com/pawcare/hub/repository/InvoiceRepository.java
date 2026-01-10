package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
    List<Invoice> findByStatusAndClinicCode(Invoice.InvoiceStatus status, String clinicCode);
    
    List<Invoice> findByOwnerId(Long ownerId);
    List<Invoice> findByOwnerIdAndClinicCode(Long ownerId, String clinicCode);
    
    List<Invoice> findByPetId(Long petId);
    List<Invoice> findByPetIdAndClinicCode(Long petId, String clinicCode);
    
    List<Invoice> findByClinicCode(String clinicCode);
    
    @Query("SELECT i FROM Invoice i WHERE i.issueDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT i FROM Invoice i WHERE i.issueDate BETWEEN :startDate AND :endDate AND i.clinicCode = :clinicCode")
    List<Invoice> findByDateRangeAndClinicCode(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("clinicCode") String clinicCode);
    
    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :currentDate AND i.status != 'PAID'")
    List<Invoice> findOverdueInvoices(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :currentDate AND i.status != 'PAID' AND i.clinicCode = :clinicCode")
    List<Invoice> findOverdueInvoicesByClinicCode(@Param("currentDate") LocalDate currentDate, @Param("clinicCode") String clinicCode);
    
    Invoice findByInvoiceNumber(String invoiceNumber);
    Invoice findByInvoiceNumberAndClinicCode(String invoiceNumber, String clinicCode);
}