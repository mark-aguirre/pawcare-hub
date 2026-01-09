import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysAhead = searchParams.get('daysAhead') || '30';
    
    const response = await fetch(`${BACKEND_URL}/api/vaccinations/upcoming?daysAhead=${daysAhead}`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming vaccinations' },
      { status: 500 }
    );
  }
}