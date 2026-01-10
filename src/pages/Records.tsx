"use client";

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RecordCard } from '@/components/records/RecordCard';
import { RecordDetailPanel } from '@/components/records/RecordDetailPanel';
import { NewRecordPanel } from '@/components/dashboard/panels/NewRecordPanel';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
import { MedicalRecord } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useRecords } from '@/hooks/use-records';
import { useVeterinarians } from '@/hooks/use-veterinarians';
import { usePets } from '@/hooks/use-pets';

const statusFilters = ['all', 'pending', 'completed', 'archived'] as const;
const typeFilters = ['all', 'checkup', 'vaccination', 'surgery', 'treatment', 'lab-result', 'emergency', 'follow-up'] as const;

export default function Records() {
  const { toast } = useToast();
  const { data: vetsData } = useVeterinarians();
  const { data: petsData } = usePets();
  const allVeterinarians = vetsData || [];
  const allPets = petsData || [];
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<typeof statusFilters[number]>('all');
  const [selectedType, setSelectedType] = useState<typeof typeFilters[number]>('all');
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [isRecordPanelOpen, setIsRecordPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Use the records API hook - only pass server-side filters
  const { 
    records: allRecords, 
    loading: isLoading, 
    error, 
    refetch,
    updateRecord,
    deleteRecord 
  } = useRecords({
    status: selectedStatus !== 'all' ? selectedStatus.toUpperCase() : undefined,
    type: selectedType !== 'all' ? selectedType.toUpperCase().replace('-', '_') : undefined,
    petId: selectedPet !== 'all' ? selectedPet : undefined,
  });

  // Transform backend data to match frontend expectations
  const transformedRecords = allRecords.map(record => {
    return {
      ...record,
      petName: record.pet?.name || 'Unknown Pet',
      petSpecies: record.pet?.species || 'unknown',
      ownerName: record.pet?.owner ? `${record.pet.owner.firstName} ${record.pet.owner.lastName}` : 'Unknown Owner',
      veterinarianName: record.veterinarian?.name || 'Unknown Vet',
      status: record.status?.toLowerCase() || 'pending',
      type: record.type?.toLowerCase().replace('_', '-') || 'unknown',
      date: new Date(record.date),
      createdAt: new Date(record.createdAt)
    };
  });

  // Create recent activities from records
  const recentActivities = transformedRecords
    .slice(0, 5)
    .map(record => ({
      id: record.id,
      description: `${record.type.replace('-', ' ')} for ${record.petName}`,
      action: 'Created',
      userName: record.veterinarianName,
      timestamp: record.createdAt
    }));

  // Extract unique pets from records data
  const uniquePets = transformedRecords.reduce((pets, record) => {
    if (record.pet && !pets.find(p => p.id === record.pet.id)) {
      pets.push({
        id: record.pet.id.toString(),
        name: record.pet.name,
        species: record.pet.species
      });
    }
    return pets;
  }, [] as Array<{id: string, name: string, species: string}>);

  // Get veterinarians from API
  const uniqueVeterinarians = allVeterinarians.map(vet => ({
    id: vet.id.toString(),
    uniqueKey: vet.id.toString(),
    name: vet.name,
    specialization: vet.specialization || 'General Practice'
  }));

  // Apply client-side search filter (no API call needed)
  const filteredRecords = search ? transformedRecords.filter(record => 
    record.title?.toLowerCase().includes(search.toLowerCase()) ||
    record.description?.toLowerCase().includes(search.toLowerCase()) ||
    record.petName?.toLowerCase().includes(search.toLowerCase()) ||
    record.ownerName?.toLowerCase().includes(search.toLowerCase())
  ) : transformedRecords;

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Calculate stats from filtered data
  const totalRecords = filteredRecords.length;
  const pendingRecords = filteredRecords.filter(r => r.status === 'pending').length;
  const completedRecords = filteredRecords.filter(r => r.status === 'completed').length;
  const recentRecords = filteredRecords.filter(r => {
    const daysDiff = (new Date().getTime() - r.date.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7;
  }).length;

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDetailPanelOpen(true);
  };

  const handleNewRecord = () => {
    setIsRecordPanelOpen(true);
  };

  const handleEditRecord = async (record: MedicalRecord) => {
    setEditingRecord(record);
    setIsDetailPanelOpen(false);
    setIsRecordPanelOpen(true);
  };

  const handleArchiveRecords = async () => {
    const selectedRecords = filteredRecords.filter(r => r.status !== 'archived');
    if (selectedRecords.length === 0) {
      toast({
        title: "No Records to Archive",
        description: "All visible records are already archived or no records are selected.",
        variant: "default",
      });
      return;
    }
    
    try {
      await Promise.all(
        selectedRecords.map(record => 
          updateRecord(record.id, { status: 'archived' })
        )
      );
      
      toast({
        title: "Records Archived",
        description: `${selectedRecords.length} record(s) have been archived successfully.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive records.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleFollowUp = () => {
    toast({
      title: "Schedule Follow-up",
      description: "Follow-up appointment scheduling feature coming soon.",
      variant: "default",
    });
  };

  return (
    <MainLayout
      title="Medical Records"
      subtitle={`${totalRecords} total records • ${pendingRecords} pending review • Page ${currentPage} of ${totalPages}`}
      action={{ label: 'New Record', onClick: handleNewRecord }}
    >
      <LoadingWrapper isLoading={isLoading} variant="records">
      {error && (
        <Card className="p-6 mb-6 border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive">
            <FileText className="h-5 w-5" />
            <p className="font-medium">Error loading records: {error}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={refetch}
          >
            Try Again
          </Button>
        </Card>
      )}
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
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search records..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {statusFilters.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className="capitalize"
                  >
                    {status === 'all' ? 'All Status' : status}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {typeFilters.slice(0, 4).map((type) => (
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
            </div>
          </Card>

          {/* Records List */}
          <div className="space-y-4">
            {paginatedRecords.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {paginatedRecords.map((record, index) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      delay={index * 50}
                      onClick={() => handleRecordClick(record)}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No records found</h3>
                <p className="text-muted-foreground mb-4">
                  No medical records have been created yet.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transformedRecords.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                      📋
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action} • {activity.userName}
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
              {uniqueVeterinarians.length > 0 ? (
                uniqueVeterinarians.map((vet) => (
                  <div key={vet.uniqueKey} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
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
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Stethoscope className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No veterinarians found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </LoadingWrapper>

      {/* Record Detail Panel */}
      <RecordDetailPanel
        record={selectedRecord}
        open={isDetailPanelOpen}
        onOpenChange={setIsDetailPanelOpen}
        onEdit={handleEditRecord}
        onRecordUpdated={refetch}
      />

      {/* New Record Panel */}
      <NewRecordPanel
        open={isRecordPanelOpen}
        onOpenChange={(open) => {
          setIsRecordPanelOpen(open);
          if (!open) setEditingRecord(null);
        }}
        onRecordCreated={refetch}
        editRecord={editingRecord}
      />
    </MainLayout>
  );
}