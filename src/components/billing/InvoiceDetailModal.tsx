import { 
  SlidingPanel,
  SlidingPanelContent,
  SlidingPanelFooter
} from '@/components/ui/sliding-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Receipt, 
  User, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Edit,
  Download,
  Send,
  Trash2
} from 'lucide-react';
import { Invoice } from '@/types';
import { cn } from '@/lib/utils';

interface InvoiceDetailPanelProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (invoice: Invoice) => void;
  onPayment?: (invoice: Invoice) => void;
  onDelete?: (invoiceId: string) => void;
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

const categoryStyles = {
  consultation: 'bg-primary/10 text-primary border-primary/20',
  procedure: 'bg-accent/10 text-accent border-accent/20',
  medication: 'bg-success/10 text-success border-success/20',
  supplies: 'bg-warning/10 text-warning border-warning/20',
  boarding: 'bg-secondary text-secondary-foreground border-border',
  grooming: 'bg-muted text-muted-foreground border-border',
  other: 'bg-muted text-muted-foreground border-border',
};

const speciesEmoji = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾',
};

export function InvoiceDetailPanel({ invoice, open, onOpenChange, onEdit, onPayment, onDelete }: InvoiceDetailPanelProps) {
  if (!invoice) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
        return <CheckCircle className="h-5 w-5" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5" />;
      case 'sent':
        return <Clock className="h-5 w-5" />;
      case 'draft':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <SlidingPanel
      open={open}
      onOpenChange={onOpenChange}
      width="xl"
      title={invoice.invoiceNumber}
      description={`${invoice.petName} • ${invoice.ownerName}`}
    >
      <SlidingPanelContent>
        <div className="space-y-6">
          {/* Status and Payment Method Badges */}
          <div className="flex items-center gap-2">
            <Badge className={cn('text-sm flex items-center gap-1', statusStyles[invoice.status])}>
              {getStatusIcon()}
              {invoice.status}
            </Badge>
            {invoice.paymentMethod && (
              <Badge className={cn('text-sm', paymentMethodStyles[invoice.paymentMethod])}>
                <CreditCard className="h-3 w-3 mr-1" />
                {invoice.paymentMethod}
              </Badge>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground">Invoice Number</span>
                    <span className="font-medium">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span>{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className={cn(isOverdue ? 'text-destructive font-medium' : '')}>
                      {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {invoice.paidDate && (
                    <div className="flex flex-col text-sm">
                      <span className="text-muted-foreground">Paid Date</span>
                      <span className="text-success font-medium">{formatDate(invoice.paidDate)}</span>
                    </div>
                  )}
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground">Veterinarian</span>
                    <span>{invoice.veterinarianName || 'Not assigned'}</span>
                  </div>
                  {invoice.appointmentId && (
                    <div className="flex flex-col text-sm">
                      <span className="text-muted-foreground">Appointment</span>
                      <span className="font-mono text-xs">{invoice.appointmentId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="font-medium">{invoice.ownerName}</span>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span>{invoice.ownerEmail || 'Not provided'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground">Pet</span>
                    <span>{invoice.petName} ({invoice.petSpecies || 'Unknown'})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services & Items</h3>
            
            <div className="space-y-3">
              {invoice.items.map((item) => (
                <div key={item.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={cn('text-xs', categoryStyles[item.category])}>
                          {item.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.total)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Invoice Totals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <span className="text-success">-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax:</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Notes</h3>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {invoice.notes}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Overdue Warning */}
          {isOverdue && (
            <>
              <Separator />
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Payment Overdue</p>
                  <p className="text-sm text-muted-foreground">
                    This invoice is {Math.ceil((new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))} days past due.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </SlidingPanelContent>

      <SlidingPanelFooter>
        <div className="flex flex-wrap gap-3 w-full">
          {onEdit && (
            <Button onClick={() => onEdit(invoice)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          {onPayment && invoice.status !== 'paid' && (
            <Button onClick={() => onPayment(invoice)} variant="outline" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send
          </Button>
          {onDelete && invoice.status === 'draft' && (
            <Button 
              variant="outline" 
              onClick={() => onDelete(invoice.id)}
              className="flex items-center gap-2 text-destructive hover:text-destructive ml-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </SlidingPanelFooter>
    </SlidingPanel>
  );
}