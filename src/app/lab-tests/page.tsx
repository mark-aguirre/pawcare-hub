'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LabTestCard } from '@/components/lab-tests/LabTestCard';
import { LabTestFormModal } from '@/components/lab-tests/LabTestFormModal';
import { LabTestResultsModal } from '@/components/lab-tests/LabTestResultsModal';
import { Search, TestTube, Clock, CheckCircle, Plus, Download, Printer } from 'lucide-react';
import { LabTest } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { useLabTests } from '@/hooks/use-lab-tests';
import { exportLabTestsToCSV, printLabTestSummary } from '@/lib/lab-test-utils';

export default function LabTestsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'requested' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [editingTest, setEditingTest] = useState<LabTest | undefined>(undefined);

  const {
    labTests,
    stats,
    isLoading,
    error,
    createLabTest,
    updateLabTest,
    updateTestResults,
    startTest
  } = useLabTests({ status: statusFilter });

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.petName.toLowerCase().includes(search.toLowerCase()) ||
      test.testType.toLowerCase().includes(search.toLowerCase()) ||
      test.veterinarianName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const requestedCount = stats?.byStatus.requested || 0;
  const inProgressCount = stats?.byStatus.inProgress || 0;
  const completedCount = stats?.byStatus.completed || 0;
  const totalCount = stats?.total || 0;

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

  const handleSaveTest = async (testData: Omit<LabTest, 'id' | 'requestedDate'>) => {
    try {
      if (editingTest) {
        await updateLabTest(editingTest.id, testData);
        toast({
          title: "Lab Test Updated",
          description: "The lab test has been successfully updated."
        });
      } else {
        await createLabTest(testData);
        toast({
          title: "Lab Test Created",
          description: "New lab test request has been created."
        });
      }
      setIsFormModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lab test. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveResults = async (testId: string, results: string) => {
    try {
      await updateTestResults(testId, results);
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStartTest = async (test: LabTest) => {
    try {
      await startTest(test.id);
      toast({
        title: "Test Started",
        description: `${test.testType} for ${test.petName} is now in progress.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start test. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (error) {
    return (
      <ProtectedRoute requiredPermissions={['lab-tests', 'records']}>
        <MainLayout title="Laboratory Tests">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-destructive mb-4">Error loading lab tests: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermissions={['lab-tests', 'records']}>
      <MainLayout
        title="Laboratory Tests"
        subtitle={`${totalCount} tests • ${requestedCount} requested • ${inProgressCount} in progress`}
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
                      <p className="text-2xl font-bold">{totalCount}</p>
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
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    exportLabTestsToCSV(filteredTests);
                    toast({
                      title: "Export Complete",
                      description: "Lab tests data has been exported to CSV."
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => printLabTestSummary(filteredTests)}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Summary
                </Button>
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