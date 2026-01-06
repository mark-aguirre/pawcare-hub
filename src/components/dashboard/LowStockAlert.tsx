import { AlertTriangle, Package, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockInventoryItems } from '@/data/mockData';
import { cn } from '@/lib/utils';

const categoryColors = {
  medication: 'bg-destructive/10 text-destructive border-destructive/20',
  supplies: 'bg-warning/10 text-warning border-warning/20',
  equipment: 'bg-primary/10 text-primary border-primary/20',
  food: 'bg-success/10 text-success border-success/20',
  toys: 'bg-accent/10 text-accent border-accent/20',
  other: 'bg-secondary text-secondary-foreground border-border',
};

export function LowStockAlert() {
  const lowStockItems = mockInventoryItems
    .filter(item => item.status === 'low-stock' || item.status === 'out-of-stock')
    .sort((a, b) => {
      // Prioritize out-of-stock items
      if (a.status === 'out-of-stock' && b.status !== 'out-of-stock') return -1;
      if (b.status === 'out-of-stock' && a.status !== 'out-of-stock') return 1;
      // Then sort by stock percentage
      const aPercentage = a.currentStock / a.minStock;
      const bPercentage = b.currentStock / b.minStock;
      return aPercentage - bPercentage;
    })
    .slice(0, 5);

  const criticalCount = lowStockItems.filter(item => item.status === 'out-of-stock').length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'rounded-xl p-2',
            criticalCount > 0 ? 'bg-destructive/10' : 'bg-warning/10'
          )}>
            <AlertTriangle className={cn(
              'h-5 w-5',
              criticalCount > 0 ? 'text-destructive' : 'text-warning'
            )} />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">Inventory Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {criticalCount > 0 ? `${criticalCount} critical items` : 'Low stock items'}
            </p>
          </div>
        </div>
        <a 
          href="/inventory" 
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View inventory
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="space-y-3">
        {lowStockItems.length > 0 ? (
          lowStockItems.map((item, index) => {
            const stockPercentage = item.currentStock / item.minStock;
            const isOutOfStock = item.status === 'out-of-stock';
            
            return (
              <div
                key={item.id}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                {/* Status indicator */}
                <div className={cn(
                  'w-3 h-3 rounded-full',
                  isOutOfStock ? 'bg-destructive animate-pulse' : 'bg-warning'
                )} />

                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                    <Badge variant="secondary" className={cn('text-xs border', categoryColors[item.category])}>
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>SKU: {item.sku}</span>
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Stock info */}
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(
                      'font-bold text-sm',
                      isOutOfStock ? 'text-destructive' : 'text-warning'
                    )}>
                      {item.currentStock}
                    </span>
                    <span className="text-xs text-muted-foreground">/ {item.minStock}</span>
                  </div>
                  <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        isOutOfStock ? 'bg-destructive' : 'bg-warning'
                      )}
                      style={{ width: `${Math.min(stockPercentage * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>All items are well stocked</p>
          </div>
        )}
      </div>
    </div>
  );
}