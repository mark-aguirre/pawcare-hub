'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockPets, mockVeterinarians } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAppointmentModal({ open, onOpenChange }: NewAppointmentModalProps) {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    petId: '',
    veterinarianId: '',
    time: '',
    duration: '30',
    type: '',
    notes: '',
  });
  const { toast } = useToast();

  const appointmentTypes = [
    { value: 'checkup', label: 'Checkup' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'follow-up', label: 'Follow-up' },
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('New appointment:', { ...formData, date });
    
    // Show success toast
    toast({
      title: "Appointment Scheduled",
      description: `Appointment for ${mockPets.find(p => p.id === formData.petId)?.name} has been scheduled successfully.`,
      variant: "default",
    });
    
    // Reset form and close modal
    setFormData({
      petId: '',
      veterinarianId: '',
      time: '',
      duration: '30',
      type: '',
      notes: '',
    });
    setDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Schedule New Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pet Selection */}
            <div className="space-y-2">
              <Label htmlFor="pet">Pet</Label>
              <Select value={formData.petId} onValueChange={(value) => setFormData(prev => ({ ...prev, petId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  {mockPets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species}) - {pet.ownerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Veterinarian Selection */}
            <div className="space-y-2">
              <Label htmlFor="veterinarian">Veterinarian</Label>
              <Select value={formData.veterinarianId} onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarianId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select veterinarian" />
                </SelectTrigger>
                <SelectContent>
                  {mockVeterinarians.map((vet) => (
                    <SelectItem key={vet.id} value={vet.id}>
                      {vet.name} - {vet.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or special instructions..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow"
              disabled={!formData.petId || !formData.veterinarianId || !date || !formData.time || !formData.type}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}