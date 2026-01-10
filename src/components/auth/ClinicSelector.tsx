'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Calendar, Plus } from 'lucide-react';
import { Clinic } from '@/types';
import { useClinic } from '@/contexts/ClinicContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface ClinicSelectorProps {
  onClinicSelected: () => void;
  onCreateNew: () => void;
}

export function ClinicSelector({ onClinicSelected, onCreateNew }: ClinicSelectorProps) {
  const { setCurrentClinic } = useClinic();
  const { user } = useAuth();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      if (!user) return;
      
      try {
        // Fetch clinics where user is owner or has access
        const userClinics: Clinic[] = await apiClient.get(`/api/users/${user.id}/clinics`);
        setClinics(userClinics);
      } catch (error) {
        console.error('Failed to fetch clinics:', error);
        setClinics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinics();
  }, [user]);

  const handleSelectClinic = (clinic: Clinic) => {
    setCurrentClinic(clinic);
    onClinicSelected();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your clinics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Select Your Clinic</h1>
          <p className="text-gray-600 mt-2">Choose which clinic you'd like to manage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <Badge variant={clinic.subscription === 'ENTERPRISE' ? 'default' : 'secondary'}>
                    {clinic.subscription}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{clinic.name}</CardTitle>
                <CardDescription>{clinic.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Code: {clinic.code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Active since {new Date(clinic.createdAt).getFullYear()}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSelectClinic(clinic)}
                  className="w-full"
                >
                  Access Clinic
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Create New Clinic Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2">
            <CardHeader>
              <div className="flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-lg text-center">Create New Clinic</CardTitle>
              <CardDescription className="text-center">
                Set up a new veterinary practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onCreateNew}
                variant="outline"
                className="w-full"
              >
                Setup New Clinic
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}