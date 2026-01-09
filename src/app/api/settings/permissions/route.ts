import { NextRequest, NextResponse } from 'next/server';
import { UserPermissions } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:8082';
    const url = userId ? `${baseUrl}/api/settings/permissions?userId=${userId}` : `${baseUrl}/api/settings/permissions`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch permissions' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, permissions } = body;
    
    if (!userId || !permissions) {
      return NextResponse.json(
        { error: 'userId and permissions are required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:8082';
    const response = await fetch(`${baseUrl}/api/settings/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, permissions })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update permissions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}