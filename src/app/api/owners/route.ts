import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function GET(request: NextRequest) {
  try {
    const clinicCode = request.headers.get('X-Clinic-Code');
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    
    let backendUrl = `${BACKEND_URL}/api/owners`;
    
    if (name) {
      backendUrl += `/search?name=${encodeURIComponent(name)}`;
    } else if (email) {
      backendUrl += `?email=${encodeURIComponent(email)}`;
    }
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(clinicCode && { 'X-Clinic-Code': clinicCode }),
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clinicCode = request.headers.get('X-Clinic-Code');
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/owners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(clinicCode && { 'X-Clinic-Code': clinicCode }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create owner' },
      { status: 500 }
    );
  }
}