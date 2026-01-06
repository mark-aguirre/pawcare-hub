'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockPets, mockVeterinarians } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface NewRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewRecordModal({ open, onOpenChange }: NewRecordModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    petId: '',
    veterinarianId: '',
    type: '',
    title: '',
    description: '',
    notes: '',
    attachments: '',
  });
  const { toast } = useToast();

  const recordTypes = [
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'checkup', label: 'Checkup' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'lab-result', label: 'Lab Result' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'follow-up', label: 'Follow-up' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      ...formData,
      date,
      attachments: formData.attachments.split(',').map(a => a.trim()).filter(Boolean),
    };

    // Here you would typically send the data to your API
    console.log('New medical record:', recordData);
    
    // Show success toast
    toast({
      title: "Medical Record Created",
      description: `${formData.title} has been added to ${mockPets.find(p => p.id === formData.petId)?.name}'s medical history.`,
      variant: "default",
    });
    
    // Reset form and close modal
    setFormData({
      petId: '',
      veterinarianId: '',
      type: '',
      title: '',
      description: '',
      notes: '',
      attachments: '',
    });
    setDate(new Date());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create New Medical Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pet Selection */}
            <div className="space-y-2">
              <Label htmlFor="pet">Pet *</Label>
              <Select value={formData.petId} onValueChange={(value) => setFormData(prev => ({ ...prev, petId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  {mockPets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species}) - {pet.ownerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Veterinarian Selection */}
            <div className="space-y-2">
              <Label htmlFor="veterinarian">Veterinarian *</Label>
              <Select value={formData.veterinarianId} onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarianId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select veterinarian" />
                </SelectTrigger>
                <SelectContent>
                  {mockVeterinarians.map((vet) => (
                    <SelectItem key={vet.id} value={vet.id}>
                      {vet.name} - {vet.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Record Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Record Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief title for this record"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the procedure, examination, or treatment..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations, recommendations, or follow-up instructions..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="space-y-3">
              <Input
                id="attachments"
                placeholder="File URLs or names (separate multiple with commas)"
                value={formData.attachments}
                onChange={(e) => setFormData(prev => ({ ...prev, attachments: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button type="button" variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Attach Images
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow"
              disabled={!formData.petId || !formData.veterinarianId || !formData.type || !formData.title || !formData.description}
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}