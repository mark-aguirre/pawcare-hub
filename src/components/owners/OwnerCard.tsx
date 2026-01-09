import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MoreHorizontal, PawPrint, ChevronRight } from 'lucide-react';
import { Owner } from '@/types';
import { cn } from '@/lib/utils';

interface OwnerCardProps {
  owner: Owner;
  delay?: number;
  onClick?: () => void;
}

export function OwnerCard({ owner, delay = 0, onClick }: OwnerCardProps) {
  const ownerPets = owner.pets || [];
  const fullName = `${owner.firstName} ${owner.lastName}`;
  const initials = `${owner.firstName[0]}${owner.lastName[0]}`;
  const createdDate = new Date(owner.createdAt);

  return (
    <div
      className="group relative rounded-lg border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-md cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
              </Avatar>
              {ownerPets.length > 0 && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary-foreground">{ownerPets.length}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{fullName}</h3>
              <p className="text-xs text-muted-foreground">
                Since {createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{owner.email}</span>
          </div>
          {owner.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{owner.phone}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">{ownerPets.length} pet{ownerPets.length !== 1 ? 's' : ''}</span>
          {ownerPets.length > 0 && (
            <div className="flex -space-x-1">
              {ownerPets.slice(0, 2).map((pet) => (
                <Avatar key={pet.id} className="h-6 w-6 border border-card">
                  <AvatarFallback className="text-[10px]">{pet.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {ownerPets.length > 2 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-card bg-muted text-[10px] font-semibold">
                  +{ownerPets.length - 2}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
