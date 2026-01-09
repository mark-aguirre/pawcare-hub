'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar } from 'lucide-react';
import { VaccinationCard } from '@/components/vaccinations/VaccinationCard';
import { VaccinationFormPanel } from '@/components/vaccinations/VaccinationFormPanel';
import { Vaccination, VaccinationSchedule, Pet, Veterinarian } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useVaccinations, getUpcomingVaccinations } from '@/hooks/use-vaccinations';
import { usePets } from '@/hooks/use-pets';
import { useVeterinarians } from '@/hooks/use-veterinarians';





export default function VaccinationsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('records');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    petId: 0,
    vaccineType: '',
    administeredDate: '',
    nextDueDate: '',
    veterinarianId: 0,
    batchNumber: '',
    notes: '',
    status: 'ADMINISTERED' as const
  });
  const { toast } = useToast();
  const {
    vaccinations,
    isLoading,
    error,
    createVaccination,
    updateVaccination,
    deleteVaccination
  } = useVaccinations();
  const { pets, fetchPets } = usePets();
  const { veterinarians, fetchVeterinarians } = useVeterinarians();

  useEffect(() => {
    fetchPets();
    fetchVeterinarians();
    loadUpcomingVaccinations();
  }, [fetchPets, fetchVeterinarians]);

  const loadUpcomingVaccinations = async () => {
    try {
      const upcoming = await getUpcomingVaccinations(30);
      setUpcomingVaccinations(upcoming);
    } catch (error) {
      console.error('Failed to load upcoming vaccinations:', error);
    }
  };

  const filteredVaccinations = vaccinations.filter(v =>
    v.petName.toLowerCase().includes(search.toLowerCase()) ||
    v.vaccineType.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSchedules = upcomingVaccinations.filter(s =>
    s.vaccineType?.toLowerCase().includes(search.toLowerCase())
  );

  const overdueCount = vaccinations.filter(v => v.status === 'OVERDUE').length;
  const upcomingCount = upcomingVaccinations.filter(s => s.status === 'upcoming').length;
  const dueCount = upcomingVaccinations.filter(s => s.status === 'due').length;

  const handleNewVaccination = () => {
    setEditingVaccination(null);
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setFormData({
      petId: 0,
      vaccineType: '',
      administeredDate: today,
      nextDueDate: nextYear,
      veterinarianId: 0,
      batchNumber: '',
      notes: '',
      status: 'ADMINISTERED'
    });
    setIsFormOpen(true);
  };

  const handleEditVaccination = (vaccination: Vaccination) => {
    setEditingVaccination(vaccination);
    setFormData({
      petId: parseInt(vaccination.petId),
      vaccineType: vaccination.vaccineType,
      administeredDate: new Date(vaccination.administeredDate).toISOString().split('T')[0],
      nextDueDate: new Date(vaccination.nextDueDate).toISOString().split('T')[0],
      veterinarianId: parseInt(vaccination.veterinarianId),
      batchNumber: vaccination.batchNumber || '',
      notes: vaccination.notes || '',
      status: vaccination.status.toUpperCase() as 'SCHEDULED' | 'ADMINISTERED' | 'OVERDUE'
    });
    setIsFormOpen(true);
  };

  const handleDeleteVaccination = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vaccination record? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteVaccination(id);
      toast({
        title: "Vaccination Deleted",
        description: "The vaccination record has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vaccination record.",
        variant: "destructive"
      });
    }
  };

  const handleSaveVaccination = async () => {
    if (!formData.petId || !formData.veterinarianId || !formData.vaccineType || !formData.administeredDate || !formData.nextDueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate dates
    const adminDate = new Date(formData.administeredDate);
    const dueDate = new Date(formData.nextDueDate);
    if (dueDate <= adminDate) {
      toast({
        title: "Error",
        description: "Next due date must be after administered date.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingVaccination) {
        await updateVaccination(editingVaccination.id, formData);
        toast({
          title: "Vaccination Updated",
          description: "The vaccination record has been updated successfully.",
        });
      } else {
        await createVaccination(formData);
        toast({
          title: "Vaccination Added",
          description: "New vaccination record has been created successfully.",
        });
      }
      setIsFormOpen(false);
      loadUpcomingVaccinations();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save vaccination.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleVaccination = (schedule: any) => {
    const selectedPet = pets.find(p => p.id === schedule.petId);
    if (selectedPet) {
      setFormData({
        petId: schedule.petId,
        vaccineType: schedule.vaccineType,
        administeredDate: new Date().toISOString().split('T')[0],
        nextDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        veterinarianId: veterinarians[0]?.id || 0,
        batchNumber: '',
        notes: '',
        status: 'SCHEDULED' as const
      });
      setEditingVaccination(null);
      setIsFormOpen(true);
    }
  };

  return (
    <ProtectedRoute requiredPermissions={['vaccinations', 'records']}>
      <MainLayout
        title="Vaccination Management"
        subtitle={`${vaccinations.length} records • ${overdueCount} overdue • ${upcomingCount + dueCount} upcoming`}
        action={{ label: 'New Vaccination', onClick: handleNewVaccination }}
      >
        <LoadingWrapper isLoading={isLoading} variant="list">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive font-medium">Error loading vaccinations</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xl font-bold text-primary">{vaccinations.length}</div>
                <div className="text-xs text-muted-foreground">Total Records</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xl font-bold text-green-600">
                  {vaccinations.filter(v => v.status === 'ADMINISTERED').length}
                </div>
                <div className="text-xs text-muted-foreground">Administered</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xl font-bold text-yellow-600">
                  {vaccinations.filter(v => v.status === 'SCHEDULED').length}
                </div>
                <div className="text-xs text-muted-foreground">Scheduled</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xl font-bold text-red-600">{overdueCount}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search vaccinations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
              <Button onClick={handleNewVaccination} size="sm">
                New Vaccination
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="records">Vaccination Records</TabsTrigger>
                <TabsTrigger value="schedule">Schedule & Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="records" className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading vaccinations...</p>
                  </div>
                ) : filteredVaccinations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {search ? 'No vaccinations match your search.' : 'No vaccination records found.'}
                    </p>
                    {!search && (
                      <Button onClick={handleNewVaccination} className="mt-4">
                        Add First Vaccination
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredVaccinations.map((vaccination) => (
                    <VaccinationCard
                      key={vaccination.id}
                      vaccination={vaccination}
                      onEdit={handleEditVaccination}
                      onDelete={handleDeleteVaccination}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-3">
                {filteredSchedules.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming vaccinations scheduled.</p>
                  </div>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <Card key={schedule.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              schedule.status === 'overdue' ? 'bg-red-100' :
                              schedule.status === 'due' ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}>
                              <Calendar className={`h-4 w-4 ${
                                schedule.status === 'overdue' ? 'text-red-600' :
                                schedule.status === 'due' ? 'text-yellow-600' : 'text-blue-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{schedule.vaccineType}</h3>
                              <p className="text-xs text-muted-foreground">
                                {pets.find(p => p.id === schedule.petId)?.name || 'Unknown'} • Due: {schedule.dueDate?.toLocaleDateString ? schedule.dueDate.toLocaleDateString() : 'Unknown'}
                              </p>
                              {schedule.reminderSent && (
                                <p className="text-xs text-success">✓ Reminder sent</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              schedule.status === 'overdue' ? 'destructive' :
                              schedule.status === 'due' ? 'default' : 'secondary'
                            } className={`text-xs ${
                              schedule.status === 'overdue' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                              schedule.status === 'due' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                              'bg-blue-100 text-blue-700 hover:bg-blue-100'
                            }`}>
                              {schedule.status}
                            </Badge>
                            <Button size="sm" onClick={() => handleScheduleVaccination(schedule)}>
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </LoadingWrapper>

        {/* Vaccination Form Dialog */}
        <VaccinationFormPanel
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveVaccination}
          editingVaccination={editingVaccination}
          formData={formData}
          setFormData={setFormData}
          pets={pets}
          veterinarians={veterinarians}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}