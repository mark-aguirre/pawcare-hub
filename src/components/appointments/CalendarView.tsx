"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types';

interface CalendarViewProps {
  appointments: Appointment[];
  selectedStatus: string;
  onNewAppointment?: () => void;
}

export function CalendarView({ appointments, selectedStatus, onNewAppointment }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days to fill the grid
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  // Filter appointments for the current month
  const monthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.getMonth() === month && aptDate.getFullYear() === year;
  });

  // Group appointments by date
  const appointmentsByDate = monthAppointments.reduce((acc, apt) => {
    if (selectedStatus === 'all' || apt.status === selectedStatus) {
      const dateKey = apt.date.getDate();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(apt);
    }
    return acc;
  }, {} as Record<number, Appointment[]>);

  // Generate calendar grid
  const calendarDays = [];
  
  // Previous month's trailing days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(year, month - 1, day),
      appointments: []
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = date.toDateString() === today.toDateString();
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday,
      date,
      appointments: appointmentsByDate[day] || []
    });
  }

  // Next month's leading days to complete the grid (6 rows × 7 days = 42 cells)
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(year, month + 1, day),
      appointments: []
    });
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'checked-in': return 'bg-yellow-500 text-white';
      case 'in-progress': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentDate(new Date())}
              className="ml-2"
            >
              Today
            </Button>
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted/30">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((calendarDay, index) => (
          <div
            key={index}
            className={cn(
              "min-h-[120px] border-r border-b border-border p-2 relative",
              !calendarDay.isCurrentMonth && "bg-muted/20 text-muted-foreground",
              calendarDay.isToday && "bg-primary/5 border-primary/20",
              "hover:bg-muted/30 transition-colors"
            )}
          >
            {/* Day Number */}
            <div className={cn(
              "text-sm font-medium mb-1",
              calendarDay.isToday && "text-primary font-bold"
            )}>
              {calendarDay.day}
            </div>

            {/* Appointments */}
            <div className="space-y-1">
              {calendarDay.appointments.slice(0, 3).map((appointment, aptIndex) => (
                <div
                  key={appointment.id}
                  className={cn(
                    "text-xs px-2 py-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity",
                    getStatusColor(appointment.status)
                  )}
                  title={`${appointment.time} - ${appointment.petName} (${appointment.ownerName})`}
                >
                  <div className="font-medium truncate">
                    {appointment.time} {appointment.petName}
                  </div>
                  <div className="truncate opacity-90">
                    {appointment.type}
                  </div>
                </div>
              ))}
              
              {/* Show more indicator */}
              {calendarDay.appointments.length > 3 && (
                <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                  +{calendarDay.appointments.length - 3} more
                </div>
              )}
            </div>

            {/* Add appointment button on hover */}
            {calendarDay.isCurrentMonth && onNewAppointment && (
              <button
                onClick={onNewAppointment}
                className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                title="Add appointment"
              >
                <Plus className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}