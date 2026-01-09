import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const petId = searchParams.get('petId');
    
    let endpoint = '/api/vaccinations';
    if (petId) {
      endpoint = `/api/vaccinations/pet/${petId}`;
    }
    
    const vaccinations = await apiClient.get(endpoint);
    return NextResponse.json(vaccinations);
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vaccinations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const vaccination = await apiClient.post('/api/vaccinations', body);
    return NextResponse.json(vaccination);
  } catch (error) {
    console.error('Error creating vaccination:', error);
    return NextResponse.json(
      { error: 'Failed to create vaccination' },
      { status: 500 }
    );
  }
}