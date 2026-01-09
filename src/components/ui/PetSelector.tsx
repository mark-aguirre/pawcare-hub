import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  ownerName: string;
}

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId?: string;
  onPetSelect: (petId: string) => void;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function PetSelector({
  pets,
  selectedPetId,
  onPetSelect,
  loading = false,
  label = "Pet",
  placeholder = "Select a pet",
  required = false
}: PetSelectorProps) {
  const [open, setOpen] = useState(false);

  console.log('PetSelector - pets:', pets, 'selectedPetId:', selectedPetId);

  const selectedPet = pets.find(pet => pet.id.toString() === selectedPetId);

  const getPetEmoji = (species: string) => {
    switch (species) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🐦';
      case 'rabbit': return '🐰';
      case 'hamster': return '🐹';
      default: return '🐾';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedPet ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">{getPetEmoji(selectedPet.species)}</span>
                <span>{selectedPet.name} - {selectedPet.species}</span>
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search pets..." />
            <CommandList>
              <CommandEmpty>No pet found.</CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <CommandItem disabled>Loading pets...</CommandItem>
                ) : (
                  pets.map((pet) => (
                    <CommandItem
                      key={pet.id}
                      value={`${pet.name} ${pet.species} ${pet.ownerName}`}
                      onSelect={() => {
                        onPetSelect(pet.id.toString());
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedPetId === pet.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPetEmoji(pet.species)}</span>
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
  );
}