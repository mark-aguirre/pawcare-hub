import { useState, useEffect } from 'react';
import { Invoice, PaymentRecord } from '@/types';

interface BillingFilters {
  status?: string;
  ownerId?: string;
  petId?: string;
  startDate?: string;
  endDate?: string;
}

interface BillingAnalytics {
  totalRevenue: number;
  pendingAmount: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  pendingInvoices: number;
  draftInvoices: number;
  cancelledInvoices: number;
  paymentMethods: Record<string, number>;
  monthlyRevenue: Record<string, number>;
}

export function useBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [analytics, setAnalytics] = useState<BillingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (invoiceId?: string) => {
    try {
      const params = new URLSearchParams();
      if (invoiceId) params.append('invoiceId', invoiceId);
      
      const url = `/api/billing/payments${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      
      const data = await response.json();
      
      // Transform backend data to frontend format
      const transformedPayments = data.map((payment: any) => ({
        ...payment,
        paidDate: new Date(payment.paidDate),
        method: payment.method.toLowerCase(),
        invoiceId: payment.invoice?.id || payment.invoiceId
      }));
      
      setPayments(transformedPayments);
      return transformedPayments;
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      return [];
    }
  };

  const fetchInvoices = async (filters?: BillingFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.ownerId && filters.ownerId !== 'all') params.append('ownerId', filters.ownerId);
      if (filters?.petId && filters.petId !== 'all') params.append('petId', filters.petId);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      const url = `/api/billing${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      
      // Transform backend data to frontend format
      const transformedInvoices = data.map((invoice: any) => ({
        ...invoice,
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate),
        paidDate: invoice.paidDate ? new Date(invoice.paidDate) : null,
        petName: invoice.pet?.name || invoice.petName || 'Unknown Pet',
        petSpecies: invoice.pet?.species || invoice.petSpecies || 'Unknown',
        ownerName: invoice.owner ? `${invoice.owner.firstName || ''} ${invoice.owner.lastName || ''}`.trim() || invoice.ownerName : invoice.ownerName || 'Unknown Owner',
        ownerEmail: invoice.owner?.email || invoice.ownerEmail || null,
        veterinarianName: invoice.veterinarian ? 
          (invoice.veterinarian.name || `Dr. ${invoice.veterinarian.firstName || ''} ${invoice.veterinarian.lastName || ''}`.trim()) : 
          invoice.veterinarianName || 'Unknown Vet',
        status: invoice.status?.toLowerCase() || 'draft',
        paymentMethod: invoice.paymentMethod?.toLowerCase(),
        items: invoice.items || [],
        subtotal: invoice.subtotal || 0,
        tax: invoice.tax || 0,
        total: invoice.total || 0,
        discount: invoice.discount || 0
      }));
      
      setInvoices(transformedInvoices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = `/api/billing/analytics${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const createInvoice = async (invoiceData: Partial<Invoice>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Invoice data received:', invoiceData);
      
      const requestBody = {
        pet: { id: parseInt(invoiceData.petId as string) },
        owner: { id: parseInt(invoiceData.ownerId as string) },
        veterinarian: { id: parseInt(invoiceData.veterinarianId as string) },
        issueDate: invoiceData.issueDate?.toISOString().split('T')[0],
        dueDate: invoiceData.dueDate?.toISOString().split('T')[0],
        status: (invoiceData.status || 'draft').toUpperCase(),
        items: (invoiceData.items || []).map(item => ({
          description: item.description,
          category: item.category.toUpperCase(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        })),
        subtotal: invoiceData.subtotal || 0,
        tax: invoiceData.tax || 0,
        total: invoiceData.total || 0,
        notes: invoiceData.notes || null,
      };
      
      console.log('Request body to send:', requestBody);
      
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        console.error('Backend status:', response.status);
        throw new Error(`Failed to create invoice: ${errorText}`);
      }
      
      const newInvoice = await response.json();
      await fetchInvoices(); // Refresh the list
      return newInvoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/billing/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...invoiceData,
          issueDate: invoiceData.issueDate?.toISOString().split('T')[0],
          dueDate: invoiceData.dueDate?.toISOString().split('T')[0],
          paidDate: invoiceData.paidDate?.toISOString().split('T')[0],
          status: (invoiceData.status || 'draft').toUpperCase(),
          paymentMethod: invoiceData.paymentMethod?.toUpperCase(),
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update invoice error:', response.status, errorText);
        throw new Error(`Failed to update invoice: ${response.status}`);
      }
      
      const updatedInvoice = await response.json();
      await fetchInvoices(); // Refresh the list
      return updatedInvoice;
    } catch (err) {
      console.error('Update invoice error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/billing/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }
      
      await fetchInvoices(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async (paymentData: {
    invoiceId: string;
    amount: number;
    method: string;
    transactionId?: string;
    notes?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/billing/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process payment');
      }
      
      const result = await response.json();
      await fetchInvoices(); // Refresh the list
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invoices,
    payments,
    analytics,
    isLoading,
    error,
    fetchInvoices,
    fetchPayments,
    fetchAnalytics,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    processPayment,
  };
}