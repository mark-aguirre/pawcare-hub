'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LabTest } from '@/types';
import { TestTube, Calendar, User, Stethoscope, FileText } from 'lucide-react';

interface LabTestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  labTest: LabTest | null;
  onSaveResults: (testId: string, results: string) => void;
}

export function LabTestResultsModal({ isOpen, onClose, labTest, onSaveResults }: LabTestResultsModalProps) {
  const [results, setResults] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (labTest) {
      setResults(labTest.results || '');
      setIsEditing(!labTest.results);
    }
  }, [labTest]);

  if (!labTest) return null;

  const handleSave = () => {
    onSaveResults(labTest.id, results);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'outline';
      case 'in-progress':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" />
            Lab Test Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold">{labTest.testType}</h3>
              <p className="text-muted-foreground">
                Test for {labTest.petName}
              </p>
            </div>
            <Badge variant={getStatusColor(labTest.status)} className="capitalize">
              {labTest.status === 'in-progress' ? 'In Progress' : labTest.status}
            </Badge>
          </div>

          <Separator />

          {/* Patient & Veterinarian Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                Patient Information
              </div>
              <div className="pl-6 space-y-1">
                <p className="font-medium">{labTest.petName}</p>
                <p className="text-sm text-muted-foreground">Pet ID: {labTest.petId}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                Requesting Veterinarian
              </div>
              <div className="pl-6 space-y-1">
                <p className="font-medium">{labTest.veterinarianName}</p>
                <p className="text-sm text-muted-foreground">Vet ID: {labTest.veterinarianId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Test Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Test Information
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requested Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{formatDate(labTest.requestedDate)}</p>
                </div>
              </div>
              {labTest.completedDate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{formatDate(labTest.completedDate)}</p>
                  </div>
                </div>
              )}
            </div>

            {labTest.notes && (
              <div className="pl-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                <p className="text-sm bg-muted p-3 rounded-md">{labTest.notes}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TestTube className="h-4 w-4 text-muted-foreground" />
                Test Results
              </div>
              {labTest.results && !isEditing && (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Results
                </Button>
              )}
            </div>
            
            <div className="pl-6">
              {isEditing ? (
                <div className="space-y-3">
                  <Label htmlFor="results">Results</Label>
                  <Textarea
                    id="results"
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                    placeholder="Enter test results..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={!results.trim()}>
                      Save Results
                    </Button>
                    {labTest.results && (
                      <Button variant="outline" onClick={() => {
                        setResults(labTest.results || '');
                        setIsEditing(false);
                      }}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ) : labTest.results ? (
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{labTest.results}</pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TestTube className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No results available yet</p>
                  <Button 
                    className="mt-3" 
                    onClick={() => setIsEditing(true)}
                    disabled={labTest.status === 'requested'}
                  >
                    Upload Results
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}