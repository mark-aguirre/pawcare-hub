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
import { useToast } from '@/components/ui/use-toast';
import { usePrescriptions } from '@/hooks/use-prescriptions';
import { usePets } from '@/hooks/use-pets';
import { useVeterinarians } from '@/hooks/use-veterinarians';

export default function PrescriptionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | undefined>(undefined);
  const { toast } = useToast();
  const {
    prescriptions,
    isLoading,
    error,
    createPrescription,
    updatePrescription,
    deletePrescription
  } = usePrescriptions();
  const { pets, fetchPets } = usePets();
  const { veterinarians, fetchVeterinarians } = useVeterinarians();

  useEffect(() => {
    fetchPets();
    fetchVeterinarians();
  }, [fetchPets, fetchVeterinarians]);

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = (p.petName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.medicationName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.veterinarianName || '').toLowerCase().includes(search.toLowerCase());
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

  const handleSavePrescription = async (prescriptionData: Omit<Prescription, 'id'>) => {
    try {
      if (editingPrescription) {
        await updatePrescription(editingPrescription.id, prescriptionData);
        toast({
          title: "Prescription Updated",
          description: "The prescription has been successfully updated."
        });
      } else {
        await createPrescription(prescriptionData);
        toast({
          title: "Prescription Created",
          description: "New prescription has been successfully created."
        });
      }
      setIsFormModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save prescription.",
        variant: "destructive"
      });
    }
  };

  const handleRefill = async (prescription: Prescription) => {
    if (prescription.refillsRemaining > 0) {
      try {
        await updatePrescription(prescription.id, {
          ...prescription,
          refillsRemaining: prescription.refillsRemaining - 1
        });
        toast({
          title: "Refill Processed",
          description: `Refill processed for ${prescription.medicationName}. ${prescription.refillsRemaining - 1} refills remaining.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process refill.",
          variant: "destructive"
        });
      }
    }
  };

  const handleEditFromDetail = () => {
    if (selectedPrescription) {
      setIsDetailModalOpen(false);
      handleEditPrescription(selectedPrescription);
    }
  };

  const handleDeleteFromDetail = async () => {
    if (selectedPrescription) {
      await handleDeletePrescription(selectedPrescription);
      setIsDetailModalOpen(false);
    }
  };

  const handleRefillFromDetail = async () => {
    if (selectedPrescription) {
      await handleRefill(selectedPrescription);
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
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive font-medium">Error loading prescriptions</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xl font-bold text-primary">{prescriptions.length}</div>
                <div className="text-xs text-muted-foreground">Total Prescriptions</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xl font-bold text-green-600">{activeCount}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xl font-bold text-yellow-600">
                  {prescriptions.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xl font-bold text-red-600">{needRefillCount}</div>
                <div className="text-xs text-muted-foreground">Need Refill</div>
              </div>
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
                    onDelete={() => handleDeletePrescription(prescription)}
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
          pets={pets}
          veterinarians={veterinarians}
        />

        <PrescriptionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          prescription={selectedPrescription}
          onEdit={handleEditFromDetail}
          onRefill={handleRefillFromDetail}
          onDelete={handleDeleteFromDetail}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}