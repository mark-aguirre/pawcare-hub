import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/test/health');
      setHealthStatus(response);
    } catch (err) {
      setError('Failed to connect to backend: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/appointments');
      setAppointments(response);
    } catch (err) {
      setError('Failed to fetch appointments: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testHealthCheck();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Backend API Test</h1>
      
      <div className="space-y-6">
        {/* Health Check */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Health Check</h2>
          <button 
            onClick={testHealthCheck}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Health Check'}
          </button>
          
          {healthStatus && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <pre className="text-sm">{JSON.stringify(healthStatus, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Appointments Test */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Appointments API</h2>
          <button 
            onClick={testAppointments}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Appointments'}
          </button>
          
          {appointments.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-medium mb-2">Appointments ({appointments.length})</h3>
              <pre className="text-sm overflow-auto max-h-64">{JSON.stringify(appointments, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <div className="mt-2 text-sm text-red-600">
              <p>Make sure:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Backend is running on port 8082</li>
                <li>PostgreSQL database is running</li>
                <li>Database 'pawcare_hub' exists</li>
                <li>CORS is properly configured</li>
              </ul>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="font-medium mb-2">Backend Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Ensure PostgreSQL is running on localhost:5432</li>
            <li>Create database 'pawcare_hub' with user 'postgres' and password 'admin'</li>
            <li>Navigate to backend directory: <code className="bg-gray-200 px-1 rounded">cd backend</code></li>
            <li>Run the backend: <code className="bg-gray-200 px-1 rounded">mvn spring-boot:run</code></li>
            <li>Backend should be available at: <code className="bg-gray-200 px-1 rounded">http://localhost:8082</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}