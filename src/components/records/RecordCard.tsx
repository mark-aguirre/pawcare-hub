import { Calendar, User, Stethoscope, FileText, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MedicalRecord } from '@/types';

interface RecordCardProps {
  record: MedicalRecord;
  delay?: number;
  onClick?: () => void;
}

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-success/10 text-success border-success/20',
  archived: 'bg-secondary text-secondary-foreground border-border',
};

const typeStyles = {
  checkup: 'bg-primary/10 text-primary border-primary/20',
  vaccination: 'bg-success/10 text-success border-success/20',
  surgery: 'bg-destructive/10 text-destructive border-destructive/20',
  treatment: 'bg-accent/10 text-accent border-accent/20',
  'lab-result': 'bg-warning/10 text-warning border-warning/20',
  emergency: 'bg-destructive/10 text-destructive border-destructive/20',
  'follow-up': 'bg-secondary text-secondary-foreground border-border',
};

const speciesEmoji = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾',
};

export function RecordCard({ record, delay = 0, onClick }: RecordCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] animate-slide-up',
        onClick && 'hover:border-primary/40'
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <span className="text-lg">{speciesEmoji[record.petSpecies]}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {record.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {record.petName} • {record.ownerName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn('text-xs', statusStyles[record.status])}>
              {record.status}
            </Badge>
            {onClick && (
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {record.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Badge className={cn('text-xs', typeStyles[record.type])}>
                  {record.type.replace('-', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(record.date)}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Stethoscope className="h-3 w-3" />
              {record.veterinarianName}
            </div>
          </div>

          {record.notes && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground line-clamp-2">
                <span className="font-medium">Notes:</span> {record.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}