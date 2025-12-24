import { CalendarPlus, UserPlus, PawPrint, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    label: 'New Appointment',
    icon: CalendarPlus,
    variant: 'default' as const,
    href: '/appointments/new',
  },
  {
    label: 'Register Pet',
    icon: PawPrint,
    variant: 'secondary' as const,
    href: '/pets/new',
  },
  {
    label: 'Add Owner',
    icon: UserPlus,
    variant: 'secondary' as const,
    href: '/owners/new',
  },
  {
    label: 'New Record',
    icon: FileText,
    variant: 'secondary' as const,
    href: '/records/new',
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-slide-up" style={{ animationDelay: '150ms' }}>
      <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto flex-col gap-2 py-4 hover:shadow-md transition-all"
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
