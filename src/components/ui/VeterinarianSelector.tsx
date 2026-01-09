import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Veterinarian {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  specialization: string;
}

interface VeterinarianSelectorProps {
  veterinarians: Veterinarian[];
  selectedVetId?: string;
  onVetSelect: (vetId: string) => void;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function VeterinarianSelector({
  veterinarians,
  selectedVetId,
  onVetSelect,
  loading = false,
  label = "Veterinarian",
  placeholder = "Select veterinarian",
  required = false
}: VeterinarianSelectorProps) {
  const [open, setOpen] = useState(false);

  console.log('VeterinarianSelector - veterinarians:', veterinarians, 'selectedVetId:', selectedVetId);

  const selectedVet = veterinarians.find(vet => vet.id.toString() === selectedVetId);

  const getVetDisplayName = (vet: Veterinarian) => {
    if (vet.name) return vet.name;
    if (vet.firstName && vet.lastName) return `${vet.firstName} ${vet.lastName}`;
    return 'Unknown Veterinarian';
  };

  const getVetInitials = (vet: Veterinarian) => {
    if (vet.name) {
      return vet.name.split(' ').map(n => n[0]).join('');
    }
    if (vet.firstName && vet.lastName) {
      return `${vet.firstName[0]}${vet.lastName[0]}`;
    }
    return 'VT';
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
            {selectedVet ? `${getVetDisplayName(selectedVet)} - ${selectedVet.specialization}` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search veterinarians..." />
            <CommandList>
              <CommandEmpty>No veterinarian found.</CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <CommandItem disabled>Loading veterinarians...</CommandItem>
                ) : (
                  veterinarians.map((vet) => (
                    <CommandItem
                      key={vet.id}
                      value={`${getVetDisplayName(vet)} ${vet.specialization}`}
                      onSelect={() => {
                        onVetSelect(vet.id.toString());
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedVetId === vet.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {getVetInitials(vet)}
                        </div>
                        <div>
                          <div className="font-medium">{getVetDisplayName(vet)}</div>
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
  );
}