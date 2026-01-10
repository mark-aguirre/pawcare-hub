import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert frontend format to backend format
    const userData = {
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      password: body.password,
      role: body.clinicCode ? (body.role || 'VETERINARIAN') : 'ADMINISTRATOR',
      clinicCode: body.clinicCode || null
    };
    
    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}