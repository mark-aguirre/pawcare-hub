'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Pill, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Prescription } from '@/types';

const mockPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    petId: 'pet-1',
    petName: 'Max',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    medicationName: 'Amoxicillin',
    dosage: '250mg',
    frequency: 'Twice daily',
    duration: '10 days',
    instructions: 'Give with food. Complete full course.',
    prescribedDate: new Date('2024-12-15'),
    status: 'active',
    refillsRemaining: 2,
    notes: 'Monitor for allergic reactions'
  },
  {
    id: 'rx-2',
    petId: 'pet-4',
    petName: 'Whiskers',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    medicationName: 'Insulin',
    dosage: '2 units',
    frequency: 'Twice daily',
    duration: 'Ongoing',
    instructions: 'Administer 30 minutes before meals',
    prescribedDate: new Date('2024-11-20'),
    status: 'active',
    refillsRemaining: 5,
    notes: 'Diabetes management - monitor blood glucose'
  },
  {
    id: 'rx-3',
    petId: 'pet-5',
    petName: 'Bella',
    veterinarianId: 'vet-3',
    veterinarianName: 'Dr. Emily Watson',
    medicationName: 'Prednisone',
    dosage: '5mg',
    frequency: 'Once daily',
    duration: '7 days',
    instructions: 'Taper dose as directed',
    prescribedDate: new Date('2024-12-10'),
    status: 'completed',
    refillsRemaining: 0
  }
];

export default function PrescriptionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredPrescriptions = mockPrescriptions.filter(p => {
    const matchesSearch = p.petName.toLowerCase().includes(search.toLowerCase()) ||
      p.medicationName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = mockPrescriptions.filter(p => p.status === 'active').length;
  const needRefillCount = mockPrescriptions.filter(p => p.status === 'active' && p.refillsRemaining <= 1).length;

  return (
    <ProtectedRoute requiredPermissions={['prescriptions', 'records']}>
      <MainLayout
        title="Prescription Management"
        subtitle={`${mockPrescriptions.length} prescriptions • ${activeCount} active • ${needRefillCount} need refill`}
        action={{ label: 'New Prescription', onClick: () => {} }}
      >
        <LoadingWrapper isLoading={isLoading} variant="list">
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Prescriptions</p>
                      <p className="text-2xl font-bold">{mockPrescriptions.length}</p>
                    </div>
                    <Pill className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold text-success">{activeCount}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Need Refill</p>
                      <p className="text-2xl font-bold text-warning">{needRefillCount}</p>
                    </div>
                    <RefreshCw className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{mockPrescriptions.filter(p => p.status === 'completed').length}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          <Pill className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{prescription.medicationName}</h3>
                            <Badge variant={
                              prescription.status === 'active' ? 'default' :
                              prescription.status === 'completed' ? 'secondary' : 'destructive'
                            }>
                              {prescription.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {prescription.petName} • {prescription.veterinarianName}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Dosage:</span> {prescription.dosage}
                            </div>
                            <div>
                              <span className="font-medium">Frequency:</span> {prescription.frequency}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {prescription.duration}
                            </div>
                            <div>
                              <span className="font-medium">Refills:</span> {prescription.refillsRemaining}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Instructions:</span> {prescription.instructions}
                          </p>
                          {prescription.notes && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Notes:</span> {prescription.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        {prescription.status === 'active' && prescription.refillsRemaining > 0 && (
                          <Button size="sm">
                            Refill
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </LoadingWrapper>
      </MainLayout>
    </ProtectedRoute>
  );
}