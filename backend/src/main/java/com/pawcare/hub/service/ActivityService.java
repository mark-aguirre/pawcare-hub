package com.pawcare.hub.service;

import com.pawcare.hub.entity.Activity;
import com.pawcare.hub.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityService {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    public Activity logActivity(String action, String entityType, Long entityId, String entityName, String description) {
        Activity activity = new Activity(action, entityType, entityId, entityName, description);
        return activityRepository.save(activity);
    }
    
    public Activity logActivity(String action, String entityType, Long entityId, String entityName, String description, String userId, String userName) {
        Activity activity = new Activity(action, entityType, entityId, entityName, description);
        activity.setUserId(userId);
        activity.setUserName(userName);
        return activityRepository.save(activity);
    }
    
    public List<Activity> getRecentActivities(int limit) {
        return activityRepository.findAllOrderByTimestampDesc(PageRequest.of(0, limit));
    }
    
    public List<Activity> getRecentActivities(LocalDateTime since, int limit) {
        return activityRepository.findRecentActivities(since, PageRequest.of(0, limit));
    }
    
    public List<Activity> getActivitiesForEntity(String entityType, Long entityId) {
        return activityRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId);
    }
    
    public List<Activity> getActivitiesForUser(String userId) {
        return activityRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}