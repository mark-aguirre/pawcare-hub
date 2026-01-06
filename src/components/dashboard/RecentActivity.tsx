import { Clock, CheckCircle, Calendar, FileText, User, PawPrint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'appointment' | 'record' | 'pet' | 'owner';
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Appointment Completed',
    description: 'Max - Annual wellness exam with Dr. Sarah Chen',
    time: '2 hours ago',
    icon: CheckCircle,
    color: 'text-success',
  },
  {
    id: '2',
    type: 'record',
    title: 'Medical Record Added',
    description: 'Luna - Rabies vaccination record updated',
    time: '3 hours ago',
    icon: FileText,
    color: 'text-primary',
  },
  {
    id: '3',
    type: 'appointment',
    title: 'New Appointment',
    description: 'Charlie - Wing examination scheduled for tomorrow',
    time: '4 hours ago',
    icon: Calendar,
    color: 'text-accent',
  },
  {
    id: '4',
    type: 'pet',
    title: 'Pet Registered',
    description: 'Milo (Golden Retriever) added to system',
    time: '5 hours ago',
    icon: PawPrint,
    color: 'text-warning',
  },
  {
    id: '5',
    type: 'owner',
    title: 'New Owner',
    description: 'Sarah Wilson registered as new client',
    time: '6 hours ago',
    icon: User,
    color: 'text-secondary-foreground',
  },
  {
    id: '6',
    type: 'appointment',
    title: 'Appointment Rescheduled',
    description: 'Buddy - Surgery moved to next week',
    time: '1 day ago',
    icon: Clock,
    color: 'text-muted-foreground',
  },
];

const typeLabels = {
  appointment: 'Appointment',
  record: 'Medical Record',
  pet: 'Pet Registration',
  owner: 'New Client',
};

export function RecentActivity() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '250ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates and changes</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {mockActivities.length} items
        </Badge>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity, index) => (
          <div
            key={activity.id}
            className="group flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
            style={{ animationDelay: `${250 + index * 50}ms` }}
          >
            {/* Icon */}
            <div className={cn(
              'rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110',
              activity.type === 'appointment' && activity.title.includes('Completed') ? 'bg-success/10' :
              activity.type === 'record' ? 'bg-primary/10' :
              activity.type === 'appointment' && activity.title.includes('New') ? 'bg-accent/10' :
              activity.type === 'pet' ? 'bg-warning/10' :
              activity.type === 'owner' ? 'bg-secondary' :
              'bg-muted'
            )}>
              <activity.icon className={cn('h-4 w-4', activity.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                  {activity.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {typeLabels[activity.type]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </div>

            {/* Timeline dot */}
            <div className="flex flex-col items-center mt-2">
              <div className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === 0 ? 'bg-primary animate-pulse' : 'bg-border group-hover:bg-primary/50'
              )} />
              {index < mockActivities.length - 1 && (
                <div className="w-px h-8 bg-border mt-2" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View all link */}
      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full text-sm font-medium text-primary hover:underline transition-colors">
          View all activity
        </button>
      </div>
    </div>
  );
}