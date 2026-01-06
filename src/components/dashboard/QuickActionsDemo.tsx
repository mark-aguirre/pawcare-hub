'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, UserPlus, PawPrint, FileText, CheckCircle, X } from 'lucide-react';

interface DemoAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  fields: string[];
}

const demoActions: DemoAction[] = [
  {
    id: 'appointment',
    label: 'New Appointment',
    icon: CalendarPlus,
    description: 'Schedule appointments with comprehensive form validation',
    fields: ['Pet Selection', 'Veterinarian', 'Date & Time', 'Appointment Type', 'Duration', 'Notes'],
  },
  {
    id: 'pet',
    label: 'Register Pet',
    icon: PawPrint,
    description: 'Add new pets with detailed information and medical history',
    fields: ['Pet Name', 'Owner', 'Species & Breed', 'Age & Weight', 'Allergies', 'Medical Conditions'],
  },
  {
    id: 'owner',
    label: 'Add Owner',
    icon: UserPlus,
    description: 'Register new pet owners with contact and emergency information',
    fields: ['Full Name', 'Email & Phone', 'Address', 'Emergency Contact', 'Additional Notes'],
  },
  {
    id: 'record',
    label: 'New Record',
    icon: FileText,
    description: 'Create detailed medical records with attachments',
    fields: ['Pet & Veterinarian', 'Record Type', 'Date', 'Description', 'Notes', 'Attachments'],
  },
];

export function QuickActionsDemo() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId);
  };

  const handleActionComplete = (actionId: string) => {
    setCompletedActions(prev => [...prev, actionId]);
    setSelectedAction(null);
  };

  const selectedActionData = demoActions.find(action => action.id === selectedAction);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground mb-1">Quick Actions Demo</h3>
          <p className="text-sm text-muted-foreground">Interactive demonstration of modal functionality</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {completedActions.length}/4 completed
        </Badge>
      </div>

      {!selectedAction ? (
        <div className="grid grid-cols-2 gap-3">
          {demoActions.map((action) => {
            const isCompleted = completedActions.includes(action.id);
            
            return (
              <button
                key={action.id}
                onClick={() => handleActionSelect(action.id)}
                disabled={isCompleted}
                className={`
                  group relative p-4 rounded-xl border transition-all duration-300 text-left
                  ${isCompleted 
                    ? 'bg-success/10 border-success/20 cursor-not-allowed' 
                    : 'bg-secondary/50 border-border hover:bg-secondary hover:border-primary/20 hover:scale-[1.02]'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    rounded-lg p-2 transition-all duration-300
                    ${isCompleted ? 'bg-success text-white' : 'bg-primary/10 text-primary group-hover:scale-110'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <action.icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {action.label}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <selectedActionData!.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{selectedActionData!.label}</h4>
                <p className="text-sm text-muted-foreground">{selectedActionData!.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedAction(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-foreground">Form Fields Available:</h5>
            <div className="grid grid-cols-2 gap-2">
              {selectedActionData!.fields.map((field, index) => (
                <div
                  key={field}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 text-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{field}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => handleActionComplete(selectedAction)}
              className="bg-gradient-primary hover:shadow-glow flex-1"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Action
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedAction(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {completedActions.length === 4 && (
        <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">All Quick Actions Demonstrated!</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            You've explored all the modal functionality available in the Quick Actions component.
          </p>
        </div>
      )}
    </div>
  );
}