import { apiClient } from '@/lib/api';
import { Vaccination } from '@/types';

export interface VaccinationCreateRequest {
  pet: { id: number };
  vaccineType: string;
  administeredDate: string;
  nextDueDate: string;
  veterinarian: { id: number };
  batchNumber?: string;
  notes?: string;
  status: 'SCHEDULED' | 'ADMINISTERED' | 'OVERDUE';
}

export interface VaccinationUpdateRequest {
  pet?: { id: number };
  vaccineType?: string;
  administeredDate?: string;
  nextDueDate?: string;
  veterinarian?: { id: number };
  batchNumber?: string;
  notes?: string;
  status?: 'SCHEDULED' | 'ADMINISTERED' | 'OVERDUE';
}

export class VaccinationService {
  static async getAll(): Promise<any[]> {
    return await apiClient.get('/api/vaccinations');
  }

  static async getById(id: string): Promise<any> {
    return await apiClient.get(`/api/vaccinations/${id}`);
  }

  static async getByPetId(petId: number): Promise<any[]> {
    return await apiClient.get(`/api/vaccinations/pet/${petId}`);
  }

  static async create(data: VaccinationCreateRequest): Promise<any> {
    return await apiClient.post('/api/vaccinations', data);
  }

  static async update(id: string, data: VaccinationUpdateRequest): Promise<any> {
    return await apiClient.put(`/api/vaccinations/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return await apiClient.delete(`/api/vaccinations/${id}`);
  }

  static async getDue(date?: string): Promise<any[]> {
    const endpoint = date ? `/api/vaccinations/due?date=${date}` : '/api/vaccinations/due';
    return await apiClient.get(endpoint);
  }

  static async getUpcoming(daysAhead: number = 30): Promise<any[]> {
    return await apiClient.get(`/api/vaccinations/upcoming?daysAhead=${daysAhead}`);
  }

  static transformFromBackend(backendData: any): Vaccination {
    return {
      id: backendData.id?.toString() || '',
      petId: backendData.pet?.id?.toString() || '',
      petName: backendData.pet?.name || '',
      vaccineType: backendData.vaccineType || '',
      administeredDate: new Date(backendData.administeredDate),
      nextDueDate: new Date(backendData.nextDueDate),
      veterinarianId: backendData.veterinarian?.id?.toString() || '',
      veterinarianName: `${backendData.veterinarian?.firstName || ''} ${backendData.veterinarian?.lastName || ''}`.trim(),
      batchNumber: backendData.batchNumber,
      notes: backendData.notes,
      status: backendData.status?.toLowerCase() || 'scheduled',
      createdAt: new Date(backendData.createdAt || Date.now())
    };
  }

  static transformToBackend(formData: {
    petId: number;
    vaccineType: string;
    administeredDate: string;
    nextDueDate: string;
    veterinarianId: number;
    batchNumber?: string;
    notes?: string;
    status: 'SCHEDULED' | 'ADMINISTERED' | 'OVERDUE';
  }): VaccinationCreateRequest {
    return {
      pet: { id: formData.petId },
      vaccineType: formData.vaccineType,
      administeredDate: formData.administeredDate,
      nextDueDate: formData.nextDueDate,
      veterinarian: { id: formData.veterinarianId },
      batchNumber: formData.batchNumber,
      notes: formData.notes,
      status: formData.status
    };
  }
}