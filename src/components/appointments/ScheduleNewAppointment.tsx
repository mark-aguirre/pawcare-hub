import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PetSelect } from "@/components/ui/PetSelect";
import { VeterinarianSelect } from "@/components/ui/VeterinarianSelect";
import { cn } from "@/lib/utils";

// Mock data - replace with actual data fetching
const mockPets = [
  { id: 1, name: "Buddy", species: "dog", breed: "Golden Retriever", ownerName: "John Smith" },
  { id: 2, name: "Whiskers", species: "cat", breed: "Persian", ownerName: "Sarah Johnson" },
  { id: 3, name: "Charlie", species: "bird", breed: "Parakeet", ownerName: "Mike Wilson" },
];

const mockVeterinarians = [
  { id: 1, name: "Dr. Emily Carter", specialization: "General Practice" },
  { id: 2, name: "Dr. Michael Rodriguez", specialization: "Surgery" },
  { id: 3, name: "Dr. Sarah Thompson", specialization: "Dermatology" },
];

const appointmentTypes = [
  { value: "checkup", label: "Regular Checkup" },
  { value: "vaccination", label: "Vaccination" },
  { value: "surgery", label: "Surgery" },
  { value: "emergency", label: "Emergency" },
  { value: "consultation", label: "Consultation" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

const durationOptions = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
];

interface AppointmentFormData {
  petId: string;
  veterinarianId: string;
  type: string;
  time: string;
  duration: string;
  notes: string;
}

export function ScheduleNewAppointment() {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<AppointmentFormData>({
    petId: "",
    veterinarianId: "",
    type: "",
    time: "",
    duration: "30",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment data:", { ...formData, date });
    // Handle form submission
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule New Appointment</CardTitle>
        <p className="text-sm text-muted-foreground">Create a new appointment for a pet</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appointment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pet *</Label>
                <PetSelect
                  pets={mockPets}
                  value={formData.petId}
                  onSelect={(petId) => setFormData(prev => ({ ...prev, petId }))}
                  placeholder="Select a pet"
                />
              </div>

              <div className="space-y-2">
                <Label>Veterinarian *</Label>
                <VeterinarianSelect
                  veterinarians={mockVeterinarians}
                  value={formData.veterinarianId}
                  onSelect={(vetId) => setFormData(prev => ({ ...prev, veterinarianId: vetId }))}
                  placeholder="Select veterinarian"
                />
              </div>
            </div>

            <h3 className="text-lg font-medium">Schedule Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              <div className="space-y-2">
                <Label>Time *</Label>
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

              <div className="space-y-2">
                <Label>Duration *</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Appointment Type *</Label>
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
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Schedule Appointment
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}