import { useState, useEffect, useCallback, useRef } from 'react';
import { MedicalRecord } from '@/types';
import { apiClient } from '@/lib/api';

interface UseRecordsOptions {
  search?: string;
  status?: string;
  type?: string;
  petId?: string;
  limit?: number;
}

interface UseRecordsReturn {
  records: MedicalRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createRecord: (record: Partial<MedicalRecord>) => Promise<MedicalRecord>;
  updateRecord: (id: string, record: Partial<MedicalRecord>) => Promise<MedicalRecord>;
  deleteRecord: (id: string) => Promise<void>;
}

export function useRecords(options: UseRecordsOptions = {}): UseRecordsReturn {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastOptionsRef = useRef<string>('');

  const fetchRecords = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.type) params.append('type', options.type);
      if (options.petId) params.append('petId', options.petId);
      if (options.limit) params.append('limit', options.limit.toString());

      const data = await apiClient.get<{success: boolean, data: any[], error?: string}>(`/api/records?${params.toString()}`);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch records');
      }

      // Convert date strings back to Date objects
      const recordsWithDates = data.data.map((record: any) => ({
        ...record,
        date: new Date(record.date),
        createdAt: new Date(record.createdAt),
      }));

      setRecords(recordsWithDates);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [options.status, options.type, options.petId, options.limit]);

  const createRecord = async (record: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    try {
      console.log('Creating record with data:', record);
      const data = await apiClient.post<{success: boolean, data: any, error?: string}>('/api/records', record);
      console.log('API response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create record');
      }
      
      const newRecord = {
        ...data.data,
        date: new Date(data.data.date),
        createdAt: new Date(data.data.createdAt),
      };

      setRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create record');
    }
  };

  const updateRecord = async (id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    try {
      const data = await apiClient.put<{success: boolean, data: any, error?: string}>(`/api/records/${id}`, record);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update record');
      }
      
      const updatedRecord = {
        ...data.data,
        date: new Date(data.data.date),
        createdAt: new Date(data.data.createdAt),
      };

      setRecords(prev => prev.map(r => r.id === id ? updatedRecord : r));
      return updatedRecord;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update record');
    }
  };

  const deleteRecord = async (id: string): Promise<void> => {
    try {
      const data = await apiClient.delete<{success: boolean, error?: string}>(`/api/records/${id}`);

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete record');
      }

      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete record');
    }
  };

  const refetch = useCallback(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Only fetch when server-side filter options change, not search
  useEffect(() => {
    const currentOptions = JSON.stringify({
      status: options.status,
      type: options.type,
      petId: options.petId,
      limit: options.limit
    });
    
    // Only fetch if options actually changed
    if (currentOptions !== lastOptionsRef.current) {
      lastOptionsRef.current = currentOptions;
      fetchRecords();
    }
  }, [fetchRecords, options.status, options.type, options.petId, options.limit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    records,
    loading,
    error,
    refetch,
    createRecord,
    updateRecord,
    deleteRecord,
  };
}