import { NextRequest, NextResponse } from 'next/server';
import { ClinicSettings } from '@/types';

// Mock data - replace with actual database calls
const mockSettings: ClinicSettings = {
  id: '1',
  clinicName: 'PawCare Veterinary Clinic',
  address: '123 Pet Street, Animal City, AC 12345',
  phone: '(555) 123-4567',
  email: 'info@pawcare.com',
  timezone: 'America/New_York',
  appointmentDuration: 30,
  workingHours: {
    start: '08:00',
    end: '18:00'
  },
  emailNotifications: true,
  smsNotifications: false,
  appointmentReminders: true,
  autoBackup: true,
  backupFrequency: 'daily',
  theme: 'system',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export async function GET() {
  try {
    return NextResponse.json(mockSettings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['clinicName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Update settings (mock implementation)
    const updatedSettings: ClinicSettings = {
      ...mockSettings,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}