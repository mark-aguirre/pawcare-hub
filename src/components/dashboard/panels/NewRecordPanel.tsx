'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CalendarIcon, FileText, Upload, Paperclip, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockPets, mockVeterinarians } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface NewRecordPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewRecordPanel({ open, onOpenChange }: NewRecordPanelProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [openPetSelect, setOpenPetSelect] = useState(false);
  const [openVetSelect, setOpenVetSelect] = useState(false);
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
    { value: 'vaccination', label: 'Vaccination', color: 'bg-success/10 text-success' },
    { value: 'checkup', label: 'Checkup', color: 'bg-primary/10 text-primary' },
    { value: 'surgery', label: 'Surgery', color: 'bg-destructive/10 text-destructive' },
    { value: 'treatment', label: 'Treatment', color: 'bg-warning/10 text-warning' },
    { value: 'lab-result', label: 'Lab Result', color: 'bg-accent/10 text-accent' },
    { value: 'emergency', label: 'Emergency', color: 'bg-destructive/10 text-destructive' },
    { value: 'follow-up', label: 'Follow-up', color: 'bg-secondary/10 text-secondary-foreground' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      ...formData,
      date,
      attachments: formData.attachments.split(',').map(a => a.trim()).filter(Boolean),
    };

    console.log('New medical record:', recordData);
    
    toast({
      title: "Medical Record Created",
      description: `${formData.title} has been added to ${mockPets.find(p => p.id === formData.petId)?.name}'s medical history.`,
      variant: "default",
    });
    
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[40vw] min-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-primary p-2.5 shadow-glow">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl font-display">Create New Medical Record</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">Add a medical record for a pet</p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Patient & Provider
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pet Selection */}
              <div className="space-y-2">
                <Label htmlFor="pet">Pet *</Label>
                <Popover open={openPetSelect} onOpenChange={setOpenPetSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPetSelect}
                      className="w-full justify-between"
                    >
                      {formData.petId
                        ? mockPets.find((pet) => pet.id === formData.petId)?.name + " (" + mockPets.find((pet) => pet.id === formData.petId)?.species + ") - " + mockPets.find((pet) => pet.id === formData.petId)?.ownerName
                        : "Select a pet"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search pets..." />
                      <CommandList>
                        <CommandEmpty>No pet found.</CommandEmpty>
                        <CommandGroup>
                          {mockPets.map((pet) => (
                            <CommandItem
                              key={pet.id}
                              value={`${pet.name} ${pet.species} ${pet.ownerName}`}
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, petId: pet.id }));
                                setOpenPetSelect(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.petId === pet.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐾'}</span>
                                <div>
                                  <div className="font-medium">{pet.name} ({pet.species})</div>
                                  <div className="text-xs text-muted-foreground">{pet.ownerName}</div>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Veterinarian Selection */}
              <div className="space-y-2">
                <Label htmlFor="veterinarian">Veterinarian *</Label>
                <Popover open={openVetSelect} onOpenChange={setOpenVetSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openVetSelect}
                      className="w-full justify-between"
                    >
                      {formData.veterinarianId
                        ? mockVeterinarians.find((vet) => vet.id === formData.veterinarianId)?.name + " - " + mockVeterinarians.find((vet) => vet.id === formData.veterinarianId)?.specialization
                        : "Select veterinarian"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search veterinarians..." />
                      <CommandList>
                        <CommandEmpty>No veterinarian found.</CommandEmpty>
                        <CommandGroup>
                          {mockVeterinarians.map((vet) => (
                            <CommandItem
                              key={vet.id}
                              value={`${vet.name} ${vet.specialization}`}
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, veterinarianId: vet.id }));
                                setOpenVetSelect(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.veterinarianId === vet.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div>
                                <div className="font-medium">{vet.name}</div>
                                <div className="text-xs text-muted-foreground">{vet.specialization}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Record Details
            </h4>
            
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
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${type.color.split(' ')[0]}`} />
                          {type.label}
                        </div>
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
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Medical Information
            </h4>
            
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
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Attachments (Optional)
            </h4>
            
            <div className="space-y-3">
              <Input
                id="attachments"
                placeholder="File URLs or names (separate multiple with commas)"
                value={formData.attachments}
                onChange={(e) => setFormData(prev => ({ ...prev, attachments: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button type="button" variant="outline" size="sm" className="flex-1">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach Images
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow flex-1"
              disabled={!formData.petId || !formData.veterinarianId || !formData.type || !formData.title || !formData.description}
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Record
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}