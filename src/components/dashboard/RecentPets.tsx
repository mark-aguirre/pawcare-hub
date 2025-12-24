import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockPets } from '@/data/mockData';

const speciesColors = {
  dog: 'bg-primary/10 text-primary',
  cat: 'bg-accent/10 text-accent',
  bird: 'bg-success/10 text-success',
  rabbit: 'bg-warning/10 text-warning',
  hamster: 'bg-destructive/10 text-destructive',
  other: 'bg-secondary text-secondary-foreground',
};

export function RecentPets() {
  const recentPets = mockPets.slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Pets</h3>
        <a href="/pets" className="text-xs text-primary hover:underline">View all</a>
      </div>
      <div className="space-y-3">
        {recentPets.map((pet, index) => (
          <div
            key={pet.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={pet.photoUrl} alt={pet.name} />
              <AvatarFallback>{pet.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{pet.name}</p>
              <p className="text-xs text-muted-foreground">{pet.ownerName}</p>
            </div>
            <Badge variant="secondary" className={speciesColors[pet.species]}>
              {pet.species}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
