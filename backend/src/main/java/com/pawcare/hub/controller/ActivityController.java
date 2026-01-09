package com.pawcare.hub.controller;

import com.pawcare.hub.dto.ActivityDTO;
import com.pawcare.hub.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    
    @Autowired
    private ActivityService activityService;
    
    @GetMapping("/recent")
    public List<ActivityDTO> getRecentActivities(@RequestParam(defaultValue = "10") int limit) {
        return activityService.getRecentActivities(limit).stream()
                .map(ActivityDTO::new)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/recent/since")
    public List<ActivityDTO> getRecentActivitiesSince(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since,
            @RequestParam(defaultValue = "10") int limit) {
        return activityService.getRecentActivities(since, limit).stream()
                .map(ActivityDTO::new)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/entity/{entityType}/{entityId}")
    public List<ActivityDTO> getActivitiesForEntity(@PathVariable String entityType, @PathVariable Long entityId) {
        return activityService.getActivitiesForEntity(entityType, entityId).stream()
                .map(ActivityDTO::new)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/user/{userId}")
    public List<ActivityDTO> getActivitiesForUser(@PathVariable String userId) {
        return activityService.getActivitiesForUser(userId).stream()
                .map(ActivityDTO::new)
                .collect(Collectors.toList());
    }
}