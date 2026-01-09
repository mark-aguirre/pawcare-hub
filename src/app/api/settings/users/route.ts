import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types';

export async function GET() {
  try {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:8082';
    const response = await fetch(`${baseUrl}/api/settings/users`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role } = body;
    
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId and role are required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:8082';
    const response = await fetch(`${baseUrl}/api/settings/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, role })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}