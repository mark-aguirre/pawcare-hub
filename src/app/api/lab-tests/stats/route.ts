import { NextRequest, NextResponse } from 'next/server';
import { mockLabTests } from '@/data/mockData';

export async function GET(request: NextRequest) {
  try {
    const total = mockLabTests.length;
    const requested = mockLabTests.filter(t => t.status === 'requested').length;
    const inProgress = mockLabTests.filter(t => t.status === 'in-progress').length;
    const completed = mockLabTests.filter(t => t.status === 'completed').length;
    const cancelled = mockLabTests.filter(t => t.status === 'cancelled').length;

    // Tests completed in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyCompleted = mockLabTests.filter(t => 
      t.status === 'completed' && 
      t.completedDate && 
      new Date(t.completedDate) >= sevenDaysAgo
    ).length;

    // Average completion time (in days)
    const completedTests = mockLabTests.filter(t => t.status === 'completed' && t.completedDate);
    const avgCompletionTime = completedTests.length > 0 
      ? completedTests.reduce((sum, test) => {
          const requestedDate = new Date(test.requestedDate);
          const completedDate = new Date(test.completedDate!);
          const diffTime = completedDate.getTime() - requestedDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0) / completedTests.length
      : 0;

    // Most common test types
    const testTypeCounts = mockLabTests.reduce((acc, test) => {
      acc[test.testType] = (acc[test.testType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonTests = Object.entries(testTypeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    return NextResponse.json({
      success: true,
      data: {
        total,
        byStatus: {
          requested,
          inProgress,
          completed,
          cancelled
        },
        recentlyCompleted,
        avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
        mostCommonTests
      }
    });
  } catch (error) {
    console.error('Error fetching lab test stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lab test statistics' },
      { status: 500 }
    );
  }
}