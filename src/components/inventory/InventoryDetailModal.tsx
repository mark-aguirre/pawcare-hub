import { 
  SlidingPanel,
  SlidingPanelContent,
  SlidingPanelFooter
} from '@/components/ui/sliding-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Calendar, 
  MapPin, 
  DollarSign,
  Truck,
  AlertTriangle,
  Edit,
  Plus,
  Minus,
  BarChart3,
  History,
  Pill,
  Wrench,
  ShoppingCart,
  Heart
} from 'lucide-react';
import { InventoryItem } from '@/types';
import { cn } from '@/lib/utils';

interface InventoryDetailPanelProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (item: InventoryItem) => void;
  onStockAdjustment?: (item: InventoryItem) => void;
}

const statusStyles = {
  'in-stock': 'bg-success/10 text-success border-success/20',
  'low-stock': 'bg-warning/10 text-warning border-warning/20',
  'out-of-stock': 'bg-destructive/10 text-destructive border-destructive/20',
  'expired': 'bg-destructive/10 text-destructive border-destructive/20',
};

const categoryStyles = {
  medication: 'bg-primary/10 text-primary border-primary/20',
  supplies: 'bg-accent/10 text-accent border-accent/20',
  equipment: 'bg-secondary text-secondary-foreground border-border',
  food: 'bg-success/10 text-success border-success/20',
  toys: 'bg-warning/10 text-warning border-warning/20',
  other: 'bg-muted text-muted-foreground border-border',
};

const categoryIcons = {
  medication: Pill,
  supplies: Package,
  equipment: Wrench,
  food: ShoppingCart,
  toys: Heart,
  other: Package,
};

export function InventoryDetailPanel({ item, open, onOpenChange, onEdit, onStockAdjustment }: InventoryDetailPanelProps) {
  if (!item) return null;

  const CategoryIcon = categoryIcons[item.category];
  const stockPercentage = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0;
  const isLowStock = item.currentStock <= item.minStock;
  const isExpiringSoon = item.expiryDate && item.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const totalValue = item.currentStock * item.unitPrice;

  return (
    <SlidingPanel
      open={open}
      onOpenChange={onOpenChange}
      width="xl"
      title={item?.name}
      description={item ? `SKU: ${item.sku} • ${item.supplier}` : undefined}
    >
      <SlidingPanelContent>
        {item && (
          <div className="space-y-6">
            {/* Status Badges */}
            <div className="flex items-center gap-2">
              <Badge className={cn('text-sm', statusStyles[item.status])}>
                {item.status.replace('-', ' ')}
              </Badge>
              <Badge className={cn('text-sm', categoryStyles[item.category])}>
                {item.category}
              </Badge>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stock Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Stock Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Stock</span>
                    <span className={cn(
                      'text-lg font-bold',
                      item.currentStock === 0 ? 'text-destructive' :
                      isLowStock ? 'text-warning' : 'text-success'
                    )}>
                      {item.currentStock}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <Progress value={stockPercentage} className="h-3" />
                    <div 
                      className={cn(
                        'absolute top-0 left-0 h-3 rounded-full transition-all',
                        item.currentStock === 0 ? 'bg-destructive' :
                        isLowStock ? 'bg-warning' : 'bg-success'
                      )}
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Minimum:</span>
                      <span className="ml-2 font-medium">{item.minStock}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Maximum:</span>
                      <span className="ml-2 font-medium">{item.maxStock}</span>
                    </div>
                  </div>

                  {/* Alerts */}
                  {(isLowStock || isExpiringSoon) && (
                    <div className="space-y-2">
                      {isLowStock && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 text-warning">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Stock level is below minimum threshold</span>
                        </div>
                      )}
                      {isExpiringSoon && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-medium">Item expires within 30 days</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Unit Price</span>
                    <span className="text-lg font-bold">${item.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="text-lg font-bold text-success">${totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Supplier</span>
                    <span className="text-sm font-medium">{item.supplier}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            <Separator />

            {/* Location and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Storage
                </h3>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="font-medium">{item.location}</p>
                  <p className="text-sm text-muted-foreground mt-1">Storage Location</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Important Dates
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Restocked:</span>
                    <span>{formatDate(item.lastRestocked)}</span>
                  </div>
                  {item.expiryDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span className={cn(
                        isExpiringSoon ? 'text-destructive font-medium' : ''
                      )}>
                        {formatDate(item.expiryDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Added:</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {onStockAdjustment && (
                  <Button 
                    className="flex items-center gap-2" 
                    variant="outline"
                    onClick={() => onStockAdjustment(item)}
                  >
                    <Plus className="h-4 w-4" />
                    Adjust Stock
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    className="flex items-center gap-2" 
                    variant="outline"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Item
                  </Button>
                )}
                <Button className="flex items-center gap-2" variant="outline">
                  <Truck className="h-4 w-4" />
                  Reorder
                </Button>
                <Button className="flex items-center gap-2" variant="outline">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        )}
      </SlidingPanelContent>

      <SlidingPanelFooter>
        <div className="flex flex-wrap gap-3 w-full">
          {item && onEdit && (
            <Button onClick={() => onEdit(item)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Details
            </Button>
          )}
          {item && onStockAdjustment && (
            <Button onClick={() => onStockAdjustment(item)} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adjust Stock
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Stock History
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Create Purchase Order
          </Button>
        </div>
      </SlidingPanelFooter>
    </SlidingPanel>
  );
}