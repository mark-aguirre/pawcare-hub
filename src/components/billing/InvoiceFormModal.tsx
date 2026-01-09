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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send,
  User,
  PawPrint
} from 'lucide-react';
import { Invoice, InvoiceItem } from '@/types';
import { usePets } from '@/hooks/use-pets';
import { useVeterinarians } from '@/hooks/use-veterinarians';
import { mockBillingSettings } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface InvoiceFormPanelProps {
  invoice?: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (invoice: Partial<Invoice>) => void;
}

const serviceCategories = [
  'consultation',
  'procedure', 
  'medication',
  'supplies',
  'boarding',
  'grooming',
  'other'
] as const;

const defaultItem: Omit<InvoiceItem, 'id'> = {
  description: '',
  category: 'consultation',
  quantity: 1,
  unitPrice: 0,
  total: 0,
};

export function InvoiceFormPanel({ invoice, open, onOpenChange, onSave }: InvoiceFormPanelProps) {
  const { pets, isLoading: petsLoading } = usePets();
  const { veterinarians, isLoading: vetsLoading } = useVeterinarians();
  
  const [formData, setFormData] = useState({
    petId: '',
    ownerId: '',
    veterinarianId: '',
    dueDate: null as Date | null,
    notes: '',
  });
  
  const [items, setItems] = useState<(Omit<InvoiceItem, 'id'> & { tempId: string })[]>([
    { ...defaultItem, tempId: '1' }
  ]);

  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [petSearchOpen, setPetSearchOpen] = useState(false);
  const [vetSearchOpen, setVetSearchOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (invoice) {
      // Edit mode - populate form with existing invoice data
      setFormData({
        petId: invoice.petId?.toString() || '',
        ownerId: invoice.ownerId?.toString() || '',
        veterinarianId: invoice.veterinarianId?.toString() || '',
        dueDate: invoice.dueDate,
        notes: invoice.notes || '',
      });
      
      setItems(invoice.items.map((item, index) => ({
        ...item,
        tempId: `${index + 1}`,
      })));

      const pet = pets.find(p => p.id === invoice.petId);
      setSelectedPet(pet || null);
      setSelectedOwner(pet ? { name: pet.ownerName } : null);
    } else {
      // Create mode - reset form
      const defaultDueDate = new Date(Date.now() + mockBillingSettings.defaultPaymentTerms * 24 * 60 * 60 * 1000);
      setFormData({
        petId: '',
        ownerId: '',
        veterinarianId: '',
        dueDate: defaultDueDate,
        notes: '',
      });
      setItems([{ ...defaultItem, tempId: '1' }]);
      setSelectedPet(null);
      setSelectedOwner(null);
    }
  }, [invoice, open]);

  const handlePetChange = (petId: string) => {
    const pet = pets.find(p => p.id.toString() === petId);
    
    setSelectedPet(pet || null);
    setSelectedOwner(pet ? { name: pet.ownerName } : null);
    setFormData(prev => ({
      ...prev,
      petId,
      ownerId: pet?.ownerId?.toString() || '',
    }));
  };

  const addItem = () => {
    const newTempId = (Math.max(...items.map(i => parseInt(i.tempId))) + 1).toString();
    setItems([...items, { ...defaultItem, tempId: newTempId }]);
  };

  const removeItem = (tempId: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.tempId !== tempId));
    }
  };

  const updateItem = (tempId: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.tempId === tempId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * mockBillingSettings.taxRate;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handleSave = (status: 'draft' | 'sent' = 'draft') => {
    const { subtotal, tax, total } = calculateTotals();
    
    const invoiceData: Partial<Invoice> = {
      ...formData,
      petName: selectedPet?.name || '',
      petSpecies: selectedPet?.species || 'other',
      ownerName: selectedOwner?.name || '',
      ownerEmail: selectedOwner?.email || '',
      veterinarianName: veterinarians.find(v => v.id.toString() === formData.veterinarianId)?.name || '',
      issueDate: new Date(),
      dueDate: formData.dueDate || new Date(),
      items: items.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal,
      tax,
      discount: 0,
      total,
      status,
      createdAt: invoice?.createdAt || new Date(),
    };

    if (!invoice) {
      // New invoice
      invoiceData.id = `inv-${Date.now()}`;
      invoiceData.invoiceNumber = `${mockBillingSettings.invoicePrefix}-${new Date().getFullYear()}-${mockBillingSettings.nextInvoiceNumber.toString().padStart(3, '0')}`;
    }

    onSave(invoiceData);
    onOpenChange(false);
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <SlidingPanel
      open={open}
      onOpenChange={onOpenChange}
      width="2xl"
      title={invoice ? 'Edit Invoice' : 'Create New Invoice'}
    >
      <SlidingPanelContent>
        <div className="space-y-6">
          {/* Client Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pet">Pet *</Label>
              <Popover open={petSearchOpen} onOpenChange={setPetSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={petSearchOpen}
                    className="w-full justify-between"
                  >
                    {selectedPet ? (
                      <div className="flex items-center gap-2">
                        <PawPrint className="h-4 w-4" />
                        {selectedPet.name} ({selectedPet.species}) - {selectedPet.ownerName}
                      </div>
                    ) : (
                      "Select a pet..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search pets..." />
                    <CommandEmpty>{petsLoading ? 'Loading pets...' : 'No pet found.'}</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {pets.map((pet) => (
                        <CommandItem
                          key={pet.id}
                          value={`${pet.name} ${pet.species} ${pet.ownerName || ''} ${pet.breed || ''}`}
                          onSelect={() => {
                            handlePetChange(pet.id.toString());
                            setPetSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPet?.id === pet.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <PawPrint className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{pet.name} ({pet.species})</div>
                              <div className="text-sm text-muted-foreground">{pet.ownerName || 'Unknown Owner'} • {pet.breed || 'Mixed'}</div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="veterinarian">Veterinarian *</Label>
              <Popover open={vetSearchOpen} onOpenChange={setVetSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={vetSearchOpen}
                    className="w-full justify-between"
                  >
                    {formData.veterinarianId ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {veterinarians.find(v => v.id.toString() === formData.veterinarianId)?.name} - {veterinarians.find(v => v.id.toString() === formData.veterinarianId)?.specialization || 'General Practice'}
                      </div>
                    ) : (
                      "Select veterinarian..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search veterinarians..." />
                    <CommandEmpty>{vetsLoading ? 'Loading veterinarians...' : 'No veterinarian found.'}</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {veterinarians.map((vet) => (
                        <CommandItem
                          key={vet.id}
                          value={`${vet.name} ${vet.specialization || ''} ${vet.email}`}
                          onSelect={() => {
                            setFormData(prev => ({ ...prev, veterinarianId: vet.id.toString() }));
                            setVetSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.veterinarianId === vet.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{vet.name}</div>
                              <div className="text-sm text-muted-foreground">{vet.specialization || 'General Practice'} • {vet.email}</div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Client Info Display */}
          {selectedOwner && selectedPet && (
            <div className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-medium mb-2">Client Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Owner:</span> {selectedOwner.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOwner.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOwner.phone}</p>
                </div>
                <div>
                  <p><span className="font-medium">Pet:</span> {selectedPet.name}</p>
                  <p><span className="font-medium">Species:</span> {selectedPet.species}</p>
                  <p><span className="font-medium">Breed:</span> {selectedPet.breed}</p>
                </div>
              </div>
            </div>
          )}

          {/* Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      format(formData.dueDate, "PPP")
                    ) : (
                      <span>Pick a due date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate || undefined}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, dueDate: date || null }));
                      setCalendarOpen(false);
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const today = new Date();
                          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                          setFormData(prev => ({ ...prev, dueDate: nextWeek }));
                          setCalendarOpen(false);
                        }}
                      >
                        +7 days
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const today = new Date();
                          const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                          setFormData(prev => ({ ...prev, dueDate: nextMonth }));
                          setCalendarOpen(false);
                        }}
                      >
                        +30 days
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const today = new Date();
                          const defaultDue = new Date(today.getTime() + mockBillingSettings.defaultPaymentTerms * 24 * 60 * 60 * 1000);
                          setFormData(prev => ({ ...prev, dueDate: defaultDue }));
                          setCalendarOpen(false);
                        }}
                      >
                        Default ({mockBillingSettings.defaultPaymentTerms} days)
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Services & Items</h4>
              <Button onClick={addItem} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.tempId} className="p-6 border border-border rounded-lg bg-card space-y-4">
                  {/* First Row - Description and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Description *</Label>
                      <Input
                        placeholder="Service description"
                        value={item.description}
                        onChange={(e) => updateItem(item.tempId, 'description', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Category</Label>
                      <Select 
                        value={item.category} 
                        onValueChange={(value) => updateItem(item.tempId, 'category', value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              <Badge variant="outline" className="capitalize">
                                {category}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Second Row - Qty, Unit Price, Total, Delete */}
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                      <Label className="text-sm font-medium mb-2 block">Qty</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.tempId, 'quantity', parseInt(e.target.value) || 1)}
                        className="h-10"
                      />
                    </div>

                    <div className="col-span-4">
                      <Label className="text-sm font-medium mb-2 block">Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.tempId, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="h-10"
                      />
                    </div>

                    <div className="col-span-4">
                      <Label className="text-sm font-medium mb-2 block">Total</Label>
                      <Input
                        value={`$${item.total.toFixed(2)}`}
                        readOnly
                        className="bg-secondary h-10 font-medium"
                      />
                    </div>

                    {items.length > 1 && (
                      <div className="col-span-1 flex items-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(item.tempId)}
                          className="text-destructive hover:text-destructive h-10 w-10 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tax ({(mockBillingSettings.taxRate * 100).toFixed(1)}%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or comments..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
        </div>
      </SlidingPanelContent>

      <SlidingPanelFooter>
        <div className="flex flex-wrap gap-3 justify-end w-full">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSave('draft')}
            disabled={!formData.petId || !formData.veterinarianId || items.some(item => !item.description)}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleSave('sent')}
            disabled={!formData.petId || !formData.veterinarianId || items.some(item => !item.description)}
          >
            <Send className="h-4 w-4 mr-2" />
            Save & Send
          </Button>
        </div>
      </SlidingPanelFooter>
    </SlidingPanel>
  );
}