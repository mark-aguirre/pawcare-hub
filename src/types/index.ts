export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  pets: Pet[];
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  color: string;
  allergies: string[];
  conditions: string[];
  photoUrl?: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  petSpecies: Pet['species'];
  ownerId: string;
  ownerName: string;
  veterinarianId: string;
  veterinarianName: string;
  date: Date;
  time: string;
  duration: number;
  type: 'checkup' | 'vaccination' | 'surgery' | 'grooming' | 'emergency' | 'follow-up';
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Veterinarian {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  photoUrl?: string;
}

export interface DashboardStats {
  todayAppointments: number;
  pendingPayments: number;
  totalPets: number;
  lowStockItems: number;
  revenueToday: number;
  completedToday: number;
}
