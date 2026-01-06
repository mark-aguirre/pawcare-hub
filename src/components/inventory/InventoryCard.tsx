import { Package, AlertTriangle, Calendar, MapPin, DollarSign, ChevronRight, Pill, Wrench, ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { InventoryItem } from '@/types';

interface InventoryCardProps {
  item: InventoryItem;
  delay?: number;
  onClick?: () => void;
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

export function InventoryCard({ item, delay = 0, onClick }: InventoryCardProps) {
  const CategoryIcon = categoryIcons[item.category];
  
  const stockPercentage = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0;
  const isLowStock = item.currentStock <= item.minStock;
  const isExpiringSoon = item.expiryDate && item.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] animate-slide-up',
        onClick && 'hover:border-primary/40'
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <CategoryIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                SKU: {item.sku}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn('text-xs', statusStyles[item.status])}>
              {item.status.replace('-', ' ')}
            </Badge>
            {onClick && (
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>

          {/* Stock Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stock Level</span>
              <span className={cn(
                'font-medium',
                item.currentStock === 0 ? 'text-destructive' :
                isLowStock ? 'text-warning' : 'text-success'
              )}>
                {item.currentStock} / {item.maxStock}
              </span>
            </div>
            <div className="relative">
              <Progress value={stockPercentage} className="h-2" />
              <div 
                className={cn(
                  'absolute top-0 left-0 h-2 rounded-full transition-all',
                  item.currentStock === 0 ? 'bg-destructive' :
                  isLowStock ? 'bg-warning' : 'bg-success'
                )}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Min: {item.minStock}</span>
              <span>Max: {item.maxStock}</span>
            </div>
          </div>

          {/* Alerts */}
          {(isLowStock || isExpiringSoon) && (
            <div className="flex flex-wrap gap-2">
              {isLowStock && (
                <div className="flex items-center gap-1 text-xs text-warning">
                  <AlertTriangle className="h-3 w-3" />
                  Low Stock
                </div>
              )}
              {isExpiringSoon && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <Calendar className="h-3 w-3" />
                  Expires Soon
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Badge className={cn('text-xs', categoryStyles[item.category])}>
                {item.category}
              </Badge>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${item.unitPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {item.location}
            </div>
          </div>

          {item.expiryDate && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Expires:</span> {formatDate(item.expiryDate)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}