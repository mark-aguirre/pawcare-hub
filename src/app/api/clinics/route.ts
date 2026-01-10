import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function POST(request: NextRequest) {
  try {
    const clinicData = await request.json();
    
    if (!clinicData.userId) {
      return NextResponse.json(
        { success: false, message: 'userId must be included' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/clinics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clinicData),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create clinic' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/clinics`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 });
  }
}