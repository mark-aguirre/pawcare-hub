import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // For now, return all clinics since backend doesn't have user-clinic association endpoint yet
    const response = await fetch(`${BACKEND_URL}/api/clinics`);
    const allClinics = await response.json();
    
    // Filter clinics for this user (mock logic - replace with proper backend endpoint)
    const userClinics = allClinics.filter((clinic: any) => 
      clinic.ownerId === parseInt(userId) || parseInt(userId) === 1
    );
    
    return NextResponse.json(userClinics);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user clinics' }, { status: 500 });
  }
}