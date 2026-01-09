import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, Weight, AlertCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Pet } from '@/types';

interface PetCardProps {
  pet: Pet;
  delay?: number;
  onClick?: () => void;
}

const speciesColors = {
  dog: 'bg-primary/10 text-primary border-primary/20',
  cat: 'bg-accent/10 text-accent border-accent/20',
  bird: 'bg-success/10 text-success border-success/20',
  rabbit: 'bg-warning/10 text-warning border-warning/20',
  hamster: 'bg-destructive/10 text-destructive border-destructive/20',
  other: 'bg-secondary text-secondary-foreground border-border',
};

const speciesEmoji = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾',
};

export function PetCard({ pet, delay = 0, onClick }: PetCardProps) {
  const ownerName = pet.owner 
    ? `${pet.owner.firstName} ${pet.owner.lastName}` 
    : (pet as any).ownerName || 'Unknown Owner';
  const age = pet.dateOfBirth ? new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear() : 'Unknown';
  const speciesKey = pet.species.toLowerCase() as keyof typeof speciesColors;
  const displaySpecies = speciesColors[speciesKey] ? speciesKey : 'other';

  return (
    <div
      className="group relative rounded-lg border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-md cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-lg">{speciesEmoji[displaySpecies]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{pet.name}</h3>
              <p className="text-xs text-muted-foreground">{pet.breed || 'Mixed breed'}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 mb-3">
          <Badge variant="secondary" className={cn('text-xs', speciesColors[displaySpecies])}>
            {pet.species}
          </Badge>
          {pet.gender && (
            <Badge variant="outline" className="text-xs">
              {pet.gender === 'Male' ? '♂' : '♀'}
            </Badge>
          )}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{age} years</span>
          {pet.weight && <span>{pet.weight} kg</span>}
        </div>
        
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground truncate">{ownerName}</p>
        </div>
      </div>
    </div>
  );
}
