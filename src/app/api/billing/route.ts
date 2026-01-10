import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');
    const petId = searchParams.get('petId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let url = `${BACKEND_URL}/api/invoices`;
    const params = new URLSearchParams();
    
    if (ownerId) params.append('ownerId', ownerId);
    if (status) url = `${BACKEND_URL}/api/invoices/status/${status.toUpperCase()}`;
    if (petId) url = `${BACKEND_URL}/api/invoices/pet/${petId}`;
    if (startDate && endDate) {
      url = `${BACKEND_URL}/api/invoices/date-range`;
      params.append('startDate', startDate);
      params.append('endDate', endDate);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Frontend request body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(`${BACKEND_URL}/api/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      console.error('Backend status:', response.status);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}