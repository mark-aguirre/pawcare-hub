'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  needsClinicSetup: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('pawcare_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('pawcare_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    console.log('Login userData:', userData);
    setUser(userData);
    localStorage.setItem('pawcare_user', JSON.stringify(userData));
    
    // Save clinic info to localStorage if user has clinic
    if (userData.clinicCode && userData.clinic) {
      const clinicData = {
        id: userData.clinic.id,
        code: userData.clinicCode,
        name: userData.clinic.name
      };
      console.log('Saving clinic data:', clinicData);
      localStorage.setItem('pawcare_clinic', JSON.stringify(clinicData));
    } else if (userData.clinicCode) {
      // If user has clinicCode but no clinic object, create minimal clinic data
      const clinicData = {
        id: userData.clinicCode,
        code: userData.clinicCode,
        name: 'Default Clinic'
      };
      console.log('Saving minimal clinic data:', clinicData);
      localStorage.setItem('pawcare_clinic', JSON.stringify(clinicData));
    } else {
      console.log('No clinic code found in user data');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pawcare_user');
    localStorage.removeItem('pawcare_clinic');
  };

  // Check if user needs clinic setup (is owner but has no clinic)
  const needsClinicSetup = user?.role === 'ADMINISTRATOR' && !user?.clinicCode;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, needsClinicSetup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};