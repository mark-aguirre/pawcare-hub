package com.pawcare.hub.repository;

import com.pawcare.hub.entity.UserPermissions;
import com.pawcare.hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserPermissionsRepository extends JpaRepository<UserPermissions, Long> {
    Optional<UserPermissions> findByUser(User user);
    Optional<UserPermissions> findByUserId(Long userId);
}