package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    
    Optional<Owner> findByEmail(String email);
    
    @Query("SELECT o FROM Owner o WHERE o.firstName LIKE %:name% OR o.lastName LIKE %:name%")
    List<Owner> findByNameContaining(@Param("name") String name);
    
    List<Owner> findByPhone(String phone);
}