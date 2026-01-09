import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    let endpoint = '/api/vaccinations/due';
    if (date) {
      endpoint += `?date=${date}`;
    }
    
    const vaccinations = await apiClient.get(endpoint);
    return NextResponse.json(vaccinations);
  } catch (error) {
    console.error('Error fetching due vaccinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch due vaccinations' },
      { status: 500 }
    );
  }
}