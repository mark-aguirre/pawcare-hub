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
  const ownerName = pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : 'Unknown Owner';
  const age = pet.dateOfBirth ? new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear() : 'Unknown';
  const speciesKey = pet.species.toLowerCase() as keyof typeof speciesColors;
  const displaySpecies = speciesColors[speciesKey] ? speciesKey : 'other';

  return (
    <div
      className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 animate-slide-up cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-3 border-border group-hover:border-primary/30 transition-colors ring-4 ring-secondary/50">
                <AvatarFallback className="text-2xl bg-secondary">{speciesEmoji[displaySpecies]}</AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-card flex items-center justify-center">
                <Heart className="h-2.5 w-2.5 text-white fill-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.breed || 'Mixed breed'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2 hover:bg-secondary">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className={cn('border font-semibold', speciesColors[displaySpecies])}>
            {pet.species}
          </Badge>
          {pet.gender && (
            <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground border-border font-medium">
              {pet.gender === 'Male' ? '♂ Male' : '♀ Female'}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">{age} years</span>
          </div>
          {pet.weight && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
              <Weight className="h-4 w-4 text-primary" />
              <span className="font-medium">{pet.weight} kg</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Owner</p>
          <p className="text-sm font-semibold text-foreground">{ownerName}</p>
        </div>
      </div>
    </div>
  );
}
