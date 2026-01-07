'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LabTestCard } from '@/components/lab-tests/LabTestCard';
import { LabTestFormModal } from '@/components/lab-tests/LabTestFormModal';
import { LabTestResultsModal } from '@/components/lab-tests/LabTestResultsModal';
import { Search, TestTube, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { LabTest } from '@/types';
import { toast } from '@/components/ui/use-toast';

const initialLabTests: LabTest[] = [
  {
    id: 'lab-1',
    petId: 'pet-1',
    petName: 'Max',
    testType: 'Complete Blood Count (CBC)',
    requestedDate: new Date('2024-12-20'),
    completedDate: new Date('2024-12-22'),
    results: 'All values within normal limits.\nWBC: 7.2 (normal: 6.0-17.0)\nRBC: 6.8 (normal: 5.5-8.5)\nPlatelets: 350 (normal: 200-500)\nHematocrit: 42% (normal: 37-55%)\nHemoglobin: 14.2 g/dL (normal: 12-18)',
    status: 'completed',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    notes: 'Annual health screening'
  },
  {
    id: 'lab-2',
    petId: 'pet-4',
    petName: 'Whiskers',
    testType: 'Blood Glucose',
    requestedDate: new Date('2024-12-18'),
    status: 'in-progress',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    notes: 'Diabetes monitoring - fasting glucose'
  },
  {
    id: 'lab-3',
    petId: 'pet-2',
    petName: 'Luna',
    testType: 'Urinalysis',
    requestedDate: new Date('2024-12-25'),
    status: 'requested',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen',
    notes: 'Check for urinary tract infection'
  },
  {
    id: 'lab-4',
    petId: 'pet-5',
    petName: 'Bella',
    testType: 'X-Ray',
    requestedDate: new Date('2024-12-15'),
    completedDate: new Date('2024-12-16'),
    results: 'Chest X-ray shows mild bronchial pattern consistent with respiratory condition. No signs of pneumonia or foreign objects. Heart size within normal limits.',
    status: 'completed',
    veterinarianId: 'vet-3',
    veterinarianName: 'Dr. Emily Watson',
    notes: 'Breathing issues follow-up'
  },
  {
    id: 'lab-5',
    petId: 'pet-3',
    petName: 'Buddy',
    testType: 'Blood Chemistry Panel',
    requestedDate: new Date('2024-12-21'),
    status: 'requested',
    veterinarianId: 'vet-2',
    veterinarianName: 'Dr. Michael Torres',
    notes: 'Pre-surgical bloodwork'
  }
];

export default function LabTestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'requested' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [labTests, setLabTests] = useState<LabTest[]>(initialLabTests);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [editingTest, setEditingTest] = useState<LabTest | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.petName.toLowerCase().includes(search.toLowerCase()) ||
      test.testType.toLowerCase().includes(search.toLowerCase()) ||
      test.veterinarianName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const requestedCount = labTests.filter(t => t.status === 'requested').length;
  const inProgressCount = labTests.filter(t => t.status === 'in-progress').length;
  const completedCount = labTests.filter(t => t.status === 'completed').length;

  const handleCreateTest = () => {
    setEditingTest(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditTest = (test: LabTest) => {
    setEditingTest(test);
    setIsFormModalOpen(true);
  };

  const handleViewResults = (test: LabTest) => {
    setSelectedTest(test);
    setIsResultsModalOpen(true);
  };

  const handleSaveTest = (testData: Omit<LabTest, 'id'>) => {
    if (editingTest) {
      setLabTests(prev => prev.map(t => 
        t.id === editingTest.id 
          ? { ...testData, id: editingTest.id }
          : t
      ));
      toast({
        title: "Lab Test Updated",
        description: "The lab test has been successfully updated."
      });
    } else {
      const newTest: LabTest = {
        ...testData,
        id: `lab-${Date.now()}`
      };
      setLabTests(prev => [newTest, ...prev]);
      toast({
        title: "Lab Test Created",
        description: "New lab test request has been created."
      });
    }
  };

  const handleSaveResults = (testId: string, results: string) => {
    setLabTests(prev => prev.map(t => 
      t.id === testId 
        ? { 
            ...t, 
            results, 
            status: 'completed' as const,
            completedDate: new Date()
          }
        : t
    ));
    setSelectedTest(prev => prev ? {
      ...prev,
      results,
      status: 'completed',
      completedDate: new Date()
    } : null);
    toast({
      title: "Results Saved",
      description: "Lab test results have been saved successfully."
    });
  };

  const handleStartTest = (test: LabTest) => {
    setLabTests(prev => prev.map(t => 
      t.id === test.id 
        ? { ...t, status: 'in-progress' as const }
        : t
    ));
    toast({
      title: "Test Started",
      description: `${test.testType} for ${test.petName} is now in progress.`
    });
  };

  return (
    <ProtectedRoute requiredPermissions={['lab-tests', 'records']}>
      <MainLayout
        title="Laboratory Tests"
        subtitle={`${labTests.length} tests • ${requestedCount} requested • ${inProgressCount} in progress`}
        action={{ label: 'New Test Request', onClick: handleCreateTest }}
      >
        <LoadingWrapper isLoading={isLoading} variant="list">
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                      <p className="text-2xl font-bold">{labTests.length}</p>
                    </div>
                    <TestTube className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Requested</p>
                      <p className="text-2xl font-bold text-warning">{requestedCount}</p>
                    </div>
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-primary">{inProgressCount}</p>
                    </div>
                    <TestTube className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-success">{completedCount}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'requested', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status === 'in-progress' ? 'In Progress' : status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tests List */}
            <div className="space-y-4">
              {filteredTests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No lab tests found</h3>
                    <p className="text-muted-foreground mb-4">
                      {search || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first test request'
                      }
                    </p>
                    {!search && statusFilter === 'all' && (
                      <Button onClick={handleCreateTest}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Test Request
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredTests.map((test) => (
                  <LabTestCard
                    key={test.id}
                    labTest={test}
                    onView={() => handleViewResults(test)}
                    onEdit={() => handleEditTest(test)}
                    onUploadResults={() => handleViewResults(test)}
                    onStartTest={() => handleStartTest(test)}
                  />
                ))
              )}
            </div>
          </div>
        </LoadingWrapper>

        {/* Modals */}
        <LabTestFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveTest}
          labTest={editingTest}
        />

        <LabTestResultsModal
          isOpen={isResultsModalOpen}
          onClose={() => setIsResultsModalOpen(false)}
          labTest={selectedTest}
          onSaveResults={handleSaveResults}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}