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

    public List<InventoryItem> getAllInventoryItems() {
        return inventoryItemRepository.findAll();
    }

    public Optional<InventoryItem> getInventoryItemById(Long id) {
        return inventoryItemRepository.findById(id);
    }

    public InventoryItem saveInventoryItem(InventoryItem item) {
        return inventoryItemRepository.save(item);
    }

    public void deleteInventoryItem(Long id) {
        inventoryItemRepository.deleteById(id);
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
            return inventoryItemRepository.save(item);
        }
        return null;
    }
}