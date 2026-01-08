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
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';
    
    const response = await fetch(`${BACKEND_URL}/api/medical-records`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Sort by createdAt (newest first)
    const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      success: true,
      data: sortedData,
      total: sortedData.length
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
    
    // Validate required fields
    if (!body.petId || !body.veterinarianId || !body.type || !body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Transform frontend data to backend format
    const newRecord = {
      id: records.length + 1,
      date: body.date || new Date().toISOString().split('T')[0],
      type: body.type.toUpperCase().replace('-', '_'),
      title: body.title,
      description: body.description,
      notes: body.notes || null,
      attachments: body.attachments || null,
      status: (body.status || 'pending').toUpperCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pet: {
        id: parseInt(body.petId),
        name: body.petName,
        species: body.petSpecies,
        owner: {
          id: parseInt(body.ownerId),
          firstName: body.ownerName?.split(' ')[0] || 'Unknown',
          lastName: body.ownerName?.split(' ').slice(1).join(' ') || 'Owner'
        }
      },
      veterinarian: {
        id: parseInt(body.veterinarianId),
        firstName: body.veterinarianName?.split(' ')[0] || 'Dr.',
        lastName: body.veterinarianName?.split(' ').slice(1).join(' ') || 'Unknown',
        specialization: 'General Practice'
      }
    };

    records.push(newRecord);

    return NextResponse.json({
      success: true,
      data: newRecord,
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