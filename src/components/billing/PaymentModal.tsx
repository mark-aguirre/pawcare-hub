"use client";

import { useState } from 'react';
import { 
  SlidingPanel,
  SlidingPanelContent,
  SlidingPanelFooter
} from '@/components/ui/sliding-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CreditCard, 
  DollarSign,
  Receipt,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Invoice, PaymentRecord } from '@/types';
import { cn } from '@/lib/utils';

interface PaymentPanelProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentProcessed: (payment: Partial<PaymentRecord>) => void;
}

const paymentMethods = [
  { value: 'cash', label: 'Cash', icon: DollarSign },
  { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { value: 'check', label: 'Check', icon: Receipt },
  { value: 'insurance', label: 'Insurance', icon: CheckCircle },
  { value: 'online', label: 'Online Payment', icon: CreditCard },
] as const;

export function PaymentPanel({ invoice, open, onOpenChange, onPaymentProcessed }: PaymentPanelProps) {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: '' as any,
    transactionId: '',
    notes: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountChange = (value: string) => {
    // Only allow valid decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPaymentData(prev => ({ ...prev, amount: value }));
    }
  };

  const handleFullPayment = () => {
    if (invoice) {
      setPaymentData(prev => ({ 
        ...prev, 
        amount: invoice.total.toFixed(2) 
      }));
    }
  };

  const handlePartialPayment = () => {
    if (invoice) {
      const halfAmount = (invoice.total / 2).toFixed(2);
      setPaymentData(prev => ({ 
        ...prev, 
        amount: halfAmount 
      }));
    }
  };

  const processPayment = async () => {
    if (!invoice || !paymentData.amount || !paymentData.method) return;

    setIsProcessing(true);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const payment: Partial<PaymentRecord> = {
      id: `pay-${Date.now()}`,
      invoiceId: invoice.id,
      amount: parseFloat(paymentData.amount),
      method: paymentData.method,
      transactionId: paymentData.transactionId || `TXN-${Date.now()}`,
      paidDate: new Date(),
      notes: paymentData.notes,
      createdAt: new Date(),
    };

    onPaymentProcessed(payment);
    
    // Reset form
    setPaymentData({
      amount: '',
      method: '' as any,
      transactionId: '',
      notes: '',
    });
    
    setIsProcessing(false);
    onOpenChange(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const paymentAmount = parseFloat(paymentData.amount) || 0;
  const remainingBalance = invoice ? invoice.total - paymentAmount : 0;
  const isFullPayment = invoice && paymentAmount >= invoice.total;
  const isValidAmount = paymentAmount > 0 && paymentAmount <= (invoice?.total || 0) && paymentData.amount !== '';
  const canProcessPayment = isValidAmount && paymentData.method && !isProcessing;

  return (
    <SlidingPanel
      open={open}
      onOpenChange={onOpenChange}
      width="lg"
      title="Process Payment"
      description={invoice ? `${invoice.invoiceNumber || 'INV-' + invoice.id} • ${invoice.petName}` : undefined}
    >
      <SlidingPanelContent>
        {invoice && (
          <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-medium mb-3">Invoice Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Invoice:</span> {invoice.invoiceNumber || `INV-${invoice.id}`}</p>
                  <p><span className="font-medium">Pet:</span> {invoice.petName}</p>
                  <p><span className="font-medium">Owner:</span> {invoice.ownerName}</p>
                </div>
                <div>
                  <p><span className="font-medium">Total Amount:</span> {formatCurrency(invoice.total)}</p>
                  <p><span className="font-medium">Status:</span> 
                    <Badge className="ml-2" variant={invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                      {invoice.status}
                    </Badge>
                  </p>
                  <p><span className="font-medium">Due Date:</span> {invoice.dueDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount *</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="text"
                      placeholder="0.00"
                      value={paymentData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleFullPayment}
                  >
                    Full
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePartialPayment}
                  >
                    50%
                  </Button>
                </div>
                {paymentAmount > 0 && (
                  <div className="text-sm space-y-1">
                    <p className={cn(
                      "flex justify-between",
                      isFullPayment ? "text-success" : "text-muted-foreground"
                    )}>
                      <span>Payment Amount:</span>
                      <span className="font-medium">{formatCurrency(paymentAmount)}</span>
                    </p>
                    {!isFullPayment && (
                      <p className="flex justify-between text-muted-foreground">
                        <span>Remaining Balance:</span>
                        <span className="font-medium">{formatCurrency(remainingBalance)}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select value={paymentData.method} onValueChange={(value) => 
                  setPaymentData(prev => ({ ...prev, method: value as any }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {method.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Transaction ID */}
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                <Input
                  id="transactionId"
                  placeholder="Enter transaction reference"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData(prev => ({ 
                    ...prev, 
                    transactionId: e.target.value 
                  }))}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Payment Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional payment details..."
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({ 
                    ...prev, 
                    notes: e.target.value 
                  }))}
                  rows={3}
                />
              </div>
            </div>

            {/* Validation Messages */}
            {paymentAmount > 0 && !isValidAmount && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  Payment amount cannot exceed the invoice total of {formatCurrency(invoice.total)}
                </span>
              </div>
            )}

            {isFullPayment && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  This payment will mark the invoice as fully paid
                </span>
              </div>
            )}
          </div>
        )}
      </SlidingPanelContent>

      <SlidingPanelFooter>
        <div className="flex gap-3 justify-end w-full">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={processPayment}
            disabled={!canProcessPayment}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </>
            )}
          </Button>
        </div>
      </SlidingPanelFooter>
    </SlidingPanel>
  );
}