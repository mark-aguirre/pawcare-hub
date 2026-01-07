'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PawPrint, Check, ChevronsUpDown, Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useUpdatePet } from '@/hooks/use-pets';
import { useOwners } from '@/hooks/use-owners';
import { Pet } from '@/types';

interface EditPetModalProps {
  pet: Pet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPetModal({ pet, open, onOpenChange }: EditPetModalProps) {
  const [openOwnerSelect, setOpenOwnerSelect] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    dateOfBirth: '',
    gender: '',
    weight: '',
    color: '',
    ownerId: '',
    microchipId: '',
  });
  const { toast } = useToast();
  const updatePet = useUpdatePet();
  const { data: owners = [] } = useOwners();

  const species = [
    { value: 'dog', label: 'Dog 🐕' },
    { value: 'cat', label: 'Cat 🐱' },
    { value: 'bird', label: 'Bird 🐦' },
    { value: 'rabbit', label: 'Rabbit 🐰' },
    { value: 'hamster', label: 'Hamster 🐹' },
    { value: 'other', label: 'Other 🐾' },
  ];

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        dateOfBirth: pet.dateOfBirth || '',
        gender: pet.gender || '',
        weight: pet.weight?.toString() || '',
        color: pet.color || '',
        ownerId: pet.owner?.id?.toString() || '',
        microchipId: pet.microchipId || '',
      });
    }
  }, [pet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;
    
    try {
      const petData = {
        id: pet.id,
        name: formData.name,
        species: formData.species,
        breed: formData.breed || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        color: formData.color || null,
        microchipId: formData.microchipId || null,
        owner: { id: parseInt(formData.ownerId) }
      };

      await updatePet.mutateAsync(petData);
      
      toast({
        title: "Pet Updated",
        description: `${formData.name} has been successfully updated.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pet. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!pet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Owner *</Label>
              <Popover open={openOwnerSelect} onOpenChange={setOpenOwnerSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {formData.ownerId
                      ? owners.find((owner) => owner.id.toString() === formData.ownerId)?.firstName + ' ' + owners.find((owner) => owner.id.toString() === formData.ownerId)?.lastName
                      : "Select owner"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search owners..." />
                    <CommandList>
                      <CommandEmpty>No owner found.</CommandEmpty>
                      <CommandGroup>
                        {owners.map((owner) => (
                          <CommandItem
                            key={owner.id}
                            value={`${owner.firstName} ${owner.lastName} ${owner.email}`}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, ownerId: owner.id.toString() }));
                              setOpenOwnerSelect(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.ownerId === owner.id.toString() ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div>
                              <div className="font-medium">{owner.firstName} {owner.lastName}</div>
                              <div className="text-xs text-muted-foreground">{owner.email}</div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="species">Species *</Label>
              <Select value={formData.species} onValueChange={(value) => setFormData(prev => ({ ...prev, species: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {species.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color/Markings</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="microchipId">Microchip ID</Label>
              <Input
                id="microchipId"
                value={formData.microchipId}
                onChange={(e) => setFormData(prev => ({ ...prev, microchipId: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!formData.name || !formData.species || !formData.gender || !formData.ownerId || updatePet.isPending}
            >
              {updatePet.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {updatePet.isPending ? 'Updating...' : 'Update Pet'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}