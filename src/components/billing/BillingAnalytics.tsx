"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  Users,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle
} from 'lucide-react';
import { mockInvoices, mockPaymentRecords } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface BillingAnalyticsProps {
  className?: string;
}

export function BillingAnalytics({ className }: BillingAnalyticsProps) {
  // Calculate analytics data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthInvoices = mockInvoices.filter(inv => 
    inv.issueDate.getMonth() === currentMonth && 
    inv.issueDate.getFullYear() === currentYear
  );
  
  const lastMonthInvoices = mockInvoices.filter(inv => {
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const year = currentMonth === 0 ? currentYear - 1 : currentYear;
    return inv.issueDate.getMonth() === lastMonth && inv.issueDate.getFullYear() === year;
  });

  const thisMonthRevenue = thisMonthInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const lastMonthRevenue = lastMonthInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const revenueGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  const totalOutstanding = mockInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueAmount = mockInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  const averageInvoiceValue = mockInvoices.length > 0 
    ? mockInvoices.reduce((sum, inv) => sum + inv.total, 0) / mockInvoices.length 
    : 0;

  const paymentMethodStats = mockPaymentRecords.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const collectionRate = mockInvoices.length > 0 
    ? (mockInvoices.filter(inv => inv.status === 'paid').length / mockInvoices.length) * 100 
    : 0;

  const averagePaymentTime = mockInvoices
    .filter(inv => inv.status === 'paid' && inv.paidDate)
    .reduce((sum, inv) => {
      const daysToPay = Math.ceil((inv.paidDate!.getTime() - inv.issueDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + daysToPay;
    }, 0) / mockInvoices.filter(inv => inv.status === 'paid').length || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(thisMonthRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {revenueGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    revenueGrowth >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockInvoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length} invoices
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
                <div className="mt-2">
                  <Progress value={collectionRate} className="h-2" />
                </div>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Payment Time</p>
                <p className="text-2xl font-bold">{averagePaymentTime.toFixed(0)} days</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Target: 30 days
                </p>
              </div>
              <Calendar className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods & Invoice Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(paymentMethodStats)
              .sort(([,a], [,b]) => b - a)
              .map(([method, amount]) => {
                const percentage = (amount / Object.values(paymentMethodStats).reduce((a, b) => a + b, 0)) * 100;
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{method}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(amount)}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Invoice Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{mockInvoices.length}</p>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-2xl font-bold text-success">{formatCurrency(averageInvoiceValue)}</p>
                <p className="text-sm text-muted-foreground">Avg Invoice Value</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { status: 'paid', count: mockInvoices.filter(i => i.status === 'paid').length, color: 'success' },
                { status: 'sent', count: mockInvoices.filter(i => i.status === 'sent').length, color: 'primary' },
                { status: 'overdue', count: mockInvoices.filter(i => i.status === 'overdue').length, color: 'destructive' },
                { status: 'draft', count: mockInvoices.filter(i => i.status === 'draft').length, color: 'secondary' },
              ].map(({ status, count, color }) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn(
                      color === 'success' && 'border-success text-success',
                      color === 'primary' && 'border-primary text-primary',
                      color === 'destructive' && 'border-destructive text-destructive',
                      color === 'secondary' && 'border-border text-muted-foreground'
                    )}>
                      {status}
                    </Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Alerts */}
      {overdueAmount > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Overdue Invoices Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{formatCurrency(overdueAmount)} overdue</p>
                <p className="text-sm text-muted-foreground">
                  {mockInvoices.filter(inv => inv.status === 'overdue').length} invoices require immediate attention
                </p>
              </div>
              <Badge variant="destructive">
                Action Required
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-lg font-semibold">{thisMonthInvoices.length}</p>
              <p className="text-sm text-muted-foreground">Invoices This Month</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-lg font-semibold">{formatCurrency(thisMonthRevenue)}</p>
              <p className="text-sm text-muted-foreground">Revenue This Month</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-lg font-semibold">
                {thisMonthInvoices.length > 0 ? (thisMonthRevenue / thisMonthInvoices.length).toFixed(0) : '0'}
              </p>
              <p className="text-sm text-muted-foreground">Avg Invoice Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}