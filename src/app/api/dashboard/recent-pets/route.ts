import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/pets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error ${response.status}:`, errorText);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : data;
    return NextResponse.json(sortedData);
  } catch (error) {
    console.error('Recent pets API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent pets' },
      { status: 500 }
    );
  }
}