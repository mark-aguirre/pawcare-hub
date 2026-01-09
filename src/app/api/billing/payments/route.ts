import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8082';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, amount, method, transactionId, notes } = body;
    
    if (!invoiceId || !amount || !method) {
      return NextResponse.json(
        { error: 'Invoice ID, amount, and payment method are required' },
        { status: 400 }
      );
    }
    
    // Process payment through backend
    const response = await fetch(`${BACKEND_URL}/api/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceId: parseInt(invoiceId),
        amount: parseFloat(amount),
        method: method.toUpperCase(),
        transactionId,
        notes
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process payment');
    }

    const paymentRecord = await response.json();
    
    // Get updated invoice
    const invoiceResponse = await fetch(`${BACKEND_URL}/api/invoices/${invoiceId}`);
    const updatedInvoice = invoiceResponse.ok ? await invoiceResponse.json() : null;
    
    return NextResponse.json({
      payment: {
        id: paymentRecord.id,
        invoiceId: paymentRecord.invoice.id,
        amount: paymentRecord.amount,
        method: paymentRecord.method.toLowerCase(),
        transactionId: paymentRecord.transactionId,
        paidDate: paymentRecord.paidDate,
        notes: paymentRecord.notes
      },
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');
    
    let url = `${BACKEND_URL}/api/payments`;
    if (invoiceId) {
      url = `${BACKEND_URL}/api/payments/invoice/${invoiceId}`;
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment records' },
      { status: 500 }
    );
  }
}