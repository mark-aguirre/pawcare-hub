import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const prescription = await apiClient.put(`/api/prescriptions/${params.id}`, body);
    return NextResponse.json(prescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to update prescription' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await apiClient.delete(`/api/prescriptions/${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return NextResponse.json(
      { error: 'Failed to delete prescription' },
      { status: 500 }
    );
  }
}