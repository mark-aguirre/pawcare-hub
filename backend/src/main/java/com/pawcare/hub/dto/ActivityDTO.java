package com.pawcare.hub.dto;

import com.pawcare.hub.entity.Activity;
import java.time.LocalDateTime;

public class ActivityDTO {
    private Long id;
    private String action;
    private String entityType;
    private Long entityId;
    private String entityName;
    private String description;
    private String userId;
    private String userName;
    private LocalDateTime timestamp;
    private String metadata;
    
    public ActivityDTO() {}
    
    public ActivityDTO(Activity activity) {
        this.id = activity.getId();
        this.action = activity.getAction();
        this.entityType = activity.getEntityType();
        this.entityId = activity.getEntityId();
        this.entityName = activity.getEntityName();
        this.description = activity.getDescription();
        this.userId = activity.getUserId();
        this.userName = activity.getUserName();
        this.timestamp = activity.getTimestamp();
        this.metadata = activity.getMetadata();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}