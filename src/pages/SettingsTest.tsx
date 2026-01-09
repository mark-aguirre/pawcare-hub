'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClinicSettings, useUpdateClinicSettings, useUsers, useUserPermissions, useUpdateUserPermissions } from '@/hooks/use-settings';
import { toast } from '@/hooks/use-toast';

export default function SettingsTestPage() {
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const { data: clinicSettings, isLoading: settingsLoading, error: settingsError } = useClinicSettings();
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: userPermissions, isLoading: permissionsLoading } = useUserPermissions(selectedUserId);
  
  const updateClinicMutation = useUpdateClinicSettings();
  const updatePermissionsMutation = useUpdateUserPermissions();

  const testUpdateSettings = async () => {
    try {
      await updateClinicMutation.mutateAsync({
        clinicName: 'Test Clinic Updated',
        email: 'test@updated.com'
      });
      toast({ title: 'Success', description: 'Settings updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update settings', variant: 'destructive' });
    }
  };

  const testUpdatePermissions = async () => {
    if (!selectedUserId) {
      toast({ title: 'Error', description: 'Select a user first', variant: 'destructive' });
      return;
    }
    
    try {
      await updatePermissionsMutation.mutateAsync({
        userId: selectedUserId,
        permissions: {
          appointments: true,
          pets: true,
          owners: false,
          records: false,
          inventory: true,
          billing: false,
          reports: true,
          settings: false
        }
      });
      toast({ title: 'Success', description: 'Permissions updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update permissions', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings API Test Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Clinic Settings</CardTitle>
          <CardDescription>Test clinic settings API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Loading:</strong> {settingsLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Error:</strong> {settingsError ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Data:</strong>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(clinicSettings, null, 2)}
            </pre>
          </div>
          <Button onClick={testUpdateSettings} disabled={updateClinicMutation.isPending}>
            {updateClinicMutation.isPending ? 'Updating...' : 'Test Update Settings'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Test users API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Loading:</strong> {usersLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Error:</strong> {usersError ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Data:</strong>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(users, null, 2)}
            </pre>
          </div>
          <div className="space-y-2">
            <strong>Select User for Permissions Test:</strong>
            <select 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="block w-full p-2 border rounded"
            >
              <option value="">Select a user...</option>
              {users?.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
          <CardDescription>Test user permissions API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Loading:</strong> {permissionsLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Selected User:</strong> {selectedUserId || 'None'}
          </div>
          <div>
            <strong>Data:</strong>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(userPermissions, null, 2)}
            </pre>
          </div>
          <Button 
            onClick={testUpdatePermissions} 
            disabled={updatePermissionsMutation.isPending || !selectedUserId}
          >
            {updatePermissionsMutation.isPending ? 'Updating...' : 'Test Update Permissions'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}