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
    
    List<InventoryItem> findByStatus(InventoryItem.StockStatus status);
    
    List<InventoryItem> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT i FROM InventoryItem i WHERE i.currentStock <= i.minStock")
    List<InventoryItem> findLowStockItems();
    
    @Query("SELECT i FROM InventoryItem i WHERE i.expiryDate <= :date")
    List<InventoryItem> findExpiringItems(@Param("date") LocalDate date);
    
    InventoryItem findBySku(String sku);
}