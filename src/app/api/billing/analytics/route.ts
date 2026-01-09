import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Fetch all invoices for analytics
    let url = `${BACKEND_URL}/api/invoices`;
    if (startDate && endDate) {
      url = `${BACKEND_URL}/api/invoices/date-range?startDate=${startDate}&endDate=${endDate}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const invoices = await response.json();
    
    // Calculate analytics
    const analytics = {
      totalRevenue: invoices
        .filter((inv: any) => inv.status === 'PAID')
        .reduce((sum: number, inv: any) => sum + inv.total, 0),
      pendingAmount: invoices
        .filter((inv: any) => inv.status === 'SENT' || inv.status === 'OVERDUE')
        .reduce((sum: number, inv: any) => sum + inv.total, 0),
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter((inv: any) => inv.status === 'PAID').length,
      overdueInvoices: invoices.filter((inv: any) => inv.status === 'OVERDUE').length,
      pendingInvoices: invoices.filter((inv: any) => inv.status === 'SENT').length,
      draftInvoices: invoices.filter((inv: any) => inv.status === 'DRAFT').length,
      cancelledInvoices: invoices.filter((inv: any) => inv.status === 'CANCELLED').length,
      paymentMethods: invoices
        .filter((inv: any) => inv.status === 'PAID')
        .reduce((acc: any, inv: any) => {
          const method = inv.paymentMethod || 'UNKNOWN';
          acc[method] = (acc[method] || 0) + 1;
          return acc;
        }, {}),
      monthlyRevenue: invoices
        .filter((inv: any) => inv.status === 'PAID')
        .reduce((acc: any, inv: any) => {
          const month = new Date(inv.paidDate).toISOString().slice(0, 7);
          acc[month] = (acc[month] || 0) + inv.total;
          return acc;
        }, {})
    };
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing analytics' },
      { status: 500 }
    );
  }
}