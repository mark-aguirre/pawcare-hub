import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clinicData = await request.json();
    const clinicId = params.id;
    
    const response = await fetch(`${BACKEND_URL}/api/clinics/${clinicId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clinicData),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update clinic' }, { status: 500 });
  }
}