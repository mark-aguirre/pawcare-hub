'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { PawPrint, Upload, Check, ChevronsUpDown } from 'lucide-react';
import { mockOwners } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface NewPetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPetModal({ open, onOpenChange }: NewPetModalProps) {
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
  const [ownerOpen, setOwnerOpen] = useState(false);
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
    
    // Convert form data to proper types
    const petData = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
      conditions: formData.conditions.split(',').map(c => c.trim()).filter(Boolean),
    };

    // Here you would typically send the data to your API
    console.log('New pet:', petData);
    
    // Show success toast
    toast({
      title: "Pet Registered",
      description: `${formData.name} has been successfully registered in the system.`,
      variant: "default",
    });
    
    // Reset form and close modal
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            Register New Pet
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Popover open={ownerOpen} onOpenChange={setOwnerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={ownerOpen}
                    className="w-full justify-between"
                  >
                    {formData.ownerId
                      ? mockOwners.find((owner) => owner.id === formData.ownerId)?.name
                      : "Select owner..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search owners..." />
                    <CommandEmpty>No owner found.</CommandEmpty>
                    <CommandGroup>
                      {mockOwners.map((owner) => (
                        <CommandItem
                          key={owner.id}
                          value={`${owner.name} ${owner.email}`}
                          onSelect={() => {
                            setFormData(prev => ({ ...prev, ownerId: owner.id }));
                            setOwnerOpen(false);
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
                            <div className="text-sm text-muted-foreground">{owner.email}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Species */}
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

            {/* Breed */}
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
                  <SelectValue placeholder="Select gender" />
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

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <div className="flex items-center gap-3">
              <Input
                id="photo"
                placeholder="Photo URL (optional)"
                value={formData.photoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow"
              disabled={!formData.name || !formData.species || !formData.age || !formData.gender || !formData.ownerId}
            >
              <PawPrint className="mr-2 h-4 w-4" />
              Register Pet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}