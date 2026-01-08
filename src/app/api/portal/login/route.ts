import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'PID, email, or phone is required' },
        { status: 400 }
      );
    }
    
    // Try to find owner by PID, email, or phone
    const response = await fetch(`${BACKEND_URL}/api/owners/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const owner = await response.json();
    return NextResponse.json(owner);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Owner not found' },
      { status: 404 }
    );
  }
}