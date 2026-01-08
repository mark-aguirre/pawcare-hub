import { NextRequest, NextResponse } from 'next/server';
import { UserPermissions } from '@/types';

// Mock data - replace with actual database calls
const mockPermissions: UserPermissions[] = [
  {
    id: '1',
    userId: 'dr-smith',
    userName: 'Dr. Sarah Smith',
    userRole: 'Veterinarian',
    permissions: {
      appointments: true,
      pets: true,
      owners: true,
      records: true,
      inventory: true,
      billing: true,
      reports: true,
      settings: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'nurse-jones',
    userName: 'Mike Jones',
    userRole: 'Veterinary Nurse',
    permissions: {
      appointments: true,
      pets: true,
      owners: true,
      records: true,
      inventory: true,
      billing: false,
      reports: false,
      settings: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    userId: 'receptionist-brown',
    userName: 'Lisa Brown',
    userRole: 'Receptionist',
    permissions: {
      appointments: true,
      pets: true,
      owners: true,
      records: false,
      inventory: false,
      billing: true,
      reports: false,
      settings: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (userId) {
      const userPermissions = mockPermissions.find(p => p.userId === userId);
      if (!userPermissions) {
        return NextResponse.json(
          { error: 'User permissions not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(userPermissions);
    }
    
    return NextResponse.json(mockPermissions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, permissions } = body;
    
    if (!userId || !permissions) {
      return NextResponse.json(
        { error: 'userId and permissions are required' },
        { status: 400 }
      );
    }

    // Find existing permissions
    const existingIndex = mockPermissions.findIndex(p => p.userId === userId);
    
    if (existingIndex === -1) {
      return NextResponse.json(
        { error: 'User permissions not found' },
        { status: 404 }
      );
    }

    // Update permissions
    mockPermissions[existingIndex] = {
      ...mockPermissions[existingIndex],
      permissions,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(mockPermissions[existingIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}