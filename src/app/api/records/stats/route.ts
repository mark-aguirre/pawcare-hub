import { NextRequest, NextResponse } from 'next/server';

// This would be imported from a shared data source in a real implementation
const records: any[] = [
  {
    id: 'record-1',
    petId: 'pet-1',
    petName: 'Max',
    petSpecies: 'dog',
    ownerId: 'owner-1',
    ownerName: 'John Smith',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    date: new Date('2024-12-15'),
    type: 'checkup',
    title: 'Annual Wellness Exam',
    description: 'Complete physical examination including weight check, dental inspection, and general health assessment.',
    notes: 'Patient is in excellent health. Weight is within normal range. Recommend continuing current diet and exercise routine.',
    status: 'completed',
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'record-2',
    petId: 'pet-2',
    petName: 'Luna',
    petSpecies: 'cat',
    ownerId: 'owner-2',
    ownerName: 'Maria Garcia',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    date: new Date('2024-12-10'),
    type: 'vaccination',
    title: 'Rabies Vaccination',
    description: 'Annual rabies vaccination administered as part of routine preventive care.',
    notes: 'No adverse reactions observed. Next vaccination due in 12 months.',
    status: 'completed',
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'record-6',
    petId: 'pet-1',
    petName: 'Max',
    petSpecies: 'dog',
    ownerId: 'owner-1',
    ownerName: 'John Smith',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    date: new Date('2025-01-05'),
    type: 'lab-result',
    title: 'Blood Work Results',
    description: 'Complete blood panel including CBC, chemistry panel, and thyroid function.',
    notes: 'All values within normal limits. Excellent overall health indicators.',
    status: 'pending',
    createdAt: new Date('2025-01-05'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const totalRecords = records.length;
    const pendingRecords = records.filter(r => r.status === 'pending').length;
    const completedRecords = records.filter(r => r.status === 'completed').length;
    const archivedRecords = records.filter(r => r.status === 'archived').length;
    
    // Calculate records from this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentRecords = records.filter(r => new Date(r.date) >= oneWeekAgo).length;
    
    // Calculate records by type
    const recordsByType = records.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate records by status
    const recordsByStatus = {
      pending: pendingRecords,
      completed: completedRecords,
      archived: archivedRecords,
    };

    return NextResponse.json({
      success: true,
      data: {
        total: totalRecords,
        pending: pendingRecords,
        completed: completedRecords,
        archived: archivedRecords,
        thisWeek: recentRecords,
        byType: recordsByType,
        byStatus: recordsByStatus,
      }
    });
  } catch (error) {
    console.error('Error fetching record statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch record statistics' },
      { status: 500 }
    );
  }
}