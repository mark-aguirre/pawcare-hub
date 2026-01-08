import { NextResponse } from 'next/server';
import { User } from '@/types';

// Mock data - replace with actual database calls
const mockUsers: User[] = [
  {
    id: 'dr-smith',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@pawcare.com',
    role: 'veterinarian',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'nurse-jones',
    firstName: 'Mike',
    lastName: 'Jones',
    email: 'mike.jones@pawcare.com',
    role: 'nurse',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'receptionist-brown',
    firstName: 'Lisa',
    lastName: 'Brown',
    email: 'lisa.brown@pawcare.com',
    role: 'receptionist',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'admin-wilson',
    firstName: 'John',
    lastName: 'Wilson',
    email: 'john.wilson@pawcare.com',
    role: 'administrator',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dr-johnson',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@pawcare.com',
    role: 'veterinarian',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tech-davis',
    firstName: 'Robert',
    lastName: 'Davis',
    email: 'robert.davis@pawcare.com',
    role: 'technician',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    return NextResponse.json(mockUsers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}