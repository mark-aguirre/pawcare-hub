import { NextRequest, NextResponse } from 'next/server';

// Mock data that matches backend format
let records: any[] = [
  {
    id: 1,
    date: '2025-12-08',
    type: 'CHECKUP',
    title: 'Annual Health Checkup',
    description: 'Routine examination - all vitals normal',
    notes: null,
    attachments: null,
    status: 'COMPLETED',
    createdAt: '2026-01-07T21:06:58.406874',
    updatedAt: '2026-01-07T21:06:58.406874',
    pet: {
      id: 1,
      name: 'Max',
      species: 'dog',
      owner: {
        id: 1,
        firstName: 'John',
        lastName: 'Smith'
      }
    },
    veterinarian: {
      id: 1,
      firstName: 'Dr. Sarah',
      lastName: 'Chen',
      specialization: 'General Practice'
    }
  },
  {
    id: 2,
    date: '2025-12-23',
    type: 'TREATMENT',
    title: 'Ear Infection Treatment',
    description: 'Treated for bacterial ear infection',
    notes: 'Prescribed antibiotic ear drops',
    attachments: null,
    status: 'COMPLETED',
    createdAt: '2026-01-07T21:06:58.416955',
    updatedAt: '2026-01-07T21:06:58.416955',
    pet: {
      id: 2,
      name: 'Luna',
      species: 'cat',
      owner: {
        id: 2,
        firstName: 'Maria',
        lastName: 'Garcia'
      }
    },
    veterinarian: {
      id: 1,
      firstName: 'Dr. Sarah',
      lastName: 'Chen',
      specialization: 'General Practice'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const petId = searchParams.get('petId');
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';
    
    let backendUrl = `${BACKEND_URL}/api/medical-records`;
    if (petId) {
      backendUrl = `${BACKEND_URL}/api/medical-records/pet/${petId}`;
    } else {
      backendUrl = `${BACKEND_URL}/api/medical-records?${searchParams.toString()}`;
    }
    
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json({
      success: true,
      data,
      total: data.length
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';
    
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/medical-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data,
      message: 'Medical record created successfully'
    });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create record' },
      { status: 500 }
    );
  }
}