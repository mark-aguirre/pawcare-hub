import { NextRequest, NextResponse } from 'next/server';
import { mockLabTests } from '@/data/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const petId = searchParams.get('petId');
    const veterinarianId = searchParams.get('veterinarianId');

    let filteredTests = [...mockLabTests];

    if (status && status !== 'all') {
      filteredTests = filteredTests.filter(test => test.status === status);
    }

    if (petId) {
      filteredTests = filteredTests.filter(test => test.petId === petId);
    }

    if (veterinarianId) {
      filteredTests = filteredTests.filter(test => test.veterinarianId === veterinarianId);
    }

    // Sort by requested date (newest first)
    filteredTests.sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());

    return NextResponse.json({
      success: true,
      data: filteredTests,
      total: filteredTests.length
    });
  } catch (error) {
    console.error('Error fetching lab tests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lab tests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTest = {
      id: `lab-${Date.now()}`,
      ...body,
      requestedDate: new Date(),
      status: body.status || 'requested'
    };

    // In a real app, this would save to database
    mockLabTests.unshift(newTest);

    return NextResponse.json({
      success: true,
      data: newTest,
      message: 'Lab test created successfully'
    });
  } catch (error) {
    console.error('Error creating lab test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lab test' },
      { status: 500 }
    );
  }
}