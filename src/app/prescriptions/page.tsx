'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PrescriptionCard } from '@/components/prescriptions/PrescriptionCard';
import { PrescriptionFormModal } from '@/components/prescriptions/PrescriptionFormModal';
import { PrescriptionDetailModal } from '@/components/prescriptions/PrescriptionDetailModal';
import { Search, Pill, RefreshCw, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { Prescription } from '@/types';
import { toast } from '@/components/ui/use-toast';

const initialPrescriptions: Prescription[] = [
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
  },
  {
    id: 'rx-4',
    petId: 'pet-2',
    petName: 'Luna',
    veterinarianId: 'vet-3',
    veterinarianName: 'Dr. Emily Watson',
    medicationName: 'Joint Supplement',
    dosage: '1 tablet',
    frequency: 'Once daily',
    duration: '30 days',
    instructions: 'Give with morning meal',
    prescribedDate: new Date('2024-12-01'),
    status: 'active',
    refillsRemaining: 1,
    notes: 'For arthritis management'
  }
];

export default function PrescriptionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = p.petName.toLowerCase().includes(search.toLowerCase()) ||
      p.medicationName.toLowerCase().includes(search.toLowerCase()) ||
      p.veterinarianName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = prescriptions.filter(p => p.status === 'active').length;
  const needRefillCount = prescriptions.filter(p => p.status === 'active' && p.refillsRemaining <= 1).length;

  const handleCreatePrescription = () => {
    setEditingPrescription(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setIsFormModalOpen(true);
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailModalOpen(true);
  };

  const handleSavePrescription = (prescriptionData: Omit<Prescription, 'id'>) => {
    if (editingPrescription) {
      setPrescriptions(prev => prev.map(p => 
        p.id === editingPrescription.id 
          ? { ...prescriptionData, id: editingPrescription.id }
          : p
      ));
      toast({
        title: "Prescription Updated",
        description: "The prescription has been successfully updated."
      });
    } else {
      const newPrescription: Prescription = {
        ...prescriptionData,
        id: `rx-${Date.now()}`
      };
      setPrescriptions(prev => [newPrescription, ...prev]);
      toast({
        title: "Prescription Created",
        description: "New prescription has been successfully created."
      });
    }
  };

  const handleRefill = (prescription: Prescription) => {
    if (prescription.refillsRemaining > 0) {
      setPrescriptions(prev => prev.map(p => 
        p.id === prescription.id 
          ? { ...p, refillsRemaining: p.refillsRemaining - 1 }
          : p
      ));
      toast({
        title: "Refill Processed",
        description: `Refill processed for ${prescription.medicationName}. ${prescription.refillsRemaining - 1} refills remaining.`
      });
    }
  };

  const handleEditFromDetail = () => {
    if (selectedPrescription) {
      setIsDetailModalOpen(false);
      handleEditPrescription(selectedPrescription);
    }
  };

  const handleRefillFromDetail = () => {
    if (selectedPrescription) {
      handleRefill(selectedPrescription);
      setSelectedPrescription(prev => prev ? {
        ...prev,
        refillsRemaining: prev.refillsRemaining - 1
      } : null);
    }
  };

  return (
    <ProtectedRoute requiredPermissions={['prescriptions', 'records']}>
      <MainLayout
        title="Prescription Management"
        subtitle={`${prescriptions.length} prescriptions • ${activeCount} active • ${needRefillCount} need refill`}
        action={{ label: 'New Prescription', onClick: handleCreatePrescription }}
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
                      <p className="text-2xl font-bold">{prescriptions.length}</p>
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
                      <p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'completed').length}</p>
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
              {filteredPrescriptions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No prescriptions found</h3>
                    <p className="text-muted-foreground mb-4">
                      {search || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first prescription'
                      }
                    </p>
                    {!search && statusFilter === 'all' && (
                      <Button onClick={handleCreatePrescription}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Prescription
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                    onView={() => handleViewPrescription(prescription)}
                    onEdit={() => handleEditPrescription(prescription)}
                    onRefill={() => handleRefill(prescription)}
                  />
                ))
              )}
            </div>
          </div>
        </LoadingWrapper>

        {/* Modals */}
        <PrescriptionFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSavePrescription}
          prescription={editingPrescription}
        />

        <PrescriptionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          prescription={selectedPrescription}
          onEdit={handleEditFromDetail}
          onRefill={handleRefillFromDetail}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}