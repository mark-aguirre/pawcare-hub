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

export interface DashboardStats {
  todayAppointments: number;
  pendingPayments: number;
  totalPets: number;
  lowStockItems: number;
  revenueToday: number;
  completedToday: number;
}
