'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PawPrint, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useCreatePet } from '@/hooks/use-pets';
import { useOwners } from '@/hooks/use-owners';

interface NewPetPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPetPanel({ open, onOpenChange }: NewPetPanelProps) {
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
  const createPet = useCreatePet();
  const { data: owners = [] } = useOwners();

  const species = [
    { value: 'dog', label: 'Dog 🐕' },
    { value: 'cat', label: 'Cat 🐱' },
    { value: 'bird', label: 'Bird 🐦' },
    { value: 'rabbit', label: 'Rabbit 🐰' },
    { value: 'hamster', label: 'Hamster 🐹' },
    { value: 'other', label: 'Other 🐾' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const petData = {
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

      await createPet.mutateAsync(petData);
      
      toast({
        title: "Pet Registered",
        description: `${formData.name} has been successfully registered.`,
      });
      
      setFormData({
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
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register pet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[40vw] min-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-primary p-2.5 shadow-glow">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl font-display">Register New Pet</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">Add a new pet to the system</p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pet Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter pet's name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {/* Owner Selection */}
              <div className="space-y-2">
                <Label htmlFor="owner">Owner *</Label>
                <Popover open={openOwnerSelect} onOpenChange={setOpenOwnerSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openOwnerSelect}
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

              {/* Species and Breed */}
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
                    placeholder="Enter breed"
                    value={formData.breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Physical Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>

              {/* Gender */}
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

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Weight"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
            </div>

            {/* Color and Microchip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color/Markings</Label>
                <Input
                  id="color"
                  placeholder="Describe pet's color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="microchipId">Microchip ID</Label>
                <Input
                  id="microchipId"
                  placeholder="Microchip number"
                  value={formData.microchipId}
                  onChange={(e) => setFormData(prev => ({ ...prev, microchipId: e.target.value }))}
                />
              </div>
            </div>
          </div>



          <div className="flex gap-3 pt-6 border-t border-border">
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow flex-1"
              disabled={!formData.name || !formData.species || !formData.gender || !formData.ownerId || createPet.isPending}
            >
              {createPet.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PawPrint className="mr-2 h-4 w-4" />
              )}
              {createPet.isPending ? 'Registering...' : 'Register Pet'}
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