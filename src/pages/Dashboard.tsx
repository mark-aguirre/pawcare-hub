'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueStatCard } from '@/components/dashboard/RevenueStatCard';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentPets } from '@/components/dashboard/RecentPets';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { LowStockAlert } from '@/components/dashboard/LowStockAlert';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { WelcomeMessage } from '@/components/dashboard/WelcomeMessage';
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { mockAppointments, mockDashboardStats } from '@/data/mockData';
import { Calendar, DollarSign, PawPrint, Package, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date.toDateString() === today.toDateString()
  );

  // For demo purposes, show welcome message (in real app, this would be based on user state)
  const isFirstTime = false; // Set to true to see welcome message

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout
      title="Dashboard"
      subtitle={today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
    >
      <LoadingWrapper isLoading={isLoading} variant="dashboard">
      {/* Welcome Message for new users */}
      <WelcomeMessage userName="Dr. Smith" isFirstTime={isFirstTime} />

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
          delay={100}
        />
        <RevenueStatCard
          value={`$${mockDashboardStats.revenueToday.toLocaleString()}`}
          trend={{ value: 8, isPositive: true }}
          delay={200}
        />
        <StatCard
          title="Low Stock Items"
          value={mockDashboardStats.lowStockItems}
          icon={Package}
          variant="warning"
          delay={300}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 animate-slide-up">
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
                    delay={index * 50}
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

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mb-6">
        <PerformanceSummary />
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <RevenueChart />
        <UpcomingAppointments />
        <LowStockAlert />
      </div>

      {/* Bottom Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <RecentPets />
      </div>
      </LoadingWrapper>
    </MainLayout>
  );
}