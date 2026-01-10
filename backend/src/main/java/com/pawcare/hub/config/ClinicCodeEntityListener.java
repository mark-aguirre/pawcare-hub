package com.pawcare.hub.config;

import com.pawcare.hub.service.ClinicContextService;
import jakarta.persistence.PrePersist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.lang.reflect.Field;

@Component
public class ClinicCodeEntityListener {

    private static ClinicContextService clinicContextService;

    @Autowired
    public void setClinicContextService(ClinicContextService clinicContextService) {
        ClinicCodeEntityListener.clinicContextService = clinicContextService;
    }

    @PrePersist
    public void setClinicCode(Object entity) {
        if (clinicContextService != null) {
            String clinicCode = clinicContextService.getClinicCode();
            if (clinicCode != null) {
                try {
                    Field clinicCodeField = entity.getClass().getDeclaredField("clinicCode");
                    clinicCodeField.setAccessible(true);
                    if (clinicCodeField.get(entity) == null) {
                        clinicCodeField.set(entity, clinicCode);
                    }
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    // Entity doesn't have clinicCode field, ignore
                }
            }
        }
    }
}