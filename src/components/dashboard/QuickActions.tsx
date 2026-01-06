'use client';

import { useState } from 'react';
import { CalendarPlus, UserPlus, PawPrint, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewAppointmentPanel } from './panels/NewAppointmentPanel';
import { NewPetPanel } from './panels/NewPetPanel';
import { NewOwnerPanel } from './panels/NewOwnerPanel';
import { NewRecordPanel } from './panels/NewRecordPanel';

type PanelType = 'appointment' | 'pet' | 'owner' | 'record' | null;

const actions = [
  {
    id: 'appointment',
    label: 'New Appointment',
    icon: CalendarPlus,
    variant: 'primary' as const,
    description: 'Schedule a new appointment',
  },
  {
    id: 'pet',
    label: 'Register Pet',
    icon: PawPrint,
    variant: 'secondary' as const,
    description: 'Add a new pet to the system',
  },
  {
    id: 'owner',
    label: 'Add Owner',
    icon: UserPlus,
    variant: 'secondary' as const,
    description: 'Register a new pet owner',
  },
  {
    id: 'record',
    label: 'New Record',
    icon: FileText,
    variant: 'secondary' as const,
    description: 'Create a medical record',
  },
];

export function QuickActions() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const handleActionClick = (actionId: string) => {
    setActivePanel(actionId as PanelType);
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '150ms' }}>
        <h3 className="text-sm font-display font-bold text-foreground mb-4 tracking-wide uppercase">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className={cn(
                'group relative h-auto flex-col gap-3 py-5 px-4 rounded-xl border transition-all duration-300 overflow-hidden hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                action.variant === 'primary'
                  ? 'bg-gradient-primary text-primary-foreground border-transparent hover:shadow-glow'
                  : 'bg-secondary/50 text-foreground border-border hover:bg-secondary hover:border-primary/20 hover:shadow-md'
              )}
              title={action.description}
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

      {/* Slide-in Panels */}
      <NewAppointmentPanel 
        open={activePanel === 'appointment'} 
        onOpenChange={(open) => !open && closePanel()} 
      />
      <NewPetPanel 
        open={activePanel === 'pet'} 
        onOpenChange={(open) => !open && closePanel()} 
      />
      <NewOwnerPanel 
        open={activePanel === 'owner'} 
        onOpenChange={(open) => !open && closePanel()} 
      />
      <NewRecordPanel 
        open={activePanel === 'record'} 
        onOpenChange={(open) => !open && closePanel()} 
      />
    </>
  );
}