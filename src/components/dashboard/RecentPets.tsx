import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockPets } from '@/data/mockData';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function RecentPets() {
  const recentPets = mockPets.slice(0, 5);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-bold text-foreground tracking-wide uppercase">Recent Pets</h3>
        <a 
          href="/pets" 
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View all
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
      <div className="space-y-2">
        {recentPets.map((pet, index) => (
          <div
            key={pet.id}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/80 transition-all duration-200 cursor-pointer"
            style={{ animationDelay: `${200 + index * 50}ms` }}
          >
            <Avatar className="h-11 w-11 border-2 border-border group-hover:border-primary/30 transition-colors">
              <AvatarImage src={pet.photoUrl} alt={pet.name} />
              <AvatarFallback className="text-lg bg-secondary">{speciesEmoji[pet.species]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{pet.name}</p>
              <p className="text-xs text-muted-foreground">{pet.ownerName}</p>
            </div>
            <Badge variant="secondary" className={cn('text-[10px] font-semibold border', speciesColors[pet.species])}>
              {pet.species}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
