'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LabTest } from '@/types';
import { TestTube, Calendar, Clock, CheckCircle, AlertCircle, Eye, Edit, Upload, Play } from 'lucide-react';

interface LabTestCardProps {
  labTest: LabTest;
  onView: () => void;
  onEdit: () => void;
  onUploadResults: () => void;
  onStartTest: () => void;
}

export function LabTestCard({ labTest, onView, onEdit, onUploadResults, onStartTest }: LabTestCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'requested':
        return 'outline';
      case 'in-progress':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <TestTube className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <TestTube className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'text-warning';
      case 'in-progress':
        return 'text-primary';
      case 'completed':
        return 'text-success';
      case 'cancelled':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-primary/10`}>
              <div className={getStatusColor(labTest.status)}>
                {getStatusIcon(labTest.status)}
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">{labTest.testType}</h3>
                <Badge variant={getStatusVariant(labTest.status)} className="capitalize">
                  {labTest.status === 'in-progress' ? 'In Progress' : labTest.status}
                </Badge>
              </div>
              
              <p className="text-muted-foreground">
                {labTest.petName} • {labTest.veterinarianName}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Requested:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{formatDate(labTest.requestedDate)}</p>
                  </div>
                </div>
                {labTest.completedDate && (
                  <div>
                    <span className="font-medium text-muted-foreground">Completed:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{formatDate(labTest.completedDate)}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {labTest.notes && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  <span className="font-medium">Notes:</span> {labTest.notes}
                </p>
              )}

              {labTest.results && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Results:</p>
                  <p className="text-sm line-clamp-3">{labTest.results}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={onView}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {labTest.status === 'requested' && (
              <Button size="sm" onClick={onStartTest}>
                <Play className="h-4 w-4 mr-1" />
                Start Test
              </Button>
            )}
            {(labTest.status === 'in-progress' || labTest.status === 'completed') && (
              <Button size="sm" onClick={onUploadResults}>
                <Upload className="h-4 w-4 mr-1" />
                {labTest.results ? 'Update' : 'Upload'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}