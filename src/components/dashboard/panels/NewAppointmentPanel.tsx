'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CalendarIcon, Clock, X, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePets } from '@/hooks/use-pets';
import { useVeterinarians } from '@/hooks/use-veterinarians';
import { useCreateAppointment } from '@/hooks/use-appointments';
import { useToast } from '@/components/ui/use-toast';

interface NewAppointmentPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAppointmentPanel({ open, onOpenChange }: NewAppointmentPanelProps) {
  const { pets = [], isLoading: petsLoading } = usePets();
  const { veterinarians = [], isLoading: vetsLoading } = useVeterinarians();
  const createAppointment = useCreateAppointment();
  const [date, setDate] = useState<Date>();
  const [openPetSelect, setOpenPetSelect] = useState(false);
  const [openVetSelect, setOpenVetSelect] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAppointment.mutateAsync({
        petId: parseInt(formData.petId),
        veterinarianId: parseInt(formData.veterinarianId),
        date: date!.toISOString().split('T')[0],
        time: formData.time,
        duration: parseInt(formData.duration),
        type: formData.type.toUpperCase() as any,
        status: 'SCHEDULED' as any,
        notes: formData.notes,
      });
      
      toast({
        title: "Appointment Scheduled",
        description: `Appointment for ${pets.find(p => p.id.toString() === formData.petId)?.name} has been scheduled successfully.`,
        variant: "default",
      });
      
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[40vw] min-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-primary p-2.5 shadow-glow">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-display">Schedule New Appointment</SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">Create a new appointment for a pet</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Appointment Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pet Selection */}
              <div className="space-y-2">
                <Label htmlFor="pet">Pet *</Label>
                <Popover open={openPetSelect} onOpenChange={setOpenPetSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPetSelect}
                      className="w-full justify-between"
                    >
                      {formData.petId
                        ? pets.find((pet) => pet.id.toString() === formData.petId)?.name + " (" + pets.find((pet) => pet.id.toString() === formData.petId)?.species + ") - " + pets.find((pet) => pet.id.toString() === formData.petId)?.ownerName
                        : "Select pet"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search pets..." />
                      <CommandList>
                        <CommandEmpty>No pet found.</CommandEmpty>
                        <CommandGroup>
                          {petsLoading ? (
                            <CommandItem value="loading" disabled>
                              Loading pets...
                            </CommandItem>
                          ) : pets && pets.length > 0 ? (
                            pets.map((pet) => (
                              <CommandItem
                                key={pet.id}
                                value={`${pet.name} ${pet.species} ${pet.ownerName}`}
                                onSelect={() => {
                                  setFormData(prev => ({ ...prev, petId: pet.id.toString() }));
                                  setOpenPetSelect(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.petId === pet.id.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐱' : '🐾'}</span>
                                  <span>{pet.name} ({pet.species}) - {pet.ownerName}</span>
                                </div>
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem value="no-pets" disabled>
                              No pets available
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Veterinarian Selection */}
              <div className="space-y-2">
                <Label htmlFor="veterinarian">Veterinarian *</Label>
                <Popover open={openVetSelect} onOpenChange={setOpenVetSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openVetSelect}
                      className="w-full justify-between"
                    >
                      {formData.veterinarianId
                        ? veterinarians.find((vet) => vet.id.toString() === formData.veterinarianId)?.name + " - " + veterinarians.find((vet) => vet.id.toString() === formData.veterinarianId)?.specialization
                        : "Select veterinarian"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search veterinarians..." />
                      <CommandList>
                        <CommandEmpty>No veterinarian found.</CommandEmpty>
                        <CommandGroup>
                          {vetsLoading ? (
                            <CommandItem value="loading" disabled>
                              Loading veterinarians...
                            </CommandItem>
                          ) : veterinarians && veterinarians.length > 0 ? (
                            veterinarians.map((vet) => (
                              <CommandItem
                                key={vet.id}
                                value={`${vet.name} ${vet.specialization}`}
                                onSelect={() => {
                                  setFormData(prev => ({ ...prev, veterinarianId: vet.id.toString() }));
                                  setOpenVetSelect(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.veterinarianId === vet.id.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div>
                                  <div className="font-medium">{vet.name}</div>
                                  <div className="text-xs text-muted-foreground">{vet.specialization}</div>
                                </div>
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem value="no-vets" disabled>
                              No veterinarians available
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Schedule Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Date *</Label>
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

              {/* Time and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="type">Appointment Type *</Label>
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
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or special instructions..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow flex-1"
              disabled={!formData.petId || !formData.veterinarianId || !date || !formData.time || !formData.type || createAppointment.isPending}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {createAppointment.isPending ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}