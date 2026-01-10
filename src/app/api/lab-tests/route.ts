import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const petId = searchParams.get('petId');
    const veterinarianId = searchParams.get('veterinarianId');
    const clinicCode = request.headers.get('x-clinic-code');

    let url = `${BACKEND_URL}/api/lab-tests`;
    const params = new URLSearchParams();
    
    if (status && status !== 'all') params.append('status', status);
    if (petId) params.append('petId', petId);
    if (veterinarianId) params.append('veterinarianId', veterinarianId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-clinic-code': clinicCode || '00000000',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: data,
      total: data.length
    });
  } catch (error) {
    console.error('Error fetching lab tests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lab tests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clinicCode = request.headers.get('x-clinic-code');
    
    const response = await fetch(`${BACKEND_URL}/api/lab-tests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-clinic-code': clinicCode || '00000000',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Lab test created successfully'
    });
  } catch (error) {
    console.error('Error creating lab test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lab test' },
      { status: 500 }
    );
  }
}