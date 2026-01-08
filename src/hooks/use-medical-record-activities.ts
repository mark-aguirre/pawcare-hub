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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Return empty activities for now since we don't have this API implemented
    setActivities([]);
    setLoading(false);
  }, [limit]);

  return { activities, loading, error };
}