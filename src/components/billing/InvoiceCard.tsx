import { Calendar, User, DollarSign, ChevronRight, Clock, CheckCircle, AlertTriangle, FileText, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Invoice } from '@/types';

interface InvoiceCardProps {
  invoice: Invoice;
  delay?: number;
  onClick?: () => void;
}

const statusStyles = {
  draft: 'bg-secondary text-secondary-foreground border-border',
  sent: 'bg-primary/10 text-primary border-primary/20',
  paid: 'bg-success/10 text-success border-success/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
};

const paymentMethodStyles = {
  cash: 'bg-success/10 text-success border-success/20',
  card: 'bg-primary/10 text-primary border-primary/20',
  check: 'bg-warning/10 text-warning border-warning/20',
  insurance: 'bg-accent/10 text-accent border-accent/20',
  online: 'bg-primary/10 text-primary border-primary/20',
};

const speciesEmoji = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾',
};

export function InvoiceCard({ invoice, delay = 0, onClick }: InvoiceCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isOverdue = invoice.status === 'overdue' || 
    (invoice.status === 'sent' && new Date() > invoice.dueDate);

  const getStatusIcon = () => {
    switch (invoice.status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      case 'sent':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] animate-slide-up',
        onClick && 'hover:border-primary/40',
        isOverdue && 'border-destructive/40'
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              <span className="text-sm">{speciesEmoji[invoice.petSpecies]}</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {invoice.invoiceNumber}
              </h3>
              <p className="text-xs text-muted-foreground">
                {invoice.petName} • {invoice.ownerName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn('text-xs flex items-center gap-1', statusStyles[invoice.status])}>
              {getStatusIcon()}
              {invoice.status}
            </Badge>
            {onClick && (
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Amount</span>
            <span className="text-base font-bold text-foreground">
              {formatCurrency(invoice.total)}
            </span>
          </div>

          {/* Items Summary */}
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}</span>
            {invoice.items.length > 0 && (
              <span className="ml-2">
                • {invoice.items[0].description}
                {invoice.items.length > 1 && ` +${invoice.items.length - 1} more`}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {invoice.status === 'paid' && invoice.paidDate ? 
                  `Paid ${formatDate(invoice.paidDate)}` :
                  `Due ${formatDate(invoice.dueDate)}`
                }
              </div>
              {invoice.paymentMethod && (
                <Badge className={cn('text-xs', paymentMethodStyles[invoice.paymentMethod])}>
                  <CreditCard className="h-3 w-3 mr-1" />
                  {invoice.paymentMethod}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              {invoice.veterinarianName}
            </div>
          </div>

          {/* Overdue Warning */}
          {isOverdue && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs font-medium">
                {invoice.status === 'overdue' ? 'Payment Overdue' : 
                 `${Math.ceil((new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))} days overdue`}
              </span>
            </div>
          )}

          {invoice.notes && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground line-clamp-2">
                <span className="font-medium">Notes:</span> {invoice.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}