package com.pawcare.hub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseClinicRepository<T, ID> extends JpaRepository<T, ID> {
    List<T> findByClinicCode(String clinicCode);
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.id = ?1 AND e.clinicCode = ?2")
    Optional<T> findByIdAndClinicCode(ID id, String clinicCode);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM #{#entityName} e WHERE e.id = ?1 AND e.clinicCode = ?2")
    void deleteByIdAndClinicCode(ID id, String clinicCode);
}