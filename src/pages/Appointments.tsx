import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockAppointments, mockVeterinarians } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusFilters = ['all', 'scheduled', 'checked-in', 'in-progress', 'completed', 'cancelled'] as const;

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<typeof statusFilters[number]>('all');

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesDate = apt.date.toDateString() === selectedDate.toDateString();
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
    return matchesDate && matchesStatus;
  });

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <MainLayout
      title="Appointments"
      subtitle={`Schedule and manage patient visits`}
      action={{ label: 'New Appointment', onClick: () => {} }}
    >
      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            {isToday && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Today
              </Badge>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!isToday && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedDate(new Date())}>
              Go to Today
            </Button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="capitalize"
            >
              {status === 'all' ? 'All Status' : status.replace('-', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {filteredAppointments.length > 0 ? (
            <div className="space-y-3">
              {filteredAppointments.map((appointment, index) => (
                <AppointmentCard key={appointment.id} appointment={appointment} delay={index * 50} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-foreground mb-1">No appointments</h3>
              <p>No appointments scheduled for this date</p>
            </div>
          )}
        </div>

        {/* Veterinarians Sidebar */}
        <div className="rounded-xl border border-border bg-card p-5 h-fit animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Veterinarians</h3>
          <div className="space-y-3">
            {mockVeterinarians.map((vet) => (
              <div key={vet.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <img
                  src={vet.photoUrl}
                  alt={vet.name}
                  className="h-10 w-10 rounded-full object-cover border border-border"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{vet.name}</p>
                  <p className="text-xs text-muted-foreground">{vet.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
