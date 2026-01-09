package com.pawcare.hub.controller;

import com.pawcare.hub.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PetService petService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        long todayAppointments = appointmentService.getAllAppointments().stream()
            .filter(apt -> apt.getDate().equals(today))
            .count();
        
        long pendingPayments = invoiceService.getInvoicesByStatus(
            com.pawcare.hub.entity.Invoice.InvoiceStatus.SENT).size();
        
        long totalPets = petService.getAllPets().size();
        
        long lowStockItems = inventoryService.getLowStockItems().size();
        
        BigDecimal revenueToday = invoiceService.getAllInvoices().stream()
            .filter(invoice -> invoice.getPaidDate() != null && invoice.getPaidDate().equals(today))
            .map(invoice -> invoice.getTotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long completedToday = appointmentService.getAllAppointments().stream()
            .filter(apt -> apt.getDate().equals(today) && 
                apt.getStatus() == com.pawcare.hub.entity.Appointment.AppointmentStatus.COMPLETED)
            .count();
        
        stats.put("todayAppointments", todayAppointments);
        stats.put("pendingPayments", pendingPayments);
        stats.put("totalPets", totalPets);
        stats.put("lowStockItems", lowStockItems);
        stats.put("revenueToday", revenueToday);
        stats.put("completedToday", completedToday);
        
        return stats;
    }

    @GetMapping("/recent-activity")
    public Map<String, Object> getRecentActivity() {
        Map<String, Object> activity = new HashMap<>();
        
        LocalDate weekAgo = LocalDate.now().minusDays(7);
        
        var recentAppointments = appointmentService.getAllAppointments().stream()
            .filter(apt -> apt.getDate().isAfter(weekAgo) || apt.getDate().equals(LocalDate.now()))
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .limit(5)
            .map(apt -> {
                Map<String, Object> aptData = new HashMap<>();
                aptData.put("id", apt.getId());
                aptData.put("petName", apt.getPet().getName());
                aptData.put("ownerName", apt.getPet().getOwner().getFirstName() + " " + apt.getPet().getOwner().getLastName());
                aptData.put("date", apt.getDate().toString());
                aptData.put("time", apt.getTime().toString());
                aptData.put("type", apt.getType() != null ? apt.getType().toString() : "CHECKUP");
                aptData.put("status", apt.getStatus().toString().toLowerCase());
                aptData.put("notes", apt.getNotes());
                return aptData;
            })
            .toList();
        
        var recentInvoices = invoiceService.getAllInvoices().stream()
            .filter(inv -> inv.getIssueDate().isAfter(weekAgo) || inv.getIssueDate().equals(LocalDate.now()))
            .sorted((a, b) -> b.getIssueDate().compareTo(a.getIssueDate()))
            .limit(5)
            .map(inv -> {
                Map<String, Object> invData = new HashMap<>();
                invData.put("id", inv.getId());
                invData.put("invoiceNumber", inv.getInvoiceNumber());
                invData.put("petName", inv.getPet().getName());
                invData.put("ownerName", inv.getOwner().getFirstName() + " " + inv.getOwner().getLastName());
                invData.put("issueDate", inv.getIssueDate().toString());
                invData.put("total", inv.getTotal());
                invData.put("status", inv.getStatus().toString().toLowerCase());
                return invData;
            })
            .toList();
        
        activity.put("recentAppointments", recentAppointments);
        activity.put("recentInvoices", recentInvoices);
        
        return activity;
    }

    @GetMapping("/performance")
    public Map<String, Object> getPerformanceData() {
        Map<String, Object> performance = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate lastMonthStart = monthStart.minusMonths(1);
        LocalDate lastMonthEnd = monthStart.minusDays(1);
        
        // Calculate monthly revenue
        BigDecimal currentMonthRevenue = invoiceService.getAllInvoices().stream()
            .filter(invoice -> invoice.getPaidDate() != null && 
                !invoice.getPaidDate().isBefore(monthStart) && 
                !invoice.getPaidDate().isAfter(today))
            .map(invoice -> invoice.getTotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        BigDecimal lastMonthRevenue = invoiceService.getAllInvoices().stream()
            .filter(invoice -> invoice.getPaidDate() != null && 
                !invoice.getPaidDate().isBefore(lastMonthStart) && 
                !invoice.getPaidDate().isAfter(lastMonthEnd))
            .map(invoice -> invoice.getTotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        double revenueChange = lastMonthRevenue.compareTo(BigDecimal.ZERO) > 0 ? 
            currentMonthRevenue.subtract(lastMonthRevenue)
                .divide(lastMonthRevenue, 2, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue() : 0.0;
        
        // Calculate active clients (owners with appointments this month)
        long activeClients = appointmentService.getAllAppointments().stream()
            .filter(apt -> !apt.getDate().isBefore(monthStart) && !apt.getDate().isAfter(today))
            .map(apt -> apt.getPet().getOwner().getId())
            .distinct()
            .count();
            
        long lastMonthActiveClients = appointmentService.getAllAppointments().stream()
            .filter(apt -> !apt.getDate().isBefore(lastMonthStart) && !apt.getDate().isAfter(lastMonthEnd))
            .map(apt -> apt.getPet().getOwner().getId())
            .distinct()
            .count();
            
        double clientsChange = lastMonthActiveClients > 0 ? 
            ((double)(activeClients - lastMonthActiveClients) / lastMonthActiveClients) * 100 : 0.0;
        
        // Calculate appointment completion rate
        long totalAppointments = appointmentService.getAllAppointments().stream()
            .filter(apt -> !apt.getDate().isBefore(monthStart) && !apt.getDate().isAfter(today))
            .count();
            
        long completedAppointments = appointmentService.getAllAppointments().stream()
            .filter(apt -> !apt.getDate().isBefore(monthStart) && !apt.getDate().isAfter(today) &&
                apt.getStatus() == com.pawcare.hub.entity.Appointment.AppointmentStatus.COMPLETED)
            .count();
            
        double appointmentRate = totalAppointments > 0 ? 
            ((double)completedAppointments / totalAppointments) * 100 : 0.0;
            
        long lastMonthTotal = appointmentService.getAllAppointments().stream()
            .filter(apt -> !apt.getDate().isBefore(lastMonthStart) && !apt.getDate().isAfter(lastMonthEnd))
            .count();
            
        long lastMonthCompleted = appointmentService.getAllAppointments().stream()
            .filter(apt -> !apt.getDate().isBefore(lastMonthStart) && !apt.getDate().isAfter(lastMonthEnd) &&
                apt.getStatus() == com.pawcare.hub.entity.Appointment.AppointmentStatus.COMPLETED)
            .count();
            
        double lastMonthRate = lastMonthTotal > 0 ? 
            ((double)lastMonthCompleted / lastMonthTotal) * 100 : 0.0;
            
        double appointmentRateChange = appointmentRate - lastMonthRate;
        
        // Build response
        performance.put("patientSatisfaction", "4.8/5"); // This would need a separate rating system
        performance.put("satisfactionChange", 2.1); // Mock for now
        performance.put("activeClients", String.format("%,d", activeClients));
        performance.put("clientsChange", Math.round(clientsChange * 10.0) / 10.0);
        performance.put("appointmentRate", String.format("%.0f%%", appointmentRate));
        performance.put("appointmentRateChange", Math.round(appointmentRateChange * 10.0) / 10.0);
        performance.put("monthlyRevenue", String.format("$%,.0f", currentMonthRevenue));
        performance.put("revenueChange", Math.round(revenueChange * 10.0) / 10.0);
        
        List<String> insights = List.of(
            revenueChange > 0 ? 
                String.format("Revenue is trending %.1f%% above last month", revenueChange) :
                String.format("Revenue is %.1f%% below last month", Math.abs(revenueChange)),
            clientsChange > 0 ? "Client base growing steadily" : "Client retention needs attention"
        );
        performance.put("insights", insights);
        
        return performance;
    }

    @GetMapping("/revenue")
    public Map<String, Object> getRevenueData() {
        Map<String, Object> revenue = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6); // Last 7 days
        
        List<Map<String, Object>> weeklyData = List.of(
            Map.of("day", "Mon", "revenue", getDailyRevenue(weekStart)),
            Map.of("day", "Tue", "revenue", getDailyRevenue(weekStart.plusDays(1))),
            Map.of("day", "Wed", "revenue", getDailyRevenue(weekStart.plusDays(2))),
            Map.of("day", "Thu", "revenue", getDailyRevenue(weekStart.plusDays(3))),
            Map.of("day", "Fri", "revenue", getDailyRevenue(weekStart.plusDays(4))),
            Map.of("day", "Sat", "revenue", getDailyRevenue(weekStart.plusDays(5))),
            Map.of("day", "Sun", "revenue", getDailyRevenue(today))
        );
        
        // Calculate week-over-week change
        BigDecimal thisWeekRevenue = invoiceService.getAllInvoices().stream()
            .filter(invoice -> invoice.getPaidDate() != null && 
                !invoice.getPaidDate().isBefore(weekStart) && 
                !invoice.getPaidDate().isAfter(today))
            .map(invoice -> invoice.getTotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        BigDecimal lastWeekRevenue = invoiceService.getAllInvoices().stream()
            .filter(invoice -> invoice.getPaidDate() != null && 
                !invoice.getPaidDate().isBefore(weekStart.minusDays(7)) && 
                !invoice.getPaidDate().isAfter(weekStart.minusDays(1)))
            .map(invoice -> invoice.getTotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        double weeklyChange = lastWeekRevenue.compareTo(BigDecimal.ZERO) > 0 ? 
            thisWeekRevenue.subtract(lastWeekRevenue)
                .divide(lastWeekRevenue, 2, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue() : 0.0;
        
        revenue.put("weeklyData", weeklyData);
        revenue.put("weeklyChange", Math.round(weeklyChange * 10.0) / 10.0);
        
        return revenue;
    }
    
    @GetMapping("/upcoming-appointments")
    public List<Map<String, Object>> getUpcomingAppointments() {
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);
        
        return appointmentService.getAllAppointments().stream()
            .filter(apt -> !apt.getDate().isBefore(today) && !apt.getDate().isAfter(nextWeek))
            .filter(apt -> apt.getStatus() != com.pawcare.hub.entity.Appointment.AppointmentStatus.COMPLETED &&
                          apt.getStatus() != com.pawcare.hub.entity.Appointment.AppointmentStatus.CANCELLED)
            .sorted((a, b) -> {
                int dateCompare = a.getDate().compareTo(b.getDate());
                return dateCompare != 0 ? dateCompare : a.getTime().compareTo(b.getTime());
            })
            .limit(10)
            .map(apt -> {
                Map<String, Object> aptData = new HashMap<>();
                aptData.put("id", apt.getId());
                aptData.put("petName", apt.getPet().getName());
                aptData.put("ownerName", apt.getPet().getOwner().getFirstName() + " " + apt.getPet().getOwner().getLastName());
                aptData.put("date", apt.getDate().toString());
                aptData.put("time", apt.getTime().toString());
                aptData.put("type", apt.getType() != null ? apt.getType().toString() : "CHECKUP");
                aptData.put("status", apt.getStatus().toString().toLowerCase());
                return aptData;
            })
            .toList();
    }

    @GetMapping("/inventory-alerts")
    public List<Map<String, Object>> getInventoryAlerts() {
        return inventoryService.getLowStockItems().stream()
            .map(item -> {
                Map<String, Object> alert = new HashMap<>();
                alert.put("id", item.getId());
                alert.put("item", item.getName());
                alert.put("currentStock", item.getCurrentStock());
                alert.put("minStock", item.getMinStock());
                alert.put("status", item.getCurrentStock() <= item.getMinStock() / 2 ? "critical" : "low");
                return alert;
            })
            .toList();
    }

    @GetMapping("/recent-pets")
    public List<Map<String, Object>> getRecentPets() {
        LocalDate weekAgo = LocalDate.now().minusDays(7);
        
        return petService.getAllPets().stream()
            .filter(pet -> pet.getCreatedAt() != null && pet.getCreatedAt().toLocalDate().isAfter(weekAgo))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(10)
            .map(pet -> {
                Map<String, Object> petData = new HashMap<>();
                petData.put("id", pet.getId());
                petData.put("name", pet.getName());
                petData.put("species", pet.getSpecies());
                petData.put("breed", pet.getBreed());
                petData.put("owner", pet.getOwner().getFirstName() + " " + pet.getOwner().getLastName());
                petData.put("registrationDate", pet.getCreatedAt().toLocalDate().toString());
                return petData;
            })
            .toList();
    }
    
    private int getDailyRevenue(LocalDate date) {
        return invoiceService.getAllInvoices().stream()
            .filter(invoice -> invoice.getPaidDate() != null && invoice.getPaidDate().equals(date))
            .map(invoice -> invoice.getTotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .intValue();
    }
}