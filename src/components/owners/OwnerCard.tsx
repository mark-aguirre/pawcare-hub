import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MoreHorizontal, PawPrint, ChevronRight } from 'lucide-react';
import { Owner } from '@/types';
import { mockPets } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface OwnerCardProps {
  owner: Owner;
  delay?: number;
}

export function OwnerCard({ owner, delay = 0 }: OwnerCardProps) {
  const ownerPets = mockPets.filter((pet) => pet.ownerId === owner.id);
  const initials = owner.name.split(' ').map((n) => n[0]).join('');

  return (
    <div
      className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-3 border-primary/20 bg-gradient-primary ring-4 ring-primary/10">
                <AvatarFallback className="text-lg font-bold text-primary-foreground bg-transparent">{initials}</AvatarFallback>
              </Avatar>
              {/* Pet count badge */}
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent border-2 border-card flex items-center justify-center">
                <span className="text-[10px] font-bold text-accent-foreground">{ownerPets.length}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">{owner.name}</h3>
              <p className="text-xs text-muted-foreground">
                Customer since {owner.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2 hover:bg-secondary">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground group/item hover:text-foreground transition-colors cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80">
              <Mail className="h-4 w-4" />
            </div>
            <span className="truncate">{owner.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground group/item hover:text-foreground transition-colors cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80">
              <Phone className="h-4 w-4" />
            </div>
            <span>{owner.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="truncate">{owner.address}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <PawPrint className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{ownerPets.length} pet{ownerPets.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex -space-x-2">
              {ownerPets.slice(0, 3).map((pet) => (
                <Avatar key={pet.id} className="h-9 w-9 border-2 border-card hover:z-10 hover:scale-110 transition-all cursor-pointer">
                  <AvatarFallback className="text-xs bg-secondary font-semibold">{pet.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {ownerPets.length > 3 && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-bold text-primary-foreground hover:scale-110 transition-all cursor-pointer">
                  +{ownerPets.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
