import { NextRequest, NextResponse } from 'next/server';
import { mockLabTests } from '@/data/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const test = mockLabTests.find(t => t.id === params.id);
    
    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Lab test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error('Error fetching lab test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lab test' },
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
    const testIndex = mockLabTests.findIndex(t => t.id === params.id);
    
    if (testIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lab test not found' },
        { status: 404 }
      );
    }

    // Update the test
    mockLabTests[testIndex] = {
      ...mockLabTests[testIndex],
      ...body,
      id: params.id // Ensure ID doesn't change
    };

    return NextResponse.json({
      success: true,
      data: mockLabTests[testIndex],
      message: 'Lab test updated successfully'
    });
  } catch (error) {
    console.error('Error updating lab test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lab test' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testIndex = mockLabTests.findIndex(t => t.id === params.id);
    
    if (testIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lab test not found' },
        { status: 404 }
      );
    }

    // Remove the test
    mockLabTests.splice(testIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Lab test deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lab test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lab test' },
      { status: 500 }
    );
  }
}