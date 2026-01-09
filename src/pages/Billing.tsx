"use client";

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InvoiceCard } from '@/components/billing/InvoiceCard';
import { InvoiceDetailPanel } from '@/components/billing/InvoiceDetailModal';
import { InvoiceFormPanel } from '@/components/billing/InvoiceFormModal';
import { PaymentPanel } from '@/components/billing/PaymentModal';
import { BillingAnalytics } from '@/components/billing/BillingAnalytics';
import { BillingSettings } from '@/components/billing/BillingSettings';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Receipt, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Download,
  Send,
  BarChart3,
  CreditCard,
  TrendingUp,
  Settings,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import { mockPets } from '@/data/mockData';
import { Invoice, PaymentRecord } from '@/types';
import { cn } from '@/lib/utils';
import { useBilling } from '@/hooks/use-billing';

const statusFilters = ['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'] as const;
const paymentMethodFilters = ['all', 'cash', 'card', 'check', 'insurance', 'online'] as const;

export default function Billing() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('invoices');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<typeof statusFilters[number]>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<typeof paymentMethodFilters[number]>('all');
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'dueDate' | 'status'>('date');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const {
    invoices,
    payments,
    analytics,
    isLoading: billingLoading,
    error: billingError,
    fetchInvoices,
    fetchPayments,
    fetchAnalytics,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    processPayment
  } = useBilling();
  const [localPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchInvoices();
        await fetchPayments();
        await fetchAnalytics();
      } catch (error) {
        console.error('Failed to load billing data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const filters = {
      status: selectedStatus,
      petId: selectedPet,
    };
    fetchInvoices(filters);
  }, [selectedStatus, selectedPet]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      (invoice.invoiceNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (invoice.petName || '').toLowerCase().includes(search.toLowerCase()) ||
      (invoice.ownerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (invoice.veterinarianName || '').toLowerCase().includes(search.toLowerCase()) ||
      invoice.items.some(item => (item.description || '').toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || invoice.paymentMethod === selectedPaymentMethod;
    const matchesPet = selectedPet === 'all' || invoice.petId === selectedPet;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesPet;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.issueDate.getTime() - a.issueDate.getTime();
      case 'amount':
        return b.total - a.total;
      case 'dueDate':
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Calculate stats from analytics or fallback to local calculation
  const totalInvoices = analytics?.totalInvoices || invoices.length;
  const paidInvoices = analytics?.paidInvoices || invoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoices = analytics?.overdueInvoices || invoices.filter(inv => inv.status === 'overdue').length;
  const pendingInvoices = analytics?.pendingInvoices || invoices.filter(inv => inv.status === 'sent').length;
  const totalRevenue = analytics?.totalRevenue || invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = analytics?.pendingAmount || invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setIsFormModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormModalOpen(true);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  };

  const handleSaveInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, invoiceData);
      } else {
        const newInvoiceData = {
          ...invoiceData,
          invoiceNumber: invoiceData.invoiceNumber || `INV-${Date.now()}`,
          petId: parseInt(invoiceData.petId as string),
          ownerId: parseInt(invoiceData.ownerId as string),
          veterinarianId: parseInt(invoiceData.veterinarianId as string),
        };
        await createInvoice(newInvoiceData);
      }
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  const handleProcessPayment = async (payment: Partial<PaymentRecord>) => {
    try {
      const result = await processPayment({
        invoiceId: payment.invoiceId!,
        amount: payment.amount!,
        method: payment.method!,
        transactionId: payment.transactionId,
        notes: payment.notes,
      });
      
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  const handlePaymentClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  return (
    <MainLayout
      title="Billing & Invoices"
      subtitle={`${totalInvoices} total invoices • ${pendingInvoices + overdueInvoices} pending payment`}
      action={{ label: 'New Invoice', onClick: handleCreateInvoice }}
    >
      <LoadingWrapper isLoading={isLoading || billingLoading} variant="billing">
      {billingError && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{billingError}</p>
        </div>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-success/5 via-success/10 to-success/5 border-success/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-lg font-bold text-success">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warning/5 via-warning/10 to-warning/5 border-warning/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Pending Amount</p>
                    <p className="text-lg font-bold text-warning">{formatCurrency(pendingAmount)}</p>
                  </div>
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-destructive/5 via-destructive/10 to-destructive/5 border-destructive/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Overdue</p>
                    <p className="text-lg font-bold text-destructive">{overdueInvoices}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Paid Invoices</p>
                    <p className="text-lg font-bold text-primary">{paidInvoices}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search and Sort */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by invoice number, pet, owner, or service..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="amount">Sort by Amount</option>
                      <option value="dueDate">Sort by Due Date</option>
                      <option value="status">Sort by Status</option>
                    </select>
                  </div>
                </div>

                {/* Filter Tabs */}
                <Tabs defaultValue="status" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="status">Status</TabsTrigger>
                    <TabsTrigger value="payment">Payment Method</TabsTrigger>
                    <TabsTrigger value="pet">Pet</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="status" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {statusFilters.map((status) => (
                        <Button
                          key={status}
                          variant={selectedStatus === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedStatus(status)}
                          className="capitalize"
                        >
                          {status === 'all' ? 'All Status' : status}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payment" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {paymentMethodFilters.map((method) => (
                        <Button
                          key={method}
                          variant={selectedPaymentMethod === method ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedPaymentMethod(method)}
                          className="capitalize"
                        >
                          {method === 'all' ? 'All Methods' : method}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pet" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedPet === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPet('all')}
                      >
                        All Pets
                      </Button>
                      {mockPets.map((pet) => (
                        <Button
                          key={pet.id}
                          variant={selectedPet === pet.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedPet(pet.id)}
                        >
                          {pet.name}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Invoices List */}
          <div className="space-y-4">
            {filteredInvoices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredInvoices.map((invoice, index) => (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    delay={index * 50}
                    onClick={() => handleInvoiceClick(invoice)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No invoices found</h3>
                <p className="text-muted-foreground mb-4">
                  {search || selectedStatus !== 'all' || selectedPaymentMethod !== 'all' || selectedPet !== 'all'
                    ? 'Try adjusting your filters or search terms.'
                    : 'No invoices have been created yet.'}
                </p>
                <Button onClick={() => {
                  setSearch('');
                  setSelectedStatus('all');
                  setSelectedPaymentMethod('all');
                  setSelectedPet('all');
                }}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <BillingAnalytics />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                Payment Records
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {payments.length > 0 ? (
                  payments
                    .sort((a, b) => b.paidDate.getTime() - a.paidDate.getTime())
                    .map((payment) => {
                      const invoice = invoices.find(inv => inv.id === payment.invoiceId);
                      return (
                        <div key={payment.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10 text-success">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                              <p className="text-xs text-muted-foreground">
                                {invoice?.invoiceNumber} • {invoice?.petName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {payment.paidDate.toLocaleDateString()} • {payment.method}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="capitalize text-xs">
                              {payment.method}
                            </Badge>
                            {payment.transactionId && (
                              <p className="text-xs text-muted-foreground mt-1 font-mono">
                                {payment.transactionId}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-6">
                    <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No payment records found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <BillingSettings />
        </TabsContent>
      </Tabs>
      </LoadingWrapper>

      {/* Panels */}
      <InvoiceDetailPanel
        invoice={selectedInvoice}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onEdit={handleEditInvoice}
        onPayment={handlePaymentClick}
        onDelete={handleDeleteInvoice}
      />

      <InvoiceFormPanel
        invoice={editingInvoice}
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSave={handleSaveInvoice}
      />

      <PaymentPanel
        invoice={selectedInvoice}
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onPaymentProcessed={handleProcessPayment}
      />
    </MainLayout>
  );
}