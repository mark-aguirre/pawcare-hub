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
  PENDING: 'bg-orange-100 text-orange-800 border-orange-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  ARCHIVED: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-orange-100 text-orange-800 border-orange-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200',
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
        'group cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-primary/40 animate-slide-up',
        onClick && 'hover:bg-accent/5'
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm">{speciesEmoji[record.petSpecies]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {record.title}
                </h3>
                <Badge className={cn('text-xs px-1.5 py-0.5', statusStyles[record.status.toLowerCase()])}>
                  {record.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{record.petName} • {record.ownerName}</span>
              </div>
            </div>
          </div>
          {onClick && (
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          )}
        </div>
        
        {record.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
            {record.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Badge className={cn('text-xs px-1.5 py-0.5', typeStyles[record.type])}>
              {record.type.replace('-', ' ')}
            </Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(record.date)}
            </span>
          </div>
          <span className="flex items-center gap-1 truncate">
            <Stethoscope className="h-3 w-3" />
            {record.veterinarianName}
          </span>
        </div>
        
        {record.notes && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
            <span className="font-medium">Notes:</span> {record.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}