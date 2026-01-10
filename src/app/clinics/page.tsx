'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Settings, Users, Plus, Edit } from 'lucide-react';
import { Clinic } from '@/types';
import { useClinic } from '@/contexts/ClinicContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export default function ClinicManagement() {
  const { currentClinic, setCurrentClinic } = useClinic();
  const { user } = useAuth();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);

  useEffect(() => {
    const fetchClinics = async () => {
      if (!user) return;
      
      try {
        const userClinics: Clinic[] = await apiClient.get(`/api/users/${user.id}/clinics`);
        setClinics(userClinics);
      } catch (error) {
        console.error('Failed to fetch clinics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinics();
  }, [user]);

  const handleSwitchClinic = (clinic: Clinic) => {
    setCurrentClinic(clinic);
  };

  const handleUpdateClinic = async (updatedClinic: Clinic) => {
    try {
      const updated: Clinic = await apiClient.put(`/api/clinics/${updatedClinic.id}`, updatedClinic);
      setClinics(prev => prev.map(c => c.id === updated.id ? updated : c));
      if (currentClinic?.id === updated.id) {
        setCurrentClinic(updated);
      }
      setEditingClinic(null);
    } catch (error) {
      console.error('Failed to update clinic:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clinic Management</h1>
        <p className="text-gray-600 mt-2">Manage your veterinary clinics and switch between them</p>
      </div>

      {/* Current Clinic */}
      {currentClinic && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle className="text-xl">Current Clinic</CardTitle>
                  <CardDescription>{currentClinic.name}</CardDescription>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Code:</strong> {currentClinic.code}
              </div>
              <div>
                <strong>Subscription:</strong> {currentClinic.subscription}
              </div>
              <div>
                <strong>Address:</strong> {currentClinic.address}
              </div>
              <div>
                <strong>Phone:</strong> {currentClinic.phone}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Clinics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((clinic) => (
          <Card key={clinic.id} className={`${currentClinic?.id === clinic.id ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Building2 className="h-6 w-6 text-blue-600" />
                <div className="flex gap-2">
                  <Badge variant={clinic.subscription === 'ENTERPRISE' ? 'default' : 'secondary'}>
                    {clinic.subscription}
                  </Badge>
                  {currentClinic?.id === clinic.id && (
                    <Badge variant="default">Current</Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{clinic.name}</CardTitle>
              <CardDescription>{clinic.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>Code: {clinic.code}</div>
                <div>Phone: {clinic.phone}</div>
                <div>Email: {clinic.email}</div>
              </div>
              <div className="flex gap-2">
                {currentClinic?.id !== clinic.id && (
                  <Button 
                    onClick={() => handleSwitchClinic(clinic)}
                    size="sm"
                    className="flex-1"
                  >
                    Switch
                  </Button>
                )}
                <Button 
                  onClick={() => setEditingClinic(clinic)}
                  size="sm"
                  variant="outline"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Clinic Modal */}
      {editingClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Clinic</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateClinic(editingClinic);
              }} className="space-y-4">
                <div>
                  <Label htmlFor="name">Clinic Name</Label>
                  <Input
                    id="name"
                    value={editingClinic.name}
                    onChange={(e) => setEditingClinic(prev => prev ? {...prev, name: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingClinic.phone}
                    onChange={(e) => setEditingClinic(prev => prev ? {...prev, phone: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editingClinic.email}
                    onChange={(e) => setEditingClinic(prev => prev ? {...prev, email: e.target.value} : null)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setEditingClinic(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}