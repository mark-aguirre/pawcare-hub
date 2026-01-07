package com.pawcare.hub.controller;

import com.pawcare.hub.entity.InventoryItem;
import com.pawcare.hub.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public List<InventoryItem> getAllInventoryItems() {
        return inventoryService.getAllInventoryItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getInventoryItemById(@PathVariable Long id) {
        Optional<InventoryItem> item = inventoryService.getInventoryItemById(id);
        return item.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public InventoryItem createInventoryItem(@RequestBody InventoryItem item) {
        return inventoryService.saveInventoryItem(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateInventoryItem(@PathVariable Long id, @RequestBody InventoryItem itemDetails) {
        Optional<InventoryItem> item = inventoryService.getInventoryItemById(id);
        if (item.isPresent()) {
            InventoryItem existingItem = item.get();
            existingItem.setName(itemDetails.getName());
            existingItem.setCategory(itemDetails.getCategory());
            existingItem.setDescription(itemDetails.getDescription());
            existingItem.setCurrentStock(itemDetails.getCurrentStock());
            existingItem.setMinStock(itemDetails.getMinStock());
            existingItem.setMaxStock(itemDetails.getMaxStock());
            existingItem.setUnitPrice(itemDetails.getUnitPrice());
            existingItem.setSupplier(itemDetails.getSupplier());
            existingItem.setLocation(itemDetails.getLocation());
            existingItem.setExpiryDate(itemDetails.getExpiryDate());
            existingItem.setBatchNumber(itemDetails.getBatchNumber());
            existingItem.setNotes(itemDetails.getNotes());
            return ResponseEntity.ok(inventoryService.saveInventoryItem(existingItem));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable Long id) {
        if (inventoryService.getInventoryItemById(id).isPresent()) {
            inventoryService.deleteInventoryItem(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/category/{category}")
    public List<InventoryItem> getInventoryItemsByCategory(@PathVariable InventoryItem.ItemCategory category) {
        return inventoryService.getInventoryItemsByCategory(category);
    }

    @GetMapping("/status/{status}")
    public List<InventoryItem> getInventoryItemsByStatus(@PathVariable InventoryItem.StockStatus status) {
        return inventoryService.getInventoryItemsByStatus(status);
    }

    @GetMapping("/search")
    public List<InventoryItem> searchInventoryItems(@RequestParam String name) {
        return inventoryService.searchInventoryItems(name);
    }

    @GetMapping("/low-stock")
    public List<InventoryItem> getLowStockItems() {
        return inventoryService.getLowStockItems();
    }

    @GetMapping("/expiring")
    public List<InventoryItem> getExpiringItems(@RequestParam(defaultValue = "30") int daysAhead) {
        return inventoryService.getExpiringItems(daysAhead);
    }

    @PostMapping("/{id}/adjust-stock")
    public ResponseEntity<InventoryItem> adjustStock(@PathVariable Long id, @RequestParam int quantity, @RequestParam String reason) {
        InventoryItem item = inventoryService.adjustStock(id, quantity, reason);
        if (item != null) {
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }
}