export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  pets?: Pet[];
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  dateOfBirth?: string;
  gender?: string;
  weight?: number;
  microchipId?: string;
  owner?: Owner;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  date: string;
  time: string;
  duration?: number;
  type: 'CHECKUP' | 'VACCINATION' | 'SURGERY' | 'GROOMING' | 'EMERGENCY' | 'FOLLOW_UP';
  status: 'SCHEDULED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  petId?: number;
  petName?: string;
  petSpecies?: string;
  ownerId?: number;
  ownerName?: string;
  veterinarianId?: number;
  veterinarianName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Veterinarian {
  id: number;
  firstName: string;
  lastName: string;
  specialization?: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  petId: string;
  petName: string;
  petSpecies: Pet['species'];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  veterinarianId: string;
  veterinarianName: string;
  appointmentId?: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'check' | 'insurance' | 'online';
  notes?: string;
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'consultation' | 'procedure' | 'medication' | 'supplies' | 'boarding' | 'grooming' | 'other';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'cash' | 'card' | 'check' | 'insurance' | 'online';
  transactionId?: string;
  paidDate: Date;
  notes?: string;
  createdAt: Date;
}

export interface BillingSettings {
  taxRate: number;
  defaultPaymentTerms: number; // days
  lateFeeRate: number;
  lateFeeGracePeriod: number; // days
  invoicePrefix: string;
  nextInvoiceNumber: number;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    taxId?: string;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'medication' | 'supplies' | 'equipment' | 'food' | 'toys' | 'other';
  description: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  expiryDate?: Date;
  batchNumber?: string;
  notes?: string;
  lastRestocked: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
  createdAt: Date;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  petName: string;
  petSpecies: Pet['species'];
  ownerId: string;
  ownerName: string;
  veterinarianId: string;
  veterinarianName: string;
  date: Date;
  type: 'vaccination' | 'checkup' | 'surgery' | 'treatment' | 'lab-result' | 'emergency' | 'follow-up';
  title: string;
  description: string;
  notes?: string;
  attachments?: string[];
  status: 'pending' | 'completed' | 'archived';
  createdAt: Date;
}

export interface Vaccination {
  id: string;
  petId: string;
  petName: string;
  vaccineType: string;
  administeredDate: Date;
  nextDueDate: Date;
  veterinarianId: string;
  veterinarianName: string;
  batchNumber?: string;
  notes?: string;
  status: 'scheduled' | 'administered' | 'overdue';
  createdAt: Date;
}

export interface VaccinationSchedule {
  id: string;
  petId: string;
  vaccineType: string;
  dueDate: Date;
  status: 'upcoming' | 'due' | 'overdue';
  reminderSent: boolean;
}

export interface Prescription {
  id: string;
  petId: string;
  petName: string;
  veterinarianId: string;
  veterinarianName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  refillsRemaining: number;
  notes?: string;
}

export interface LabTest {
  id: string;
  petId: string;
  petName: string;
  testType: string;
  requestedDate: Date;
  completedDate?: Date;
  results?: string;
  status: 'requested' | 'in-progress' | 'completed' | 'cancelled';
  veterinarianId: string;
  veterinarianName: string;
  notes?: string;
}

export interface DashboardStats {
  todayAppointments: number;
  pendingPayments: number;
  totalPets: number;
  lowStockItems: number;
  revenueToday: number;
  completedToday: number;
}
