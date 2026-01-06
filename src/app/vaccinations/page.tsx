'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Syringe, AlertTriangle, Calendar, CheckCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Vaccination, VaccinationSchedule } from '@/types';
import { mockPets, mockVeterinarians } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const initialVaccinations: Vaccination[] = [
  {
    id: 'vacc-1',
    petId: 'pet-1',
    petName: 'Max',
    vaccineType: 'Rabies',
    administeredDate: new Date('2024-01-15'),
    nextDueDate: new Date('2025-01-15'),
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    batchNumber: 'RB2024-001',
    status: 'administered',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'vacc-2',
    petId: 'pet-2',
    petName: 'Luna',
    vaccineType: 'DHPP',
    administeredDate: new Date('2024-12-01'),
    nextDueDate: new Date('2025-12-01'),
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    status: 'administered',
    createdAt: new Date('2024-12-01')
  },
  {
    id: 'vacc-3',
    petId: 'pet-4',
    petName: 'Whiskers',
    vaccineType: 'FVRCP',
    administeredDate: new Date('2024-06-15'),
    nextDueDate: new Date('2024-12-28'),
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    status: 'overdue',
    createdAt: new Date('2024-06-15')
  }
];

const mockSchedules: VaccinationSchedule[] = [
  {
    id: 'sched-1',
    petId: 'pet-3',
    vaccineType: 'Rabies',
    dueDate: new Date('2025-02-15'),
    status: 'upcoming',
    reminderSent: false
  },
  {
    id: 'sched-2',
    petId: 'pet-5',
    vaccineType: 'DHPP',
    dueDate: new Date('2024-12-30'),
    status: 'due',
    reminderSent: true
  }
];

const vaccineTypes = [
  'Rabies',
  'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)',
  'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
  'Bordetella',
  'Lyme Disease',
  'Canine Influenza',
  'FeLV (Feline Leukemia)',
  'Other'
];

