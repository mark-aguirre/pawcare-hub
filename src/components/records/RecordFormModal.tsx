import { useState, useEffect } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { MedicalRecord } from '@/types';
import { useRecords } from '@/hooks/use-records';

interface RecordFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: MedicalRecord | null;
  mode?: 'create' | 'edit';
  preSelectedPetId?: string;
}

export function RecordFormModal({ open, onOpenChange, record, mode = 'create', preSelectedPetId }: RecordFormModalProps) {
  const [date, setDate] = useState<Date>(record?.date || new Date());
  const [formData, setFormData] = useState({
    petId: record?.petId || preSelectedPetId || '',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createRecord, updateRecord } = useRecords();
  
  const [pets, setPets] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [vetsLoading, setVetsLoading] = useState(false);

  // Update form data when preSelectedPetId changes
  useEffect(() => {
    if (preSelectedPetId && mode === 'create') {
      setFormData(prev => ({ ...prev, petId: preSelectedPetId }));
    }
  }, [preSelectedPetId, mode]);

  // Fetch pets and veterinarians when modal opens
  useEffect(() => {
    console.log('Modal open state changed:', open);
    if (open) {
      console.log('Fetching pets...');
      setPetsLoading(true);
      fetch('/api/pets')
        .then(res => {
          console.log('Pets response:', res);
          return res.json();
        })
        .then(data => {
          console.log('Pets data:', data);
          setPets(data);
          setPetsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch pets:', err);
          setPetsLoading(false);
        });

      console.log('Fetching veterinarians...');
      setVetsLoading(true);
      fetch('/api/veterinarians')
        .then(res => {
          console.log('Vets response:', res);
          return res.json();
        })
        .then(data => {
          console.log('Vets data:', data);
          setVeterinarians(data);
          setVetsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch veterinarians:', err);
          setVetsLoading(false);
        });
    }
  }, [open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const selectedPet = pets.find(p => p.id.toString() === formData.petId);
      const selectedVet = veterinarians.find(v => v.id.toString() === formData.veterinarianId);
      
      if (!selectedPet || !selectedVet) {
        toast({
          title: "Error",
          description: "Please select both a pet and veterinarian.",
          variant: "destructive",
        });
        return;
      }

      const recordData = {
        ...formData,
        petName: selectedPet.name,
        petSpecies: selectedPet.species,
        ownerId: selectedPet.ownerId,
        ownerName: selectedPet.ownerName,
        veterinarianName: selectedVet.name,
        date,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      if (mode === 'create') {
        await createRecord(recordData);
      } else if (record) {
        await updateRecord(record.id, recordData);
      }
      
      toast({
        title: `Medical Record ${mode === 'create' ? 'Created' : 'Updated'}`,
        description: `${formData.title} has been ${mode === 'create' ? 'added to' : 'updated for'} ${selectedPet.name}'s medical history.`,
        variant: "default",
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} medical record.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      petId: preSelectedPetId || '',
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
                    onClick={() => {
                      console.log('Pet dropdown clicked, fetching pets...');
                      if (pets.length === 0) {
                        setPetsLoading(true);
                        fetch('/api/pets')
                          .then(res => res.json())
                          .then(data => {
                            console.log('Pets data:', data);
                            setPets(data);
                            setPetsLoading(false);
                          })
                          .catch(err => {
                            console.error('Failed to fetch pets:', err);
                            setPetsLoading(false);
                          });
                      }
                    }}
                  >
                    {formData.petId
                      ? (() => {
                          const pet = pets.find(p => p.id.toString() === formData.petId);
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
                        {petsLoading ? (
                          <CommandItem disabled>Loading pets...</CommandItem>
                        ) : (
                          pets.map((pet) => (
                            <CommandItem
                              key={pet.id}
                              value={`${pet.name} ${pet.species} ${pet.ownerName}`}
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, petId: pet.id.toString() }));
                                setPetSearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.petId === pet.id.toString() ? "opacity-100" : "opacity-0"
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
                          ))
                        )}
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
                          const vet = veterinarians.find(v => v.id.toString() === formData.veterinarianId);
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
                        {vetsLoading ? (
                          <CommandItem disabled>Loading veterinarians...</CommandItem>
                        ) : (
                          veterinarians.map((vet) => (
                            <CommandItem
                              key={vet.id}
                              value={`${vet.name} ${vet.specialization}`}
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
                          ))
                        )}
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
              disabled={!formData.petId || !formData.veterinarianId || !formData.type || !formData.title || !formData.description || isSubmitting}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Record' : 'Update Record')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}