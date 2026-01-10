package com.pawcare.hub.repository;

import com.pawcare.hub.entity.User;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends BaseClinicRepository<User, Long> {
    List<User> findByIsActiveTrueAndClinicCode(String clinicCode);
    Optional<User> findByEmailAndClinicCode(String email, String clinicCode);
    Optional<User> findByEmail(String email);
    List<User> findByRoleAndClinicCode(User.UserRole role, String clinicCode);
}