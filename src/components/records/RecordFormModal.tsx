'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, FileText, Upload, X, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockPets, mockVeterinarians } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { MedicalRecord } from '@/types';

interface RecordFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: MedicalRecord | null;
  mode?: 'create' | 'edit';
}

export function RecordFormModal({ open, onOpenChange, record, mode = 'create' }: RecordFormModalProps) {
  const [date, setDate] = useState<Date>(record?.date || new Date());
  const [formData, setFormData] = useState({
    petId: record?.petId || '',
    veterinarianId: record?.veterinarianId || '',
    type: record?.type || '',
    title: record?.title || '',
    description: record?.description || '',
    notes: record?.notes || '',
    status: record?.status || 'pending',
  });
  const [attachments, setAttachments] = useState<string[]>(record?.attachments || []);
  const [newAttachment, setNewAttachment] = useState('');
  const [petSearchOpen, setPetSearchOpen] = useState(false);
  const [vetSearchOpen, setVetSearchOpen] = useState(false);
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

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ];

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setAttachments(prev => [...prev, newAttachment.trim()]);
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPet = mockPets.find(p => p.id === formData.petId);
    const selectedVet = mockVeterinarians.find(v => v.id === formData.veterinarianId);
    
    if (!selectedPet || !selectedVet) {
      toast({
        title: "Error",
        description: "Please select both a pet and veterinarian.",
        variant: "destructive",
      });
      return;
    }

    const recordData = {
      id: record?.id || `record-${Date.now()}`,
      ...formData,
      petName: selectedPet.name,
      petSpecies: selectedPet.species,
      ownerId: selectedPet.ownerId,
      ownerName: selectedPet.ownerName,
      veterinarianName: selectedVet.name,
      date,
      attachments: attachments.length > 0 ? attachments : undefined,
      createdAt: record?.createdAt || new Date(),
    };

    console.log(`${mode === 'create' ? 'Creating' : 'Updating'} medical record:`, recordData);
    
    toast({
      title: `Medical Record ${mode === 'create' ? 'Created' : 'Updated'}`,
      description: `${formData.title} has been ${mode === 'create' ? 'added to' : 'updated for'} ${selectedPet.name}'s medical history.`,
      variant: "default",
    });
    
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      petId: '',
      veterinarianId: '',
      type: '',
      title: '',
      description: '',
      notes: '',
      status: 'pending',
    });
    setAttachments([]);
    setNewAttachment('');
    setDate(new Date());
    setPetSearchOpen(false);
    setVetSearchOpen(false);
  };

  const handleClose = () => {
    if (mode === 'create') {
      resetForm();
    } else {
      setPetSearchOpen(false);
      setVetSearchOpen(false);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {mode === 'create' ? 'Create New Medical Record' : 'Edit Medical Record'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    {formData.petId
                      ? (() => {
                          const pet = mockPets.find(p => p.id === formData.petId);
                          return pet ? `${pet.name} (${pet.species}) - ${pet.ownerName}` : "Select a pet";
                        })()
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
                              setPetSearchOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.petId === pet.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : pet.species === 'bird' ? '🐦' : pet.species === 'rabbit' ? '🐰' : pet.species === 'hamster' ? '🐹' : '🐾'}
                              </span>
                              <div>
                                <div className="font-medium">{pet.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {pet.species} • {pet.breed} • {pet.ownerName}
                                </div>
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
                    {formData.veterinarianId
                      ? (() => {
                          const vet = mockVeterinarians.find(v => v.id === formData.veterinarianId);
                          return vet ? `${vet.name} - ${vet.specialization}` : "Select veterinarian";
                        })()
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
                              setVetSearchOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.veterinarianId === vet.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                {vet.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{vet.name}</div>
                                <div className="text-sm text-muted-foreground">{vet.specialization}</div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="type">Record Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
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

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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

          <div className="space-y-3">
            <Label>Attachments</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter file name or URL"
                value={newAttachment}
                onChange={(e) => setNewAttachment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttachment())}
              />
              <Button type="button" variant="outline" onClick={handleAddAttachment}>
                Add
              </Button>
              <Button type="button" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {attachment}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveAttachment(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow"
              disabled={!formData.petId || !formData.veterinarianId || !formData.type || !formData.title || !formData.description}
            >
              <FileText className="mr-2 h-4 w-4" />
              {mode === 'create' ? 'Create Record' : 'Update Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}