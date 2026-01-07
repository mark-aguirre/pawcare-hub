'use client';

import { useState, lazy, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueStatCard } from '@/components/dashboard/RevenueStatCard';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Skeleton } from '@/components/ui/skeleton';
import { mockAppointments, mockDashboardStats } from '@/data/mockData';
import { Calendar, CheckCircle, Package } from 'lucide-react';

// Lazy load only heavy components
const RecentPets = lazy(() => import('@/components/dashboard/RecentPets').then(m => ({ default: m.RecentPets })));
const RevenueChart = lazy(() => import('@/components/dashboard/RevenueChart').then(m => ({ default: m.RevenueChart })));
const UpcomingAppointments = lazy(() => import('@/components/dashboard/UpcomingAppointments').then(m => ({ default: m.UpcomingAppointments })));
const LowStockAlert = lazy(() => import('@/components/dashboard/LowStockAlert').then(m => ({ default: m.LowStockAlert })));
const RecentActivity = lazy(() => import('@/components/dashboard/RecentActivity').then(m => ({ default: m.RecentActivity })));
const WelcomeMessage = lazy(() => import('@/components/dashboard/WelcomeMessage').then(m => ({ default: m.WelcomeMessage })));
const PerformanceSummary = lazy(() => import('@/components/dashboard/PerformanceSummary').then(m => ({ default: m.PerformanceSummary })));

const ComponentSkeleton = ({ className }: { className?: string }) => (
  <div className={`rounded-xl border border-border bg-card p-5 ${className || ''}`}>
    <Skeleton className="h-6 w-32 mb-4" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export default function Dashboard() {
  const today = new Date();
  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date.toDateString() === today.toDateString()
  );

  const isFirstTime = false;

  return (
    <MainLayout
      title="Dashboard"
      subtitle={today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
    >
      {/* Welcome Message for new users */}
      <Suspense fallback={<Skeleton className="h-20 w-full mb-6" />}>
        <WelcomeMessage userName="Dr. Smith" isFirstTime={isFirstTime} />
      </Suspense>

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
        <Suspense fallback={<ComponentSkeleton />}>
          <PerformanceSummary />
        </Suspense>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <Suspense fallback={<ComponentSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<ComponentSkeleton />}>
          <UpcomingAppointments />
        </Suspense>
        <Suspense fallback={<ComponentSkeleton />}>
          <LowStockAlert />
        </Suspense>
      </div>

      {/* Bottom Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ComponentSkeleton />}>
          <RecentActivity />
        </Suspense>
        <Suspense fallback={<ComponentSkeleton />}>
          <RecentPets />
        </Suspense>
      </div>
    </MainLayout>
  );
}