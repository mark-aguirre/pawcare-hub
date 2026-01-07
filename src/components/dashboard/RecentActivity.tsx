import { Clock, CheckCircle, Calendar, FileText, User, PawPrint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentActivity } from '@/hooks/use-dashboard';
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

const typeLabels = {
  appointment: 'Appointment',
  record: 'Medical Record',
  pet: 'Pet Registration',
  owner: 'New Client',
};

function formatActivityData(activity: any): ActivityItem[] {
  const items: ActivityItem[] = [];
  
  // Process recent appointments
  if (activity?.recentAppointments) {
    activity.recentAppointments.forEach((apt: any) => {
      items.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        title: apt.status === 'completed' ? 'Appointment Completed' : 'New Appointment',
        description: `${apt.petName} - ${apt.notes || apt.type}`,
        time: new Date(apt.date).toLocaleDateString(),
        icon: apt.status === 'completed' ? CheckCircle : Calendar,
        color: apt.status === 'completed' ? 'text-success' : 'text-accent',
      });
    });
  }
  
  // Process recent invoices
  if (activity?.recentInvoices) {
    activity.recentInvoices.forEach((inv: any) => {
      items.push({
        id: `inv-${inv.id}`,
        type: 'record',
        title: 'Invoice Created',
        description: `${inv.petName} - $${inv.total}`,
        time: new Date(inv.issueDate).toLocaleDateString(),
        icon: FileText,
        color: 'text-primary',
      });
    });
  }
  
  return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);
}

export function RecentActivity() {
  const { activity, loading, error } = useRecentActivity();
  
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '250ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '250ms' }}>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load recent activity</p>
        </div>
      </div>
    );
  }
  
  const activities = formatActivityData(activity);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '250ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates and changes</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {activities.length} items
        </Badge>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? activities.map((activityItem, index) => (
          <div
            key={activityItem.id}
            className="group flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
            style={{ animationDelay: `${250 + index * 50}ms` }}
          >
            {/* Icon */}
            <div className={cn(
              'rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110',
              activityItem.type === 'appointment' && activityItem.title.includes('Completed') ? 'bg-success/10' :
              activityItem.type === 'record' ? 'bg-primary/10' :
              activityItem.type === 'appointment' && activityItem.title.includes('New') ? 'bg-accent/10' :
              activityItem.type === 'pet' ? 'bg-warning/10' :
              activityItem.type === 'owner' ? 'bg-secondary' :
              'bg-muted'
            )}>
              <activityItem.icon className={cn('h-4 w-4', activityItem.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                  {activityItem.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {typeLabels[activityItem.type]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{activityItem.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{activityItem.time}</span>
              </div>
            </div>

            {/* Timeline dot */}
            <div className="flex flex-col items-center mt-2">
              <div className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === 0 ? 'bg-primary animate-pulse' : 'bg-border group-hover:bg-primary/50'
              )} />
              {index < activities.length - 1 && (
                <div className="w-px h-8 bg-border mt-2" />
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
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