import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  Stethoscope, 
  FileText, 
  Clock,
  Edit,
  Download,
  Share,
  Archive
} from 'lucide-react';
import { MedicalRecord } from '@/types';
import { cn } from '@/lib/utils';

interface RecordDetailModalProps {
  record: MedicalRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (record: MedicalRecord) => void;
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

export function RecordDetailModal({ record, open, onOpenChange, onEdit }: RecordDetailModalProps) {
  if (!record) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <span className="text-xl">{speciesEmoji[record.petSpecies]}</span>
              </div>
              <div>
                <DialogTitle className="text-xl">{record.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {record.petName} • {record.ownerName}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn('text-sm', statusStyles[record.status])}>
                {record.status}
              </Badge>
              <Badge className={cn('text-sm', typeStyles[record.type])}>
                {record.type.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>
                <span>{formatDate(record.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Time:</span>
                <span>{formatTime(record.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Veterinarian:</span>
                <span>{record.veterinarianName}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Pet:</span>
                <span>{record.petName} ({record.petSpecies})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Record ID:</span>
                <span className="font-mono text-xs">{record.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created:</span>
                <span>{formatDate(record.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {record.description}
            </p>
          </div>

          {/* Notes */}
          {record.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Clinical Notes</h3>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {record.notes}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Attachments */}
          {record.attachments && record.attachments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Attachments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {record.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachment}</p>
                        <p className="text-xs text-muted-foreground">PDF Document</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button className="flex items-center gap-2" onClick={() => onEdit && record && onEdit(record)}>
              <Edit className="h-4 w-4" />
              Edit Record
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
            {record && record.status !== 'archived' && (
              <Button variant="outline" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Archive
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}