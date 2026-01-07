'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Prescription, Pet, Veterinarian } from '@/types';
import { mockPets, mockVeterinarians } from '@/data/mockData';

interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prescription: Omit<Prescription, 'id'>) => void;
  prescription?: Prescription;
}

export function PrescriptionFormModal({ isOpen, onClose, onSave, prescription }: PrescriptionFormModalProps) {
  const [formData, setFormData] = useState({
    petId: '',
    veterinarianId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refillsRemaining: 0,
    notes: '',
    status: 'active' as const
  });

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [petSearchOpen, setPetSearchOpen] = useState(false);
  const [vetSearchOpen, setVetSearchOpen] = useState(false);
  const [petSearch, setPetSearch] = useState('');
  const [vetSearch, setVetSearch] = useState('');

  const filteredPets = mockPets.filter(pet => 
    pet.name.toLowerCase().includes(petSearch.toLowerCase()) ||
    pet.ownerName.toLowerCase().includes(petSearch.toLowerCase())
  );

  const filteredVets = mockVeterinarians.filter(vet => 
    vet.name.toLowerCase().includes(vetSearch.toLowerCase()) ||
    vet.specialization.toLowerCase().includes(vetSearch.toLowerCase())
  );

  useEffect(() => {
    if (prescription) {
      setFormData({
        petId: prescription.petId,
        veterinarianId: prescription.veterinarianId,
        medicationName: prescription.medicationName,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        duration: prescription.duration,
        instructions: prescription.instructions,
        refillsRemaining: prescription.refillsRemaining,
        notes: prescription.notes || '',
        status: prescription.status
      });
      setSelectedPet(mockPets.find(p => p.id === prescription.petId) || null);
      setSelectedVet(mockVeterinarians.find(v => v.id === prescription.veterinarianId) || null);
    } else {
      setFormData({
        petId: '',
        veterinarianId: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        refillsRemaining: 0,
        notes: '',
        status: 'active'
      });
      setSelectedPet(null);
      setSelectedVet(null);
    }
  }, [prescription, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !selectedVet) return;

    onSave({
      ...formData,
      petName: selectedPet.name,
      veterinarianName: selectedVet.name,
      prescribedDate: new Date()
    });
    onClose();
  };

  const handlePetSelect = (petId: string) => {
    const pet = mockPets.find(p => p.id === petId);
    setSelectedPet(pet || null);
    setFormData(prev => ({ ...prev, petId }));
  };

  const handleVetSelect = (vetId: string) => {
    const vet = mockVeterinarians.find(v => v.id === vetId);
    setSelectedVet(vet || null);
    setFormData(prev => ({ ...prev, veterinarianId: vetId }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {prescription ? 'Edit Prescription' : 'New Prescription'}
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
                    {selectedPet ? (
                      <div className="flex items-center gap-2">
                        <span>{selectedPet.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedPet.species}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ({selectedPet.ownerName})
                        </span>
                      </div>
                    ) : (
                      "Select a pet"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search pets..." 
                      value={petSearch}
                      onValueChange={setPetSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No pets found.</CommandEmpty>
                      <CommandGroup>
                        {filteredPets.map((pet) => (
                          <CommandItem
                            key={pet.id}
                            value={pet.id}
                            onSelect={() => {
                              handlePetSelect(pet.id);
                              setPetSearchOpen(false);
                              setPetSearch('');
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span>{pet.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {pet.species}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                ({pet.ownerName})
                              </span>
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
                    {selectedVet ? (
                      <div className="flex flex-col items-start">
                        <span>{selectedVet.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {selectedVet.specialization}
                        </span>
                      </div>
                    ) : (
                      "Select veterinarian"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search veterinarians..." 
                      value={vetSearch}
                      onValueChange={setVetSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No veterinarians found.</CommandEmpty>
                      <CommandGroup>
                        {filteredVets.map((vet) => (
                          <CommandItem
                            key={vet.id}
                            value={vet.id}
                            onSelect={() => {
                              handleVetSelect(vet.id);
                              setVetSearchOpen(false);
                              setVetSearch('');
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{vet.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {vet.specialization}
                              </span>
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

          <div className="space-y-2">
            <Label htmlFor="medicationName">Medication Name *</Label>
            <Input
              id="medicationName"
              value={formData.medicationName}
              onChange={(e) => setFormData(prev => ({ ...prev, medicationName: e.target.value }))}
              placeholder="Enter medication name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 250mg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="Four times daily">Four times daily</SelectItem>
                  <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                  <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 10 days"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions *</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Enter detailed instructions for administration"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refills">Refills Remaining</Label>
              <Input
                id="refills"
                type="number"
                min="0"
                max="10"
                value={formData.refillsRemaining}
                onChange={(e) => setFormData(prev => ({ ...prev, refillsRemaining: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'completed' | 'cancelled') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or special instructions"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedPet || !selectedVet}>
              {prescription ? 'Update' : 'Create'} Prescription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}