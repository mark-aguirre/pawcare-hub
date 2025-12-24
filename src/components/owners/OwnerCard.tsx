import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MoreHorizontal, PawPrint } from 'lucide-react';
import { Owner } from '@/types';
import { mockPets } from '@/data/mockData';

interface OwnerCardProps {
  owner: Owner;
  delay?: number;
}

export function OwnerCard({ owner, delay = 0 }: OwnerCardProps) {
  const ownerPets = mockPets.filter((pet) => pet.ownerId === owner.id);
  const initials = owner.name.split(' ').map((n) => n[0]).join('');

  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-primary/20 bg-primary/5">
            <AvatarFallback className="text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{owner.name}</h3>
            <p className="text-sm text-muted-foreground">
              Customer since {owner.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{owner.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{owner.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{owner.address}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawPrint className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{ownerPets.length} pet{ownerPets.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex -space-x-2">
            {ownerPets.slice(0, 3).map((pet) => (
              <Avatar key={pet.id} className="h-8 w-8 border-2 border-card">
                <AvatarFallback className="text-xs bg-secondary">{pet.name[0]}</AvatarFallback>
              </Avatar>
            ))}
            {ownerPets.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-medium">
                +{ownerPets.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
