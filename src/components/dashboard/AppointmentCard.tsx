import { Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  delay?: number;
}

const statusStyles = {
  scheduled: 'bg-secondary text-secondary-foreground',
  'checked-in': 'bg-primary/10 text-primary',
  'in-progress': 'bg-warning/10 text-warning',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const typeStyles = {
  checkup: 'bg-primary/10 text-primary',
  vaccination: 'bg-success/10 text-success',
  surgery: 'bg-destructive/10 text-destructive',
  grooming: 'bg-accent/10 text-accent',
  emergency: 'bg-destructive/10 text-destructive',
  'follow-up': 'bg-warning/10 text-warning',
};

const speciesEmoji = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾',
};

export function AppointmentCard({ appointment, delay = 0 }: AppointmentCardProps) {
  return (
    <div
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl">
        {speciesEmoji[appointment.petSpecies]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-foreground truncate">{appointment.petName}</h4>
          <Badge variant="secondary" className={cn('text-xs', typeStyles[appointment.type])}>
            {appointment.type}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {appointment.ownerName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {appointment.time}
          </span>
        </div>
      </div>

      <div className="text-right">
        <Badge variant="secondary" className={cn(statusStyles[appointment.status])}>
          {appointment.status.replace('-', ' ')}
        </Badge>
        <p className="mt-1 text-xs text-muted-foreground">{appointment.veterinarianName}</p>
      </div>
    </div>
  );
}
