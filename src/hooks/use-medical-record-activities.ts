import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface MedicalRecordActivity {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  entityName: string;
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  metadata?: string;
}

export function useMedicalRecordActivities(limit: number = 10) {
  const [activities, setActivities] = useState<MedicalRecordActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<MedicalRecordActivity[]>(`/api/activities/medical-records?limit=${limit}`);
        setActivities(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [limit]);

  return { activities, loading, error };
}