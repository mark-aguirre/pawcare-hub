'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PawPrint, Upload, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockOwners } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

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
    age: '',
    gender: '',
    weight: '',
    color: '',
    ownerId: '',
    allergies: '',
    conditions: '',
    photoUrl: '',
  });
  const { toast } = useToast();

  const species = [
    { value: 'dog', label: 'Dog 🐕' },
    { value: 'cat', label: 'Cat 🐱' },
    { value: 'bird', label: 'Bird 🐦' },
    { value: 'rabbit', label: 'Rabbit 🐰' },
    { value: 'hamster', label: 'Hamster 🐹' },
    { value: 'other', label: 'Other 🐾' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const petData = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
      conditions: formData.conditions.split(',').map(c => c.trim()).filter(Boolean),
    };

    console.log('New pet:', petData);
    
    toast({
      title: "Pet Registered",
      description: `${formData.name} has been successfully registered in the system.`,
      variant: "default",
    });
    
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      gender: '',
      weight: '',
      color: '',
      ownerId: '',
      allergies: '',
      conditions: '',
      photoUrl: '',
    });
    onOpenChange(false);
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
                        ? mockOwners.find((owner) => owner.id === formData.ownerId)?.name
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
                          {mockOwners.map((owner) => (
                            <CommandItem
                              key={owner.id}
                              value={`${owner.name} ${owner.email}`}
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, ownerId: owner.id }));
                                setOpenOwnerSelect(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.ownerId === owner.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div>
                                <div className="font-medium">{owner.name}</div>
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
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="30"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  required
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

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">Color/Markings</Label>
              <Input
                id="color"
                placeholder="Describe pet's color and markings"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Medical Information
            </h4>
            
            {/* Allergies */}
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Input
                id="allergies"
                placeholder="Separate multiple allergies with commas"
                value={formData.allergies}
                onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
              />
            </div>

            {/* Medical Conditions */}
            <div className="space-y-2">
              <Label htmlFor="conditions">Medical Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="List any existing medical conditions (separate with commas)"
                value={formData.conditions}
                onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <div className="flex gap-3">
              <Input
                id="photo"
                placeholder="Photo URL (optional)"
                value={formData.photoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow flex-1"
              disabled={!formData.name || !formData.species || !formData.age || !formData.gender || !formData.ownerId}
            >
              <PawPrint className="mr-2 h-4 w-4" />
              Register Pet
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