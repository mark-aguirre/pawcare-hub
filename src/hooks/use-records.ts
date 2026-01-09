import { useState, useEffect } from 'react';
import { MedicalRecord } from '@/types';

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

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.search) params.append('search', options.search);
      if (options.status) params.append('status', options.status);
      if (options.type) params.append('type', options.type);
      if (options.petId) params.append('petId', options.petId);
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`/api/records?${params.toString()}`);
      const data = await response.json();

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
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (record: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    try {
      console.log('Creating record with data:', record);
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
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
      const response = await fetch(`/api/records/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        throw new Error(`Failed to update record: ${response.status}`);
      }

      const data = await response.json();
      
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
      const response = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete record');
      }

      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete record');
    }
  };

  const refetch = () => {
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, [options.search, options.status, options.type, options.petId, options.limit]);

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