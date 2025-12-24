import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentPets } from '@/components/dashboard/RecentPets';
import { mockAppointments, mockDashboardStats } from '@/data/mockData';
import { Calendar, DollarSign, PawPrint, Package, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const today = new Date();
  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date.toDateString() === today.toDateString()
  );

  return (
    <MainLayout
      title="Dashboard"
      subtitle={today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Appointments"
          value={mockDashboardStats.todayAppointments}
          icon={Calendar}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Completed Today"
          value={mockDashboardStats.completedToday}
          icon={CheckCircle}
          variant="success"
          delay={50}
        />
        <StatCard
          title="Revenue Today"
          value={`$${mockDashboardStats.revenueToday.toLocaleString()}`}
          icon={DollarSign}
          variant="accent"
          trend={{ value: 8, isPositive: true }}
          delay={100}
        />
        <StatCard
          title="Low Stock Items"
          value={mockDashboardStats.lowStockItems}
          icon={Package}
          variant="warning"
          delay={150}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Today's Appointments</h3>
              <span className="text-sm text-muted-foreground">{todayAppointments.length} scheduled</span>
            </div>
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment, index) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    delay={150 + index * 50}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActions />
          <RecentPets />
        </div>
      </div>
    </MainLayout>
  );
}