export default function VaccinationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('records');
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(initialVaccinations);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null);
  const [formData, setFormData] = useState({
    petId: '',
    vaccineType: '',
    administeredDate: '',
    nextDueDate: '',
    veterinarianId: '',
    batchNumber: '',
    notes: '',
    status: 'administered' as const
  });
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredVaccinations = vaccinations.filter(v =>
    v.petName.toLowerCase().includes(search.toLowerCase()) ||
    v.vaccineType.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSchedules = mockSchedules.filter(s =>
    s.vaccineType.toLowerCase().includes(search.toLowerCase())
  );

  const overdueCount = vaccinations.filter(v => v.status === 'overdue').length;
  const upcomingCount = mockSchedules.filter(s => s.status === 'upcoming').length;
  const dueCount = mockSchedules.filter(s => s.status === 'due').length;

  const handleNewVaccination = () => {
    setEditingVaccination(null);
    setFormData({
      petId: '',
      vaccineType: '',
      administeredDate: '',
      nextDueDate: '',
      veterinarianId: '',
      batchNumber: '',
      notes: '',
      status: 'administered'
    });
    setIsFormOpen(true);
  };

  const handleEditVaccination = (vaccination: Vaccination) => {
    setEditingVaccination(vaccination);
    setFormData({
      petId: vaccination.petId,
      vaccineType: vaccination.vaccineType,
      administeredDate: vaccination.administeredDate.toISOString().split('T')[0],
      nextDueDate: vaccination.nextDueDate.toISOString().split('T')[0],
      veterinarianId: vaccination.veterinarianId,
      batchNumber: vaccination.batchNumber || '',
      notes: vaccination.notes || '',
      status: vaccination.status
    });
    setIsFormOpen(true);
  };

  const handleDeleteVaccination = (id: string) => {
    setVaccinations(prev => prev.filter(v => v.id !== id));
    toast({
      title: "Vaccination Deleted",
      description: "The vaccination record has been removed.",
    });
  };

  const handleSaveVaccination = () => {
    const selectedPet = mockPets.find(p => p.id === formData.petId);
    const selectedVet = mockVeterinarians.find(v => v.id === formData.veterinarianId);
    
    if (!selectedPet || !selectedVet) {
      toast({
        title: "Error",
        description: "Please select a pet and veterinarian.",
        variant: "destructive"
      });
      return;
    }

    const vaccinationData: Vaccination = {
      id: editingVaccination?.id || `vacc-${Date.now()}`,
      petId: formData.petId,
      petName: selectedPet.name,
      vaccineType: formData.vaccineType,
      administeredDate: new Date(formData.administeredDate),
      nextDueDate: new Date(formData.nextDueDate),
      veterinarianId: formData.veterinarianId,
      veterinarianName: selectedVet.name,
      batchNumber: formData.batchNumber,
      notes: formData.notes,
      status: formData.status,
      createdAt: editingVaccination?.createdAt || new Date()
    };

    if (editingVaccination) {
      setVaccinations(prev => prev.map(v => v.id === editingVaccination.id ? vaccinationData : v));
      toast({
        title: "Vaccination Updated",
        description: "The vaccination record has been updated successfully.",
      });
    } else {
      setVaccinations(prev => [vaccinationData, ...prev]);
      toast({
        title: "Vaccination Added",
        description: "New vaccination record has been created successfully.",
      });
    }

    setIsFormOpen(false);
  };

  const handleScheduleVaccination = (schedule: VaccinationSchedule) => {
    const selectedPet = mockPets.find(p => p.id === schedule.petId);
    if (selectedPet) {
      setFormData({
        petId: schedule.petId,
        vaccineType: schedule.vaccineType,
        administeredDate: new Date().toISOString().split('T')[0],
        nextDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        veterinarianId: 'vet-1',
        batchNumber: '',
        notes: '',
        status: 'scheduled'
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
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold">{vaccinations.length}</p>
                    </div>
                    <Syringe className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                      <p className="text-2xl font-bold text-destructive">{overdueCount}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Due Soon</p>
                      <p className="text-2xl font-bold text-warning">{dueCount}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-success">{vaccinations.filter(v => v.status === 'administered').length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vaccinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="records">Vaccination Records</TabsTrigger>
                <TabsTrigger value="schedule">Schedule & Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="records" className="space-y-4">
                {filteredVaccinations.map((vaccination) => (
                  <Card key={vaccination.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            vaccination.status === 'overdue' ? 'bg-destructive/10' : 'bg-primary/10'
                          }`}>
                            <Syringe className={`h-6 w-6 ${
                              vaccination.status === 'overdue' ? 'text-destructive' : 'text-primary'
                            }`} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{vaccination.vaccineType}</h3>
                              <Badge variant={
                                vaccination.status === 'administered' ? 'default' :
                                vaccination.status === 'scheduled' ? 'secondary' : 'destructive'
                              }>
                                {vaccination.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{vaccination.petName}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Administered: {vaccination.administeredDate.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className={vaccination.status === 'overdue' ? 'text-destructive font-medium' : ''}>
                                  Next due: {vaccination.nextDueDate.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Veterinarian: {vaccination.veterinarianName}
                            </p>
                            {vaccination.batchNumber && (
                              <p className="text-sm text-muted-foreground">
                                Batch: {vaccination.batchNumber}
                              </p>
                            )}
                            {vaccination.notes && (
                              <p className="text-sm text-muted-foreground">
                                Notes: {vaccination.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditVaccination(vaccination)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteVaccination(vaccination.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                {filteredSchedules.map((schedule) => (
                  <Card key={schedule.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            schedule.status === 'overdue' ? 'bg-destructive/10' :
                            schedule.status === 'due' ? 'bg-warning/10' : 'bg-primary/10'
                          }`}>
                            <Calendar className={`h-6 w-6 ${
                              schedule.status === 'overdue' ? 'text-destructive' :
                              schedule.status === 'due' ? 'text-warning' : 'text-primary'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{schedule.vaccineType}</h3>
                            <p className="text-sm text-muted-foreground">
                              Pet: {mockPets.find(p => p.id === schedule.petId)?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Due: {schedule.dueDate.toLocaleDateString()}
                            </p>
                            {schedule.reminderSent && (
                              <p className="text-xs text-success">✓ Reminder sent</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            schedule.status === 'overdue' ? 'destructive' :
                            schedule.status === 'due' ? 'default' : 'secondary'
                          }>
                            {schedule.status}
                          </Badge>
                          <Button size="sm" className="mt-2" onClick={() => handleScheduleVaccination(schedule)}>
                            Schedule Vaccination
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </LoadingWrapper>

        {/* Vaccination Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVaccination ? 'Edit Vaccination' : 'New Vaccination Record'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet">Pet</Label>
                <Select value={formData.petId} onValueChange={(value) => setFormData({...formData, petId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccine">Vaccine Type</Label>
                <Select value={formData.vaccineType} onValueChange={(value) => setFormData({...formData, vaccineType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccine" />
                  </SelectTrigger>
                  <SelectContent>
                    {vaccineTypes.map((vaccine) => (
                      <SelectItem key={vaccine} value={vaccine}>
                        {vaccine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="administered">Administered Date</Label>
                <Input
                  type="date"
                  value={formData.administeredDate}
                  onChange={(e) => setFormData({...formData, administeredDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextDue">Next Due Date</Label>
                <Input
                  type="date"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vet">Veterinarian</Label>
                <Select value={formData.veterinarianId} onValueChange={(value) => setFormData({...formData, veterinarianId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select veterinarian" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVeterinarians.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id}>
                        {vet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch Number</Label>
                <Input
                  placeholder="Enter batch number"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVaccination}>
                {editingVaccination ? 'Update' : 'Save'} Vaccination
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  );
}