import { Clock, CheckCircle, Calendar, FileText, User, PawPrint, Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivities } from '@/hooks/use-activities';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const typeLabels: Record<string, string> = {
  APPOINTMENT: 'Appointment',
  PET: 'Pet',
  OWNER: 'Owner',
  MEDICAL_RECORD: 'Medical Record',
  INVOICE: 'Invoice',
  PRESCRIPTION: 'Prescription',
  VACCINATION: 'Vaccination',
  INVENTORY: 'Inventory',
  LAB_TEST: 'Lab Test',
};

const actionLabels: Record<string, string> = {
  CREATE: 'Created',
  UPDATE: 'Updated',
  DELETE: 'Deleted',
  STATUS_UPDATE: 'Status Changed',
  STOCK_IN: 'Stock Added',
  STOCK_OUT: 'Stock Removed',
};

function getActivityIcon(action: string, entityType: string) {
  if (action === 'CREATE') return Plus;
  if (action === 'UPDATE' || action === 'STATUS_UPDATE') return Edit;
  if (action === 'DELETE') return Trash2;
  if (entityType === 'APPOINTMENT') return Calendar;
  if (entityType === 'PET') return PawPrint;
  if (entityType === 'OWNER') return User;
  if (entityType === 'MEDICAL_RECORD') return FileText;
  if (entityType === 'INVOICE') return FileText;
  return FileText;
}

function getActivityColor(action: string) {
  switch (action) {
    case 'CREATE': case 'STOCK_IN': return 'text-success';
    case 'UPDATE': case 'STATUS_UPDATE': return 'text-primary';
    case 'DELETE': case 'STOCK_OUT': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
}

function formatActivityData(activities: any[]): ActivityItem[] {
  return activities.map((activity) => ({
    id: `${activity.entityType}-${activity.id}`,
    action: activity.action,
    entityType: activity.entityType,
    title: `${actionLabels[activity.action] || activity.action} ${typeLabels[activity.entityType] || activity.entityType}`,
    description: activity.description || activity.entityName,
    time: new Date(activity.timestamp).toLocaleString(),
    icon: getActivityIcon(activity.action, activity.entityType),
    color: getActivityColor(activity.action),
  }));
}

export function RecentActivity() {
  const { activities, loading, error } = useActivities(6);
  const router = useRouter();
  
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
  
  const activityItems = formatActivityData(activities);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '250ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates and changes</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {activityItems.length} items
        </Badge>
      </div>

      <div className="space-y-4">
        {activityItems.length > 0 ? activityItems.map((activityItem, index) => (
          <div
            key={activityItem.id}
            className="group flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
            style={{ animationDelay: `${250 + index * 50}ms` }}
          >
            {/* Icon */}
            <div className={cn(
              'rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110',
              activityItem.action === 'CREATE' ? 'bg-success/10' :
              activityItem.action === 'UPDATE' || activityItem.action === 'STATUS_UPDATE' ? 'bg-primary/10' :
              activityItem.action === 'DELETE' ? 'bg-destructive/10' :
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
                  {typeLabels[activityItem.entityType] || activityItem.entityType}
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
              {index < activityItems.length - 1 && (
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
        <button 
          onClick={() => router.push('/activities')}
          className="w-full text-sm font-medium text-primary hover:underline transition-colors"
        >
          View all activity
        </button>
      </div>
    </div>
  );
}