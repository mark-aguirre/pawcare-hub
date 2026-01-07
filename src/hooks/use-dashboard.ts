import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface DashboardStats {
  todayAppointments: number;
  pendingPayments: number;
  totalPets: number;
  lowStockItems: number;
  revenueToday: number;
  completedToday: number;
}

interface RecentActivity {
  recentAppointments: any[];
  recentInvoices: any[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<DashboardStats>('/api/dashboard/stats');
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => fetchStats() };
}

export function useRecentActivity() {
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<RecentActivity>('/api/dashboard/recent-activity');
        setActivity(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recent activity');
        console.error('Recent activity error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activity, loading, error, refetch: () => fetchActivity() };
}

export function usePerformanceData() {
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/dashboard/performance');
        setPerformance(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch performance data');
        console.error('Performance error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  return { performance, loading, error };
}

export function useRevenueData() {
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/dashboard/revenue');
        setRevenue(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch revenue data');
        console.error('Revenue error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return { revenue, loading, error };
}

export function useUpcomingAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/dashboard/upcoming-appointments');
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch upcoming appointments');
        console.error('Upcoming appointments error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading, error };
}

export function useInventoryAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/dashboard/inventory-alerts');
        setAlerts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch inventory alerts');
        console.error('Inventory alerts error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, loading, error };
}

export function useRecentPets() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/dashboard/recent-pets');
        setPets(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recent pets');
        console.error('Recent pets error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return { pets, loading, error };
}