"use client";

import { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Save, 
  Package,
  CalendarIcon,
  MapPin,
  DollarSign,
  Truck,
  AlertTriangle
} from 'lucide-react';
import { InventoryItem } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface InventoryFormPanelProps {
  item?: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Partial<InventoryItem>) => void;
}

const categories = [
  'medication',
  'supplies', 
  'equipment',
  'food',
  'toys',
  'other'
] as const;

const locations = [
  'Storage Room A',
  'Storage Room B', 
  'Pharmacy',
  'Surgery Suite',
  'Reception Area',
  'Warehouse',
  'Refrigerated Storage',
  'Controlled Substances'
];

const suppliers = [
  'VetSupply Co.',
  'Medical Distributors Inc.',
  'Pet Pharma Solutions',
  'Veterinary Equipment Ltd.',
  'Animal Care Supplies',
  'Professional Vet Products'
];

export function InventoryFormPanel({ item, open, onOpenChange, onSave }: InventoryFormPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'supplies' as InventoryItem['category'],
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    supplier: '',
    location: '',
    expiryDate: undefined as Date | undefined,
    batchNumber: '',
    notes: ''
  });

  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (item) {
      // Edit mode - populate form with existing item data
      setFormData({
        name: item.name,
        sku: item.sku,
        description: item.description,
        category: item.category,
        currentStock: item.currentStock,
        minStock: item.minStock,
        maxStock: item.maxStock,
        unitPrice: item.unitPrice,
        supplier: item.supplier,
        location: item.location,
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
        batchNumber: item.batchNumber || '',
        notes: item.notes || ''
      });
    } else {
      // Create mode - reset form
      setFormData({
        name: '',
        sku: '',
        description: '',
        category: 'supplies',
        currentStock: 0,
        minStock: 0,
        maxStock: 0,
        unitPrice: 0,
        supplier: '',
        location: '',
        expiryDate: undefined,
        batchNumber: '',
        notes: ''
      });
    }
  }, [item, open]);

  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${timestamp}-${randomNum}`;
  };

  const handleSave = () => {
    const itemData: Partial<InventoryItem> = {
      ...formData,
      expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : undefined,
      status: formData.currentStock === 0 ? 'out-of-stock' : 
              formData.currentStock <= formData.minStock ? 'low-stock' : 'in-stock',
      lastRestocked: new Date().toISOString(),
      createdAt: item?.createdAt || new Date().toISOString(),
    };

    if (!item) {
      // New item
      itemData.sku = formData.sku || generateSKU();
    }

    onSave(itemData);
    onOpenChange(false);
  };

  const isFormValid = formData.name && formData.category && formData.supplier && formData.location;
  const totalValue = formData.currentStock * formData.unitPrice;

  return (
    <SlidingPanel
      open={open}
      onOpenChange={onOpenChange}
      width="xl"
      title={item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
    >
      <SlidingPanelContent>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    placeholder="Auto-generated if empty"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setFormData(prev => ({ ...prev, sku: generateSKU() }))}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter item description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value: InventoryItem['category']) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <Badge variant="outline" className="capitalize">
                          {category}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  placeholder="Enter batch number"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Stock Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxStock">Maximum Stock</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxStock: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {formData.currentStock <= formData.minStock && formData.currentStock > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Current stock is at or below minimum threshold</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price ($)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Total Value</Label>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <span className="text-lg font-bold text-success">
                    ${totalValue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location and Supplier */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Supplier
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Storage Location *</Label>
                <Select value={formData.location} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, location: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Supplier *</Label>
                <Select value={formData.supplier} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, supplier: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          {supplier}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Expiry Date */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Expiry Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry Date (Optional)</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? (
                        format(formData.expiryDate, "PPP")
                      ) : (
                        <span>Pick expiry date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate || undefined}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, expiryDate: date }));
                        setCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Notes</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this item..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        </div>
      </SlidingPanelContent>

      <SlidingPanelFooter>
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
          >
            <Save className="h-4 w-4 mr-2" />
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </SlidingPanelFooter>
    </SlidingPanel>
  );
}