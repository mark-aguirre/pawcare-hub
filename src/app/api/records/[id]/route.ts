import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`http://localhost:8082/api/medical-records/${params.id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    const record = await response.json();
    return NextResponse.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error fetching record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch record' },
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
    
    const response = await fetch(`http://localhost:8082/api/medical-records/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to update record' },
        { status: response.status }
      );
    }

    const updatedRecord = await response.json();
    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: 'Medical record updated successfully'
    });
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`http://localhost:8082/api/medical-records/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete record' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete record' },
      { status: 500 }
    );
  }
}