"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { CalendarView } from '@/components/appointments/CalendarView';
import { NewAppointmentPanel } from '@/components/dashboard/panels/NewAppointmentPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List, Grid3X3 } from 'lucide-react';
import { useAppointments } from '@/hooks/use-appointments';
import { useVeterinarians } from '@/hooks/use-veterinarians';

const statusFilters = ['all', 'scheduled', 'checked-in', 'in-progress', 'completed', 'cancelled'] as const;

export default function Appointments() {
  const { data: appointments = [], isLoading } = useAppointments();
  const { data: veterinarians = [] } = useVeterinarians();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<typeof statusFilters[number]>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [showNewAppointmentPanel, setShowNewAppointmentPanel] = useState(false);

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.date);
    const matchesDate = appointmentDate.toDateString() === selectedDate.toDateString();
    const matchesStatus = selectedStatus === 'all' || apt.status.toLowerCase() === selectedStatus.replace('-', '_');
    return matchesDate && matchesStatus;
  });

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <>
      <MainLayout
        title="Appointments"
        subtitle={`Schedule and manage patient visits`}
        action={{ label: 'New Appointment', onClick: () => setShowNewAppointmentPanel(true) }}
      >
      {/* View Toggle and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}>
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>

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

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}>
        <TabsContent value="calendar" className="mt-0">
          <CalendarView 
            appointments={appointments}
            selectedStatus={selectedStatus}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          {/* Date Navigation for List View */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
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

          {/* Appointments List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="text-center py-16 text-muted-foreground">
                  Loading appointments...
                </div>
              ) : filteredAppointments.length > 0 ? (
                <div className="space-y-3">
                  {filteredAppointments.map((appointment, index) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} delay={0} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
                  <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No appointments</h3>
                  <p>No appointments scheduled for this date</p>
                </div>
              )}
            </div>

            {/* Veterinarians Sidebar */}
            <div className="rounded-xl border border-border bg-card p-5 h-fit">
              <h3 className="text-sm font-semibold text-foreground mb-4">Veterinarians</h3>
              <div className="space-y-3">
                {veterinarians.map((vet) => (
                  <div key={vet.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <img
                      src={vet.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'}
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
        </TabsContent>
      </Tabs>
      </MainLayout>
      
      <NewAppointmentPanel 
        open={showNewAppointmentPanel} 
        onOpenChange={setShowNewAppointmentPanel} 
      />
    </>
  );
}
