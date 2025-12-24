import { Clock, User, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  delay?: number;
}

const statusStyles = {
  scheduled: 'bg-secondary text-secondary-foreground border-border',
  'checked-in': 'bg-primary/10 text-primary border-primary/20',
  'in-progress': 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const typeStyles = {
  checkup: 'bg-primary/10 text-primary border-primary/20',
  vaccination: 'bg-success/10 text-success border-success/20',
  surgery: 'bg-destructive/10 text-destructive border-destructive/20',
  grooming: 'bg-accent/10 text-accent border-accent/20',
  emergency: 'bg-destructive/10 text-destructive border-destructive/20',
  'follow-up': 'bg-warning/10 text-warning border-warning/20',
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
      className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-slide-up cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Left color bar */}
      <div className={cn(
        'absolute left-0 top-3 bottom-3 w-1 rounded-full transition-all duration-300',
        appointment.status === 'completed' ? 'bg-success' :
        appointment.status === 'in-progress' ? 'bg-warning' :
        appointment.status === 'cancelled' ? 'bg-destructive' : 'bg-primary'
      )} />
      
      {/* Pet Avatar */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {speciesEmoji[appointment.petSpecies]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-display font-bold text-foreground truncate">{appointment.petName}</h4>
          <Badge variant="secondary" className={cn('text-xs border', typeStyles[appointment.type])}>
            {appointment.type}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {appointment.ownerName}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {appointment.time}
          </span>
        </div>
      </div>

      <div className="text-right flex flex-col items-end gap-1">
        <Badge variant="secondary" className={cn('border font-medium', statusStyles[appointment.status])}>
          {appointment.status.replace('-', ' ')}
        </Badge>
        <p className="text-xs text-muted-foreground">{appointment.veterinarianName}</p>
      </div>
      
      {/* Hover arrow */}
      <ChevronRight className="h-5 w-5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
    </div>
  );
}
