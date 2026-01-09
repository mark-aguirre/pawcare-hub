import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysAhead = searchParams.get('daysAhead') || '30';
    
    const vaccinations = await apiClient.get(`/api/vaccinations/upcoming?daysAhead=${daysAhead}`);
    return NextResponse.json(vaccinations);
  } catch (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming vaccinations' },
      { status: 500 }
    );
  }
}