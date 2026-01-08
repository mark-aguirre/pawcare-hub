package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Activity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    List<Activity> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Long entityId);
    
    List<Activity> findByUserIdOrderByTimestampDesc(String userId);
    
    @Query("SELECT a FROM Activity a WHERE a.timestamp >= :since ORDER BY a.timestamp DESC")
    List<Activity> findRecentActivities(@Param("since") LocalDateTime since, Pageable pageable);
    
    @Query("SELECT a FROM Activity a ORDER BY a.timestamp DESC")
    List<Activity> findAllOrderByTimestampDesc(Pageable pageable);
}