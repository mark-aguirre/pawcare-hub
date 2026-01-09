'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Prescription } from '@/types';
import { Pill, Calendar, User, Stethoscope, Clock, RefreshCw, FileText } from 'lucide-react';

interface PrescriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  onEdit?: () => void;
  onRefill?: () => void;
  onDelete?: () => void;
}

export function PrescriptionDetailModal({ 
  isOpen, 
  onClose, 
  prescription, 
  onEdit, 
  onRefill,
  onDelete 
}: PrescriptionDetailModalProps) {
  if (!prescription) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[40vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Prescription Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold">{prescription.medicationName}</h3>
              <p className="text-muted-foreground">
                Prescribed for {prescription.petName}
              </p>
            </div>
            <Badge variant={getStatusColor(prescription.status)} className="capitalize">
              {prescription.status}
            </Badge>
          </div>

          <Separator />

          {/* Patient & Veterinarian Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                Patient Information
              </div>
              <div className="pl-6 space-y-1">
                <p className="font-medium">{prescription.petName}</p>
                <p className="text-sm text-muted-foreground">Pet ID: {prescription.petId}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                Prescribing Veterinarian
              </div>
              <div className="pl-6 space-y-1">
                <p className="font-medium">{prescription.veterinarianName}</p>
                <p className="text-sm text-muted-foreground">Vet ID: {prescription.veterinarianId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medication Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Pill className="h-4 w-4 text-muted-foreground" />
              Medication Details
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dosage</p>
                <p className="font-medium">{prescription.dosage}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                <p className="font-medium">{prescription.frequency}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="font-medium">{prescription.duration}</p>
              </div>
            </div>

            <div className="pl-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Instructions</p>
              <p className="text-sm bg-muted p-3 rounded-md">{prescription.instructions}</p>
            </div>
          </div>

          <Separator />

          {/* Prescription Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Prescription Information
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prescribed Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{formatDate(prescription.prescribedDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Refills Remaining</p>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{prescription.refillsRemaining}</p>
                </div>
              </div>
            </div>

            {prescription.notes && (
              <div className="pl-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</p>
                <p className="text-sm bg-muted p-3 rounded-md">{prescription.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onDelete && (
              <Button variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            {prescription.status === 'active' && prescription.refillsRemaining > 0 && onRefill && (
              <Button onClick={onRefill} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Process Refill
              </Button>
            )}
            {onEdit && (
              <Button onClick={onEdit}>
                Edit Prescription
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}