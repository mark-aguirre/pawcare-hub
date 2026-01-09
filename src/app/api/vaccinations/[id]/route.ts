import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vaccination = await apiClient.get(`/api/vaccinations/${params.id}`);
    return NextResponse.json(vaccination);
  } catch (error) {
    console.error('Error fetching vaccination:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vaccination' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const vaccination = await apiClient.put(`/api/vaccinations/${params.id}`, body);
    return NextResponse.json(vaccination);
  } catch (error) {
    console.error('Error updating vaccination:', error);
    return NextResponse.json(
      { error: 'Failed to update vaccination' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await apiClient.delete(`/api/vaccinations/${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vaccination:', error);
    return NextResponse.json(
      { error: 'Failed to delete vaccination' },
      { status: 500 }
    );
  }
}