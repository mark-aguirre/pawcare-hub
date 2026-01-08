"use client";

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RecordCard } from '@/components/records/RecordCard';
import { RecordDetailModal } from '@/components/records/RecordDetailModal';
import { NewRecordPanel } from '@/components/dashboard/panels/NewRecordPanel';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  Stethoscope,
  TrendingUp,
  Clock,
  CheckCircle,
  Archive,
  Plus
} from 'lucide-react';
import { mockMedicalRecords, mockPets, mockVeterinarians } from '@/data/mockData';
import { MedicalRecord } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useMedicalRecordActivities } from '@/hooks/use-medical-record-activities';

const statusFilters = ['all', 'pending', 'completed', 'archived'] as const;
const typeFilters = ['all', 'checkup', 'vaccination', 'surgery', 'treatment', 'lab-result', 'emergency', 'follow-up'] as const;

export default function Records() {
  const { toast } = useToast();
  const { activities: medicalActivities, loading: activitiesLoading } = useMedicalRecordActivities(5);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<typeof statusFilters[number]>('all');
  const [selectedType, setSelectedType] = useState<typeof typeFilters[number]>('all');
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRecordPanelOpen, setIsRecordPanelOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  const filteredRecords = mockMedicalRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(search.toLowerCase()) ||
      record.petName.toLowerCase().includes(search.toLowerCase()) ||
      record.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      record.veterinarianName.toLowerCase().includes(search.toLowerCase()) ||
      record.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesType = selectedType === 'all' || record.type === selectedType;
    const matchesPet = selectedPet === 'all' || record.petId === selectedPet;
    
    return matchesSearch && matchesStatus && matchesType && matchesPet;
  });

  // Calculate stats
  const totalRecords = mockMedicalRecords.length;
  const pendingRecords = mockMedicalRecords.filter(r => r.status === 'pending').length;
  const completedRecords = mockMedicalRecords.filter(r => r.status === 'completed').length;
  const recentRecords = mockMedicalRecords.filter(r => {
    const daysDiff = (new Date().getTime() - r.date.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7;
  }).length;

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleNewRecord = () => {
    setIsRecordPanelOpen(true);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    // Edit functionality can be added later
    console.log('Edit record:', record);
  };

  const handleArchiveRecords = () => {
    const selectedRecords = filteredRecords.filter(r => r.status !== 'archived');
    if (selectedRecords.length === 0) {
      toast({
        title: "No Records to Archive",
        description: "All visible records are already archived or no records are selected.",
        variant: "default",
      });
      return;
    }
    
    // Here you would typically update the records in your API
    console.log('Archiving records:', selectedRecords.map(r => r.id));
    
    toast({
      title: "Records Archived",
      description: `${selectedRecords.length} record(s) have been archived successfully.`,
      variant: "default",
    });
  };

  const handleScheduleFollowUp = () => {
    // This would typically open an appointment scheduling modal
    toast({
      title: "Schedule Follow-up",
      description: "Follow-up appointment scheduling feature coming soon.",
      variant: "default",
    });
  };

  return (
    <MainLayout
      title="Medical Records"
      subtitle={`${totalRecords} total records • ${pendingRecords} pending review`}
      action={{ label: 'New Record', onClick: handleNewRecord }}
    >
      <LoadingWrapper isLoading={isLoading} variant="records">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                    <p className="text-2xl font-bold text-primary">{totalRecords}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warning/5 via-warning/10 to-warning/5 border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold text-warning">{pendingRecords}</p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-success/5 via-success/10 to-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-success">{completedRecords}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold text-accent">{recentRecords}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search records by title, pet, owner, or veterinarian..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Tabs */}
                <Tabs defaultValue="status" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="status">Status</TabsTrigger>
                    <TabsTrigger value="type">Type</TabsTrigger>
                    <TabsTrigger value="pet">Pet</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="status" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {statusFilters.map((status) => (
                        <Button
                          key={status}
                          variant={selectedStatus === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedStatus(status)}
                          className="capitalize"
                        >
                          {status === 'all' ? 'All Status' : status}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="type" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {typeFilters.map((type) => (
                        <Button
                          key={type}
                          variant={selectedType === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedType(type)}
                          className="capitalize"
                        >
                          {type === 'all' ? 'All Types' : type.replace('-', ' ')}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pet" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedPet === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPet('all')}
                      >
                        All Pets
                      </Button>
                      {mockPets.map((pet) => (
                        <Button
                          key={pet.id}
                          variant={selectedPet === pet.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedPet(pet.id)}
                        >
                          {pet.name}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredRecords.map((record, index) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    delay={index * 50}
                    onClick={() => handleRecordClick(record)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No records found</h3>
                <p className="text-muted-foreground mb-4">
                  {search || selectedStatus !== 'all' || selectedType !== 'all' || selectedPet !== 'all'
                    ? 'Try adjusting your filters or search terms.'
                    : 'No medical records have been created yet.'}
                </p>
                <Button onClick={() => {
                  setSearch('');
                  setSelectedStatus('all');
                  setSelectedType('all');
                  setSelectedPet('all');
                }}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={handleScheduleFollowUp}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={handleArchiveRecords}>
                <Archive className="h-4 w-4 mr-2" />
                Archive Records
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activitiesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : medicalActivities.length > 0 ? (
                medicalActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                      📋
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.description || activity.entityName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action} • {activity.userName || 'System'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent medical record activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Veterinarians */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Veterinarians
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockVeterinarians.map((vet) => (
                <div key={vet.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                    {vet.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {vet.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {vet.specialization}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      </LoadingWrapper>

      {/* Record Detail Modal */}
      <RecordDetailModal
        record={selectedRecord}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onEdit={handleEditRecord}
      />

      {/* New Record Panel */}
      <NewRecordPanel
        open={isRecordPanelOpen}
        onOpenChange={setIsRecordPanelOpen}
      />
    </MainLayout>
  );
}