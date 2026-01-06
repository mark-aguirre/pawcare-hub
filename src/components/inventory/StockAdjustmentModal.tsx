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
  Plus, 
  Minus,
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { InventoryItem } from '@/types';
import { cn } from '@/lib/utils';

interface StockAdjustmentPanelProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdjustment: (itemId: string, adjustment: StockAdjustment) => void;
}

interface StockAdjustment {
  type: 'add' | 'remove' | 'set';
  quantity: number;
  reason: string;
  notes?: string;
}

const adjustmentReasons = {
  add: [
    'New Stock Received',
    'Return from Customer',
    'Found Stock',
    'Correction - Count Error',
    'Transfer In',
    'Other'
  ],
  remove: [
    'Sold/Used',
    'Expired',
    'Damaged',
    'Lost/Stolen',
    'Transfer Out',
    'Correction - Count Error',
    'Other'
  ],
  set: [
    'Physical Count',
    'Inventory Audit',
    'System Correction',
    'Other'
  ]
};

export function StockAdjustmentPanel({ item, open, onOpenChange, onAdjustment }: StockAdjustmentPanelProps) {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'set'>('add');
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const handleSubmit = () => {
    if (!reason || quantity <= 0) return;

    onAdjustment(item.id, {
      type: adjustmentType,
      quantity,
      reason,
      notes: notes || undefined
    });

    // Reset form
    setQuantity(0);
    setReason('');
    setNotes('');
    onOpenChange(false);
  };

  const calculateNewStock = () => {
    switch (adjustmentType) {
      case 'add':
        return item.currentStock + quantity;
      case 'remove':
        return Math.max(0, item.currentStock - quantity);
      case 'set':
        return quantity;
      default:
        return item.currentStock;
    }
  };

  const newStock = calculateNewStock();
  const stockDifference = newStock - item.currentStock;
  const isLowStock = newStock <= item.minStock;
  const isOutOfStock = newStock === 0;

  const getAdjustmentIcon = () => {
    switch (adjustmentType) {
      case 'add':
        return <Plus className="h-5 w-5 text-success" />;
      case 'remove':
        return <Minus className="h-5 w-5 text-destructive" />;
      case 'set':
        return <Package className="h-5 w-5 text-primary" />;
    }
  };

  const getStockChangeIndicator = () => {
    if (stockDifference > 0) {
      return (
        <div className="flex items-center gap-1 text-success">
          <TrendingUp className="h-4 w-4" />
          <span>+{stockDifference}</span>
        </div>
      );
    } else if (stockDifference < 0) {
      return (
        <div className="flex items-center gap-1 text-destructive">
          <TrendingDown className="h-4 w-4" />
          <span>{stockDifference}</span>
        </div>
      );
    }
    return null;
  };

  const isFormValid = reason && quantity > 0 && (adjustmentType !== 'remove' || quantity <= item.currentStock);

  return (
    <SlidingPanel
      open={open}
      onOpenChange={onOpenChange}
      width="lg"
      title="Stock Adjustment"
      description={`${item.name} • Current Stock: ${item.currentStock}`}
    >
      <SlidingPanelContent>
        <div className="space-y-6">
          {/* Item Information */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{item.name}</h4>
              <Badge variant="outline">SKU: {item.sku}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current:</span>
                <span className="ml-2 font-medium">{item.currentStock}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Min:</span>
                <span className="ml-2 font-medium">{item.minStock}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max:</span>
                <span className="ml-2 font-medium">{item.maxStock}</span>
              </div>
            </div>
          </div>

          {/* Adjustment Type */}
          <div className="space-y-3">
            <Label>Adjustment Type</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={adjustmentType === 'add' ? 'default' : 'outline'}
                onClick={() => setAdjustmentType('add')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Stock
              </Button>
              <Button
                variant={adjustmentType === 'remove' ? 'default' : 'outline'}
                onClick={() => setAdjustmentType('remove')}
                className="flex items-center gap-2"
              >
                <Minus className="h-4 w-4" />
                Remove Stock
              </Button>
              <Button
                variant={adjustmentType === 'set' ? 'default' : 'outline'}
                onClick={() => setAdjustmentType('set')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Set Stock
              </Button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              {adjustmentType === 'set' ? 'New Stock Level' : 'Quantity'}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              max={adjustmentType === 'remove' ? item.currentStock : undefined}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder={adjustmentType === 'set' ? 'Enter new stock level' : 'Enter quantity'}
            />
            {adjustmentType === 'remove' && quantity > item.currentStock && (
              <p className="text-sm text-destructive">
                Cannot remove more than current stock ({item.currentStock})
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason for adjustment" />
              </SelectTrigger>
              <SelectContent>
                {adjustmentReasons[adjustmentType].map((reasonOption) => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details about this adjustment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Preview */}
          {quantity > 0 && reason && (
            <div className="p-4 border border-border rounded-lg bg-secondary/20">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                {getAdjustmentIcon()}
                Adjustment Preview
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-medium">{item.currentStock}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Adjustment:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {adjustmentType === 'add' && '+'}
                      {adjustmentType === 'remove' && '-'}
                      {adjustmentType === 'set' && 'Set to '}
                      {quantity}
                    </span>
                    {getStockChangeIndicator()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-muted-foreground">New Stock Level:</span>
                  <span className={cn(
                    'text-lg font-bold',
                    isOutOfStock ? 'text-destructive' :
                    isLowStock ? 'text-warning' : 'text-success'
                  )}>
                    {newStock}
                  </span>
                </div>

                {/* Warnings */}
                {isOutOfStock && (
                  <div className="flex items-center gap-2 p-2 rounded bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">This will result in zero stock</span>
                  </div>
                )}
                
                {isLowStock && !isOutOfStock && (
                  <div className="flex items-center gap-2 p-2 rounded bg-warning/10 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Stock will be below minimum threshold</span>
                  </div>
                )}

                {newStock > item.maxStock && (
                  <div className="flex items-center gap-2 p-2 rounded bg-warning/10 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Stock will exceed maximum capacity</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SlidingPanelContent>

      <SlidingPanelFooter>
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Apply Adjustment
          </Button>
        </div>
      </SlidingPanelFooter>
    </SlidingPanel>
  );
}