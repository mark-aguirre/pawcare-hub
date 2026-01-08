import { NextRequest, NextResponse } from 'next/server';

const veterinarians = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    specialization: 'General Practice',
    email: 'sarah.chen@pawcare.com',
    phone: '+1 (555) 123-4567',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Dr. Michael Torres',
    specialization: 'Surgery',
    email: 'michael.torres@pawcare.com',
    phone: '+1 (555) 234-5678',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    specialization: 'Dermatology',
    email: 'emily.watson@pawcare.com',
    phone: '+1 (555) 345-6789',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(veterinarians);
  } catch (error) {
    console.error('Error fetching veterinarians:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch veterinarians' },
      { status: 500 }
    );
  }
}