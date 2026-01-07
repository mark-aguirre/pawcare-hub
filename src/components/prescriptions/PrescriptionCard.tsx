'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prescription } from '@/types';
import { Pill, Calendar, RefreshCw, Eye, Edit, AlertTriangle } from 'lucide-react';

interface PrescriptionCardProps {
  prescription: Prescription;
  onView: () => void;
  onEdit: () => void;
  onRefill?: () => void;
}

export function PrescriptionCard({ prescription, onView, onEdit, onRefill }: PrescriptionCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isLowRefills = prescription.status === 'active' && prescription.refillsRemaining <= 1;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Pill className="h-6 w-6 text-primary" />
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">{prescription.medicationName}</h3>
                <Badge variant={getStatusVariant(prescription.status)} className="capitalize">
                  {prescription.status}
                </Badge>
                {isLowRefills && (
                  <Badge variant="outline" className="text-warning border-warning">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low Refills
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground">
                {prescription.petName} • {prescription.veterinarianName}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Dosage:</span>
                  <p className="font-medium">{prescription.dosage}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Frequency:</span>
                  <p className="font-medium">{prescription.frequency}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Duration:</span>
                  <p className="font-medium">{prescription.duration}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Refills:</span>
                  <p className={`font-medium ${isLowRefills ? 'text-warning' : ''}`}>
                    {prescription.refillsRemaining}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>Prescribed: {formatDate(prescription.prescribedDate)}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                <span className="font-medium">Instructions:</span> {prescription.instructions}
              </p>
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
            {prescription.status === 'active' && prescription.refillsRemaining > 0 && onRefill && (
              <Button size="sm" onClick={onRefill}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refill
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}