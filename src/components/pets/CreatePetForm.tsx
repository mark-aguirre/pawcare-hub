import { useState } from 'react';
import { useCreatePet } from '@/hooks/use-pets';
import { useOwners } from '@/hooks/use-owners';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export function CreatePetForm() {
  const { toast } = useToast();
  const { data: owners = [] } = useOwners();
  const createPetMutation = useCreatePet();
  
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    color: '',
    gender: '',
    weight: '',
    ownerId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedOwner = owners.find(owner => owner.id === parseInt(formData.ownerId));
      if (!selectedOwner) {
        toast({
          title: "Error",
          description: "Please select an owner",
          variant: "destructive",
        });
        return;
      }

      await createPetMutation.mutateAsync({
        name: formData.name,
        species: formData.species,
        breed: formData.breed || undefined,
        color: formData.color || undefined,
        gender: formData.gender || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        owner: selectedOwner,
      });

      toast({
        title: "Success",
        description: "Pet created successfully!",
      });

      // Reset form
      setFormData({
        name: '',
        species: '',
        breed: '',
        color: '',
        gender: '',
        weight: '',
        ownerId: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create pet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">Pet Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="species">Species *</Label>
        <Input
          id="species"
          value={formData.species}
          onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value }))}
          placeholder="e.g., Dog, Cat, Bird"
          required
        />
      </div>

      <div>
        <Label htmlFor="breed">Breed</Label>
        <Input
          id="breed"
          value={formData.breed}
          onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
          placeholder="e.g., Golden Retriever"
        />
      </div>

      <div>
        <Label htmlFor="owner">Owner *</Label>
        <Select value={formData.ownerId} onValueChange={(value) => setFormData(prev => ({ ...prev, ownerId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select an owner" />
          </SelectTrigger>
          <SelectContent>
            {owners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id.toString()}>
                {owner.firstName} {owner.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            placeholder="e.g., Brown"
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            placeholder="e.g., 25.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        disabled={createPetMutation.isPending}
        className="w-full"
      >
        {createPetMutation.isPending ? 'Creating...' : 'Create Pet'}
      </Button>
    </form>
  );
}