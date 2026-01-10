package com.pawcare.hub.config;

import com.pawcare.hub.service.ClinicContextService;
import com.pawcare.hub.service.SettingsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class ClinicCodeInterceptor implements HandlerInterceptor {

    @Autowired
    private ClinicContextService clinicContextService;
    
    @Autowired
    private SettingsService settingsService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String clinicCode = request.getHeader("X-Clinic-Code");
        
        if (clinicCode == null || clinicCode.isEmpty()) {
            // Fallback to default clinic code from settings
            clinicCode = settingsService.getClinicSettings().getClinicCode();
        }
        
        clinicContextService.setClinicCode(clinicCode);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        clinicContextService.clear();
    }
}