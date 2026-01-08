import { NextRequest, NextResponse } from 'next/server';

// Import records from main route - in real app this would be from database
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = records.find(r => r.id.toString() === params.id);
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error fetching record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch record' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const recordIndex = records.findIndex(r => r.id.toString() === params.id);
    
    if (recordIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    // Transform and update record
    const updatedRecord = {
      ...records[recordIndex],
      ...body,
      type: body.type ? body.type.toUpperCase().replace('-', '_') : records[recordIndex].type,
      status: body.status ? body.status.toUpperCase() : records[recordIndex].status,
      updatedAt: new Date().toISOString(),
    };

    records[recordIndex] = updatedRecord;

    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: 'Medical record updated successfully'
    });
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recordIndex = records.findIndex(r => r.id.toString() === params.id);
    
    if (recordIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    const deletedRecord = records.splice(recordIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedRecord,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete record' },
      { status: 500 }
    );
  }
}