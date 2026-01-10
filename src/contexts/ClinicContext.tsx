'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Clinic } from '@/types';

interface ClinicContextType {
  currentClinic: Clinic | null;
  setCurrentClinic: (clinic: Clinic | null) => void;
  clinicCode: string | null;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [currentClinic, setCurrentClinicState] = useState<Clinic | null>(null);

  useEffect(() => {
    const savedClinic = localStorage.getItem('pawcare_clinic');
    if (savedClinic) {
      try {
        setCurrentClinicState(JSON.parse(savedClinic));
      } catch (error) {
        localStorage.removeItem('pawcare_clinic');
      }
    }
  }, []);

  const setCurrentClinic = (clinic: Clinic | null) => {
    setCurrentClinicState(clinic);
    if (clinic) {
      localStorage.setItem('pawcare_clinic', JSON.stringify(clinic));
    } else {
      localStorage.removeItem('pawcare_clinic');
    }
  };

  return (
    <ClinicContext.Provider value={{ 
      currentClinic, 
      setCurrentClinic, 
      clinicCode: currentClinic?.code || null 
    }}>
      {children}
    </ClinicContext.Provider>
  );
}

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within ClinicProvider');
  }
  return context;
};