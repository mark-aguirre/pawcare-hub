package com.pawcare.hub.repository;

import com.pawcare.hub.entity.Owner;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepository extends BaseClinicRepository<Owner, Long> {
    
    Optional<Owner> findByEmailAndClinicCode(String email, String clinicCode);
    
    Optional<Owner> findByPidAndClinicCode(String pid, String clinicCode);
    
    Optional<Owner> findByPhoneAndClinicCode(String phone, String clinicCode);
    
    @Query("SELECT o FROM Owner o WHERE (o.firstName LIKE %:name% OR o.lastName LIKE %:name%) AND o.clinicCode = :clinicCode")
    List<Owner> findByNameContainingAndClinicCode(@Param("name") String name, @Param("clinicCode") String clinicCode);
}