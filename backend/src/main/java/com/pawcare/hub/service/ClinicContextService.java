package com.pawcare.hub.service;

import org.springframework.stereotype.Service;

@Service
public class ClinicContextService {
    private static final ThreadLocal<String> clinicCodeContext = new ThreadLocal<>();
    
    public void setClinicCode(String clinicCode) {
        clinicCodeContext.set(clinicCode);
    }
    
    public String getClinicCode() {
        return clinicCodeContext.get();
    }
    
    public void clear() {
        clinicCodeContext.remove();
    }
}