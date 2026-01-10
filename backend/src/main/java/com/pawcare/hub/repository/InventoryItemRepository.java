package com.pawcare.hub.repository;

import com.pawcare.hub.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    
    List<InventoryItem> findByCategory(InventoryItem.ItemCategory category);
    List<InventoryItem> findByCategoryAndClinicCode(InventoryItem.ItemCategory category, String clinicCode);
    
    List<InventoryItem> findByStatus(InventoryItem.StockStatus status);
    List<InventoryItem> findByStatusAndClinicCode(InventoryItem.StockStatus status, String clinicCode);
    
    List<InventoryItem> findByNameContainingIgnoreCase(String name);
    List<InventoryItem> findByNameContainingIgnoreCaseAndClinicCode(String name, String clinicCode);
    
    List<InventoryItem> findByClinicCode(String clinicCode);
    
    @Query("SELECT i FROM InventoryItem i WHERE i.currentStock <= i.minStock")
    List<InventoryItem> findLowStockItems();
    
    @Query("SELECT i FROM InventoryItem i WHERE i.currentStock <= i.minStock AND i.clinicCode = :clinicCode")
    List<InventoryItem> findLowStockItemsByClinicCode(@Param("clinicCode") String clinicCode);
    
    @Query("SELECT i FROM InventoryItem i WHERE i.expiryDate <= :date")
    List<InventoryItem> findExpiringItems(@Param("date") LocalDate date);
    
    @Query("SELECT i FROM InventoryItem i WHERE i.expiryDate <= :date AND i.clinicCode = :clinicCode")
    List<InventoryItem> findExpiringItemsByClinicCode(@Param("date") LocalDate date, @Param("clinicCode") String clinicCode);
    
    InventoryItem findBySku(String sku);
    InventoryItem findBySkuAndClinicCode(String sku, String clinicCode);
}