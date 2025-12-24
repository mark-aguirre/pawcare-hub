import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, Weight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Pet } from '@/types';

interface PetCardProps {
  pet: Pet;
  delay?: number;
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

export function PetCard({ pet, delay = 0 }: PetCardProps) {
  const hasConditions = pet.conditions.length > 0 || pet.allergies.length > 0;

  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarImage src={pet.photoUrl} alt={pet.name} />
            <AvatarFallback className="text-xl">{speciesEmoji[pet.species]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">{pet.breed}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className={cn(speciesColors[pet.species])}>
          {pet.species}
        </Badge>
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          {pet.gender === 'male' ? '♂ Male' : '♀ Female'}
        </Badge>
        {hasConditions && (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Medical Notes
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{pet.age} years old</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Weight className="h-4 w-4" />
          <span>{pet.weight} kg</span>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Owner</p>
        <p className="text-sm font-medium text-foreground">{pet.ownerName}</p>
      </div>
    </div>
  );
}
