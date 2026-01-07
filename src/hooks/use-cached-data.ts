import { useState, useEffect } from 'react';
import { appCache } from '@/lib/cache';
import { mockPets, mockOwners, mockAppointments } from '@/data/mockData';

export function useCachedPets() {
  const [pets, setPets] = useState(() => appCache.get('pets') || mockPets);
  
  useEffect(() => {
    if (!appCache.get('pets')) {
      appCache.set('pets', mockPets);
    }
  }, []);
  
  return pets;
}

export function useCachedOwners() {
  const [owners, setOwners] = useState(() => appCache.get('owners') || mockOwners);
  
  useEffect(() => {
    if (!appCache.get('owners')) {
      appCache.set('owners', mockOwners);
    }
  }, []);
  
  return owners;
}

export function useCachedAppointments() {
  const [appointments, setAppointments] = useState(() => appCache.get('appointments') || mockAppointments);
  
  useEffect(() => {
    if (!appCache.get('appointments')) {
      appCache.set('appointments', mockAppointments);
    }
  }, []);
  
  return appointments;
}