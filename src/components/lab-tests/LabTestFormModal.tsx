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
import { LabTest, Pet, Veterinarian } from '@/types';
import { mockPets, mockVeterinarians } from '@/data/mockData';

interface LabTestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (labTest: Omit<LabTest, 'id'>) => void;
  labTest?: LabTest;
}

const commonTestTypes = [
  'Complete Blood Count (CBC)',
  'Blood Chemistry Panel',
  'Urinalysis',
  'Blood Glucose',
  'Thyroid Function (T4)',
  'Liver Function Tests',
  'Kidney Function Tests',
  'Heartworm Test',
  'Fecal Examination',
  'Skin Scraping',
  'Cytology',
  'Biopsy',
  'X-Ray',
  'Ultrasound',
  'Other'
];

export function LabTestFormModal({ isOpen, onClose, onSave, labTest }: LabTestFormModalProps) {
  const [formData, setFormData] = useState({
    petId: '',
    veterinarianId: '',
    testType: '',
    notes: '',
    status: 'requested' as const
  });

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [customTestType, setCustomTestType] = useState('');
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
    if (labTest) {
      setFormData({
        petId: labTest.petId,
        veterinarianId: labTest.veterinarianId,
        testType: labTest.testType,
        notes: labTest.notes || '',
        status: labTest.status
      });
      setSelectedPet(mockPets.find(p => p.id.toString() === labTest.petId) || null);
      setSelectedVet(mockVeterinarians.find(v => v.id.toString() === labTest.veterinarianId) || null);
      if (!commonTestTypes.includes(labTest.testType)) {
        setCustomTestType(labTest.testType);
        setFormData(prev => ({ ...prev, testType: 'Other' }));
      }
    } else {
      setFormData({
        petId: '',
        veterinarianId: '',
        testType: '',
        notes: '',
        status: 'requested'
      });
      setSelectedPet(null);
      setSelectedVet(null);
      setCustomTestType('');
    }
  }, [labTest, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !selectedVet) return;

    const finalTestType = formData.testType === 'Other' ? customTestType : formData.testType;

    onSave({
      ...formData,
      testType: finalTestType,
      petName: selectedPet.name,
      veterinarianName: `${selectedVet.firstName} ${selectedVet.lastName}`,
      requestedDate: new Date()
    });
    onClose();
  };

  const handlePetSelect = (petId: string) => {
    const pet = mockPets.find(p => p.id.toString() === petId);
    setSelectedPet(pet || null);
    setFormData(prev => ({ ...prev, petId }));
  };

  const handleVetSelect = (vetId: string) => {
    const vet = mockVeterinarians.find(v => v.id.toString() === vetId);
    setSelectedVet(vet || null);
    setFormData(prev => ({ ...prev, veterinarianId: vetId }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {labTest ? 'Edit Lab Test' : 'New Lab Test Request'}
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
                            value={pet.id.toString()}
                            onSelect={() => {
                              handlePetSelect(pet.id.toString());
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
                        <span>{selectedVet.firstName} {selectedVet.lastName}</span>
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
                            value={vet.id.toString()}
                            onSelect={() => {
                              handleVetSelect(vet.id.toString());
                              setVetSearchOpen(false);
                              setVetSearch('');
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{vet.firstName} {vet.lastName}</span>
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
            <Label htmlFor="testType">Test Type *</Label>
            <Select 
              value={formData.testType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, testType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                {commonTestTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.testType === 'Other' && (
            <div className="space-y-2">
              <Label htmlFor="customTestType">Custom Test Type *</Label>
              <Input
                id="customTestType"
                value={customTestType}
                onChange={(e) => setCustomTestType(e.target.value)}
                placeholder="Enter custom test type"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'requested' | 'in-progress' | 'completed' | 'cancelled') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or special instructions"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedPet || !selectedVet || (!formData.testType || (formData.testType === 'Other' && !customTestType))}>
              {labTest ? 'Update' : 'Create'} Test Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}