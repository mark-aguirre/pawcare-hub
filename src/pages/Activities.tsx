'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Clock, CheckCircle, Calendar, FileText, User, PawPrint, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivities } from '@/hooks/use-activities';
import { cn } from '@/lib/utils';

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

export default function Activities() {
  const [filter, setFilter] = useState<string>('all');
  const { activities, loading, error } = useActivities(50);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.entityType === filter;
  });

  if (loading) {
    return (
      <MainLayout title="Activity Log" subtitle="All system activities and changes">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Activity Log" subtitle="All system activities and changes">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load activities</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Activity Log" subtitle="All system activities and changes">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {filteredActivities.length} activities
          </Badge>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              {Object.entries(typeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.length > 0 ? filteredActivities.map((activity, index) => {
          const Icon = getActivityIcon(activity.action, activity.entityType);
          const color = getActivityColor(activity.action);
          
          return (
            <div
              key={`${activity.entityType}-${activity.id}`}
              className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-all duration-200"
            >
              <div className={cn(
                'rounded-xl p-2.5 transition-all duration-300',
                activity.action === 'CREATE' ? 'bg-success/10' :
                activity.action === 'UPDATE' || activity.action === 'STATUS_UPDATE' ? 'bg-primary/10' :
                activity.action === 'DELETE' ? 'bg-destructive/10' :
                'bg-muted'
              )}>
                <Icon className={cn('h-4 w-4', color)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">
                    {actionLabels[activity.action] || activity.action} {typeLabels[activity.entityType] || activity.entityType}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[activity.entityType] || activity.entityType}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {activity.description || activity.entityName}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  {activity.userName && (
                    <>
                      <span className="mx-1">•</span>
                      <User className="h-3 w-3" />
                      <span>{activity.userName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Activities Found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No activities have been recorded yet.' : `No ${typeLabels[filter]} activities found.`}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}