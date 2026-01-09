import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Veterinarian {
  id: number;
  name: string;
  specialization: string;
}

interface VeterinarianSelectProps {
  veterinarians: Veterinarian[];
  value?: string;
  onSelect: (vetId: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export function VeterinarianSelect({ veterinarians, value, onSelect, placeholder = "Select veterinarian", loading = false }: VeterinarianSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedVet = veterinarians.find(vet => vet.id.toString() === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedVet ? `${selectedVet.name} - ${selectedVet.specialization}` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command value={selectedVet ? `${selectedVet.name} ${selectedVet.specialization}` : ""}>
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
                    value={`${vet.name} ${vet.specialization}`}
                    onSelect={() => {
                      onSelect(vet.id.toString());
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === vet.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {vet.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{vet.name}</div>
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
  );
}