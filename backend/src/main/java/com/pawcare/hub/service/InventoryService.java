package com.pawcare.hub.service;

import com.pawcare.hub.entity.InventoryItem;
import com.pawcare.hub.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryItemRepository inventoryItemRepository;
    
    @Autowired
    private ActivityService activityService;

    public List<InventoryItem> getAllInventoryItems() {
        return inventoryItemRepository.findAll();
    }

    public Optional<InventoryItem> getInventoryItemById(Long id) {
        return inventoryItemRepository.findById(id);
    }

    public InventoryItem saveInventoryItem(InventoryItem item) {
        boolean isNew = item.getId() == null;
        InventoryItem saved = inventoryItemRepository.save(item);
        String action = isNew ? "CREATE" : "UPDATE";
        String description = isNew ? "Inventory item added" : "Inventory item updated";
        activityService.logActivity(action, "INVENTORY", saved.getId(), saved.getName(), description);
        return saved;
    }

    public void deleteInventoryItem(Long id) {
        Optional<InventoryItem> item = inventoryItemRepository.findById(id);
        if (item.isPresent()) {
            String itemName = item.get().getName();
            inventoryItemRepository.deleteById(id);
            activityService.logActivity("DELETE", "INVENTORY", id, itemName, "Inventory item removed");
        }
    }

    public List<InventoryItem> getInventoryItemsByCategory(InventoryItem.ItemCategory category) {
        return inventoryItemRepository.findByCategory(category);
    }

    public List<InventoryItem> getInventoryItemsByStatus(InventoryItem.StockStatus status) {
        return inventoryItemRepository.findByStatus(status);
    }

    public List<InventoryItem> searchInventoryItems(String name) {
        return inventoryItemRepository.findByNameContainingIgnoreCase(name);
    }

    public List<InventoryItem> getLowStockItems() {
        return inventoryItemRepository.findLowStockItems();
    }

    public List<InventoryItem> getExpiringItems(int daysAhead) {
        LocalDate expiryDate = LocalDate.now().plusDays(daysAhead);
        return inventoryItemRepository.findExpiringItems(expiryDate);
    }

    public InventoryItem getInventoryItemBySku(String sku) {
        return inventoryItemRepository.findBySku(sku);
    }

    public InventoryItem adjustStock(Long itemId, int quantity, String reason) {
        Optional<InventoryItem> itemOpt = inventoryItemRepository.findById(itemId);
        if (itemOpt.isPresent()) {
            InventoryItem item = itemOpt.get();
            item.setCurrentStock(item.getCurrentStock() + quantity);
            if (quantity > 0) {
                item.setLastRestocked(LocalDate.now());
            }
            InventoryItem saved = inventoryItemRepository.save(item);
            String action = quantity > 0 ? "STOCK_IN" : "STOCK_OUT";
            String description = reason != null ? reason : (quantity > 0 ? "Stock added" : "Stock removed");
            activityService.logActivity(action, "INVENTORY", saved.getId(), saved.getName(), description);
            return saved;
        }
        return null;
    }
}