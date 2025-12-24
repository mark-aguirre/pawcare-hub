import { CalendarPlus, UserPlus, PawPrint, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const actions = [
  {
    label: 'New Appointment',
    icon: CalendarPlus,
    variant: 'primary' as const,
    gradient: 'bg-gradient-primary',
    href: '/appointments/new',
  },
  {
    label: 'Register Pet',
    icon: PawPrint,
    variant: 'secondary' as const,
    gradient: '',
    href: '/pets/new',
  },
  {
    label: 'Add Owner',
    icon: UserPlus,
    variant: 'secondary' as const,
    gradient: '',
    href: '/owners/new',
  },
  {
    label: 'New Record',
    icon: FileText,
    variant: 'secondary' as const,
    gradient: '',
    href: '/records/new',
  },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '150ms' }}>
      <h3 className="text-sm font-display font-bold text-foreground mb-4 tracking-wide uppercase">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={action.label}
            className={cn(
              'group relative h-auto flex-col gap-3 py-5 px-4 rounded-xl border transition-all duration-300 overflow-hidden',
              action.variant === 'primary'
                ? 'bg-gradient-primary text-primary-foreground border-transparent hover:shadow-glow hover:scale-[1.02]'
                : 'bg-secondary/50 text-foreground border-border hover:bg-secondary hover:border-primary/20'
            )}
          >
            {/* Background pattern for primary */}
            {action.variant === 'primary' && (
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
              </div>
            )}
            
            <div className="relative flex flex-col items-center gap-2">
              <div className={cn(
                'rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110',
                action.variant === 'primary' 
                  ? 'bg-white/20' 
                  : 'bg-primary/10'
              )}>
                <action.icon className={cn(
                  'h-5 w-5',
                  action.variant === 'primary' ? 'text-white' : 'text-primary'
                )} />
              </div>
              <span className="text-xs font-semibold text-center">{action.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
