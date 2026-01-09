import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  ownerName: string;
}

interface PetSelectProps {
  pets: Pet[];
  value?: string;
  onSelect: (petId: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export function PetSelect({ pets, value, onSelect, placeholder = "Select a pet", loading = false }: PetSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedPet = pets.find(pet => pet.id.toString() === value);

  return (
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
              <span className="text-lg">
                {selectedPet.species.toLowerCase() === 'dog' ? '🐕' : selectedPet.species.toLowerCase() === 'cat' ? '🐱' : selectedPet.species.toLowerCase() === 'bird' ? '🐦' : selectedPet.species.toLowerCase() === 'rabbit' ? '🐰' : selectedPet.species.toLowerCase() === 'hamster' ? '🐹' : '🐾'}
              </span>
              <span>{selectedPet.name} - {selectedPet.ownerName}</span>
            </div>
          ) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command value={selectedPet ? `${selectedPet.name} ${selectedPet.species} ${selectedPet.ownerName}` : ""}>
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
                      onSelect(pet.id.toString());
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === pet.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {pet.species.toLowerCase() === 'dog' ? '🐕' : pet.species.toLowerCase() === 'cat' ? '🐱' : pet.species.toLowerCase() === 'bird' ? '🐦' : pet.species.toLowerCase() === 'rabbit' ? '🐰' : pet.species.toLowerCase() === 'hamster' ? '🐹' : '🐾'}
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
  );
}