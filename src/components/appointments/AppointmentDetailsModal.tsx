'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, PawPrint, Edit, X } from 'lucide-react';
import { Appointment } from '@/types';
import { useUpdateAppointment, useDeleteAppointment } from '@/hooks/use-appointments';
import { useToast } from '@/components/ui/use-toast';
import { EditAppointmentForm } from './EditAppointmentForm';

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsModal({ appointment, open, onOpenChange }: AppointmentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const updateAppointment = useUpdateAppointment();

  if (!appointment) return null;

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await updateAppointment.mutateAsync({
          ...appointment,
          status: 'CANCELLED'
        });
        toast({
          title: "Appointment Cancelled",
          description: "The appointment has been cancelled successfully.",
        });
        onOpenChange(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel appointment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-500';
      case 'CHECKED_IN': return 'bg-yellow-500';
      case 'IN_PROGRESS': return 'bg-orange-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <EditAppointmentForm
            appointment={appointment}
            onSuccess={() => {
              setIsEditing(false);
              onOpenChange(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge className={`${getStatusColor(appointment.status)} text-white`}>
              {appointment.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.time} ({appointment.duration} min)
                </p>
              </div>
            </div>
          </div>

          {/* Pet & Owner */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Pet</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.petName} ({appointment.petSpecies})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Owner</p>
                <p className="text-sm text-muted-foreground">{appointment.ownerName}</p>
              </div>
            </div>
          </div>

          {/* Type */}
          <div>
            <p className="text-sm font-medium">Appointment Type</p>
            <p className="text-sm text-muted-foreground">{appointment.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</p>
          </div>

          {/* Veterinarian */}
          {appointment.veterinarianName && (
            <div>
              <p className="text-sm font-medium">Veterinarian</p>
              <p className="text-sm text-muted-foreground">{appointment.veterinarianName}</p>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              disabled={appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED'}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED'}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}