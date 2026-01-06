'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, TestTube, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { LabTest } from '@/types';

const mockLabTests: LabTest[] = [
  {
    id: 'lab-1',
    petId: 'pet-1',
    petName: 'Max',
    testType: 'Complete Blood Count (CBC)',
    requestedDate: new Date('2024-12-20'),
    completedDate: new Date('2024-12-22'),
    results: 'All values within normal limits. WBC: 7.2, RBC: 6.8, Platelets: 350',
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
    notes: 'Diabetes monitoring'
  },
  {
    id: 'lab-3',
    petId: 'pet-2',
    petName: 'Luna',
    testType: 'Urinalysis',
    requestedDate: new Date('2024-12-25'),
    status: 'requested',
    veterinarianId: 'vet-1',
    veterinarianName: 'Dr. Sarah Chen'
  }
];

export default function LabTestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'requested' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [results, setResults] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTests = mockLabTests.filter(test => {
    const matchesSearch = test.petName.toLowerCase().includes(search.toLowerCase()) ||
      test.testType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const requestedCount = mockLabTests.filter(t => t.status === 'requested').length;
  const inProgressCount = mockLabTests.filter(t => t.status === 'in-progress').length;
  const completedCount = mockLabTests.filter(t => t.status === 'completed').length;

  const handleUploadResults = (test: LabTest) => {
    setSelectedTest(test);
    setResults(test.results || '');
    setShowResultsDialog(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested': return <Clock className="h-5 w-5 text-warning" />;
      case 'in-progress': return <TestTube className="h-5 w-5 text-primary" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'cancelled': return <AlertCircle className="h-5 w-5 text-destructive" />;
      default: return <TestTube className="h-5 w-5" />;
    }
  };

  return (
    <ProtectedRoute requiredPermissions={['lab-tests', 'records']}>
      <MainLayout
        title="Laboratory Tests"
        subtitle={`${mockLabTests.length} tests • ${requestedCount} requested • ${inProgressCount} in progress`}
        action={{ label: 'New Test Request', onClick: () => {} }}
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
                      <p className="text-2xl font-bold">{mockLabTests.length}</p>
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
              {filteredTests.map((test) => (
                <Card key={test.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          {getStatusIcon(test.status)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{test.testType}</h3>
                            <Badge variant={
                              test.status === 'completed' ? 'default' :
                              test.status === 'in-progress' ? 'secondary' :
                              test.status === 'requested' ? 'outline' : 'destructive'
                            }>
                              {test.status === 'in-progress' ? 'In Progress' : test.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {test.petName} • {test.veterinarianName}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Requested:</span> {test.requestedDate.toLocaleDateString()}
                            </div>
                            {test.completedDate && (
                              <div>
                                <span className="font-medium">Completed:</span> {test.completedDate.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          {test.notes && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Notes:</span> {test.notes}
                            </p>
                          )}
                          {test.results && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium mb-1">Results:</p>
                              <p className="text-sm">{test.results}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {test.status === 'requested' && (
                          <Button size="sm" variant="outline">
                            Start Test
                          </Button>
                        )}
                        {(test.status === 'in-progress' || test.status === 'completed') && (
                          <Button size="sm" onClick={() => handleUploadResults(test)}>
                            <Upload className="h-4 w-4 mr-2" />
                            {test.results ? 'Update Results' : 'Upload Results'}
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

        {/* Results Upload Dialog */}
        <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedTest?.results ? 'Update' : 'Upload'} Test Results
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Test: {selectedTest?.testType} for {selectedTest?.petName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Results</label>
                <Textarea
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Enter test results..."
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowResultsDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowResultsDialog(false)}>
                  Save Results
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  );
}