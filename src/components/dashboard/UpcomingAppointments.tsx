import { Clock, Calendar, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpcomingAppointments } from '@/hooks/use-dashboard';
import { cn } from '@/lib/utils';

const speciesEmoji = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾',
};

const typeStyles = {
  checkup: 'bg-primary/10 text-primary border-primary/20',
  vaccination: 'bg-success/10 text-success border-success/20',
  surgery: 'bg-destructive/10 text-destructive border-destructive/20',
  grooming: 'bg-accent/10 text-accent border-accent/20',
  emergency: 'bg-destructive/10 text-destructive border-destructive/20',
  'follow-up': 'bg-warning/10 text-warning border-warning/20',
};

export function UpcomingAppointments() {
  const { appointments, loading, error } = useUpcomingAppointments();

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '150ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-right">
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '150ms' }}>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load upcoming appointments</p>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.slice(0, 4);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '150ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground mb-1">Upcoming Appointments</h3>
          <p className="text-sm text-muted-foreground">Next few days</p>
        </div>
        <a 
          href="/appointments" 
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View all
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="space-y-3">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment, index) => {
            const appointmentDate = new Date(appointment.date);
            return (
              <div
                key={appointment.id}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
                style={{ animationDelay: `${150 + index * 50}ms` }}
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <span className="text-xs font-bold">
                    {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-sm font-bold">
                    {appointmentDate.getDate()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{speciesEmoji[appointment.petSpecies] || '🐾'}</span>
                    <h4 className="font-semibold text-foreground truncate">{appointment.petName}</h4>
                    <Badge variant="secondary" className={cn('text-xs border', typeStyles[appointment.type] || typeStyles.checkup)}>
                      {appointment.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{appointment.ownerName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {appointment.time}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-foreground">{appointment.veterinarianName}</p>
                  <p className="text-xs text-muted-foreground">{appointment.duration} min</p>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming appointments</p>
          </div>
        )}
      </div>
    </div>
  );
}