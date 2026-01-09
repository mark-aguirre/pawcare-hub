import { useState, useEffect } from 'react';
import { LabTest } from '@/types';

interface UseLabTestsOptions {
  status?: string;
  petId?: string;
  veterinarianId?: string;
  autoFetch?: boolean;
}

interface LabTestStats {
  total: number;
  byStatus: {
    requested: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  recentlyCompleted: number;
  avgCompletionTime: number;
  mostCommonTests: Array<{ type: string; count: number }>;
}

export function useLabTests(options: UseLabTestsOptions = {}) {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [stats, setStats] = useState<LabTestStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { status, petId, veterinarianId, autoFetch = true } = options;

  const fetchLabTests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (petId) params.append('petId', petId);
      if (veterinarianId) params.append('veterinarianId', veterinarianId);

      const response = await fetch(`/api/lab-tests?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setLabTests(data.data);
      } else {
        setError(data.error || 'Failed to fetch lab tests');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching lab tests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/lab-tests/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching lab test stats:', err);
    }
  };

  const createLabTest = async (testData: Omit<LabTest, 'id' | 'requestedDate'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lab-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchLabTests(); // Refresh the list
        await fetchStats(); // Refresh stats
        return data.data;
      } else {
        setError(data.error || 'Failed to create lab test');
        throw new Error(data.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLabTest = async (id: string, updates: Partial<LabTest>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lab-tests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        await fetchLabTests(); // Refresh the list
        await fetchStats(); // Refresh stats
        return data.data;
      } else {
        setError(data.error || 'Failed to update lab test');
        throw new Error(data.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLabTest = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lab-tests/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchLabTests(); // Refresh the list
        await fetchStats(); // Refresh stats
        return true;
      } else {
        setError(data.error || 'Failed to delete lab test');
        throw new Error(data.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTestResults = async (id: string, results: string) => {
    return updateLabTest(id, {
      results,
      status: 'completed',
      completedDate: new Date()
    });
  };

  const startTest = async (id: string) => {
    return updateLabTest(id, {
      status: 'in-progress'
    });
  };

  const cancelTest = async (id: string) => {
    return updateLabTest(id, {
      status: 'cancelled'
    });
  };

  useEffect(() => {
    if (autoFetch) {
      fetchLabTests();
      fetchStats();
    }
  }, [status, petId, veterinarianId, autoFetch]);

  return {
    labTests,
    stats,
    isLoading,
    error,
    fetchLabTests,
    fetchStats,
    createLabTest,
    updateLabTest,
    deleteLabTest,
    updateTestResults,
    startTest,
    cancelTest,
    refresh: () => {
      fetchLabTests();
      fetchStats();
    }
  };
}