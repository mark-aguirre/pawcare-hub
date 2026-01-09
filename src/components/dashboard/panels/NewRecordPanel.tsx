'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useRecords } from '@/hooks/use-records';
import { usePets } from '@/hooks/use-pets';
import { useVeterinarians } from '@/hooks/use-veterinarians';

interface NewRecordPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordCreated?: () => void;
  editRecord?: MedicalRecord | null;
}

export function NewRecordPanel({ open, onOpenChange, onRecordCreated, editRecord }: NewRecordPanelProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    veterinarianId: '',
    type: '',
    title: '',
    description: '',
    notes: '',
    attachments: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<{originalName: string, filename: string, path: string, size: number}[]>([]);
  const { pets, isLoading: petsLoading } = usePets();
  const { veterinarians, isLoading: vetsLoading } = useVeterinarians();
  const { toast } = useToast();
  const { createRecord, updateRecord } = useRecords();

  const recordTypes = [
    { value: 'vaccination', label: 'Vaccination', color: 'bg-success/10 text-success' },
    { value: 'checkup', label: 'Checkup', color: 'bg-primary/10 text-primary' },
    { value: 'surgery', label: 'Surgery', color: 'bg-destructive/10 text-destructive' },
    { value: 'treatment', label: 'Treatment', color: 'bg-warning/10 text-warning' },
    { value: 'lab-result', label: 'Lab Result', color: 'bg-accent/10 text-accent' },
    { value: 'emergency', label: 'Emergency', color: 'bg-destructive/10 text-destructive' },
    { value: 'follow-up', label: 'Follow-up', color: 'bg-secondary/10 text-secondary-foreground' },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        setUploadedFiles(prev => [...prev, ...result.files]);
        toast({
          title: "Files Uploaded",
          description: `${files.length} file(s) uploaded successfully.`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload files.",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editRecord) {
      // Find the actual pet and vet IDs from the record
      const petId = editRecord.pet?.id?.toString() || '1'; // Fallback to ID 1
      const vetId = editRecord.veterinarian?.id?.toString() || '1'; // Fallback to ID 1
      
      setFormData({
        petId: petId,
        veterinarianId: vetId,
        type: editRecord.type,
        title: editRecord.title,
        description: editRecord.description,
        notes: editRecord.notes || '',
        attachments: (() => {
          try {
            if (typeof editRecord.attachments === 'string') {
              const parsed = JSON.parse(editRecord.attachments);
              return Array.isArray(parsed) ? parsed.join(', ') : '';
            }
            return Array.isArray(editRecord.attachments) ? editRecord.attachments.join(', ') : '';
          } catch (e) {
            return '';
          }
        })(),
      });
      
      // Set existing attachments as uploaded files for display
      try {
        if (editRecord.attachments) {
          const attachments = typeof editRecord.attachments === 'string' 
            ? JSON.parse(editRecord.attachments) 
            : editRecord.attachments;
          if (Array.isArray(attachments)) {
            const existingFiles = attachments.map((path, index) => ({
              originalName: path.split('/').pop()?.replace(/^\d+-/, '') || `file-${index}`,
              filename: path.split('/').pop() || `file-${index}`,
              path: path,
              size: 0
            }));
            setUploadedFiles(existingFiles);
          }
        }
      } catch (e) {
        console.error('Error parsing existing attachments:', e);
      }
      
      setDate(new Date(editRecord.date));
    } else {
      setFormData({
        petId: '',
        veterinarianId: '',
        type: '',
        title: '',
        description: '',
        notes: '',
        attachments: '',
      });
      setUploadedFiles([]);
      setDate(new Date());
    }
  }, [editRecord, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (editRecord) {
        // Update existing record
        const updateData = {
          date: date.toISOString().split('T')[0],
          type: formData.type.toUpperCase().replace('-', '_'),
          title: formData.title,
          description: formData.description,
          notes: formData.notes || null,
          attachments: uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles.map(f => f.path)) : editRecord.attachments,
        };

        console.log('Updating record with data:', updateData);
        await updateRecord(editRecord.id, updateData);
        
        toast({
          title: "Medical Record Updated",
          description: `${formData.title} has been updated successfully.`,
          variant: "default",
        });
      } else {
        // Create new record
        const selectedPet = pets.find(p => p.id.toString() === formData.petId);
        const selectedVet = veterinarians.find(v => v.id.toString() === formData.veterinarianId);
        
        if (!selectedPet || !selectedVet) {
          toast({
            title: "Error",
            description: "Please select both a pet and veterinarian.",
            variant: "destructive",
          });
          return;
        }

        const recordData = {
          pet: {
            id: parseInt(formData.petId)
          },
          veterinarian: {
            id: parseInt(formData.veterinarianId)
          },
          date: date.toISOString().split('T')[0],
          type: formData.type.toUpperCase().replace('-', '_'),
          title: formData.title,
          description: formData.description,
          notes: formData.notes || null,
          status: 'PENDING',
          attachments: uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles.map(f => f.path)) : null,
        };

        console.log('Sending record data:', recordData);
        await createRecord(recordData);
        
        toast({
          title: "Medical Record Created",
          description: `${formData.title} has been added to ${selectedPet.name}'s medical history.`,
          variant: "default",
        });
      }
      
      // Reset form
      setFormData({
        petId: '',
        veterinarianId: '',
        type: '',
        title: '',
        description: '',
        notes: '',
        attachments: '',
      });
      setUploadedFiles([]);
      setDate(new Date());
      onOpenChange(false);
      onRecordCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create medical record.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[40vw] min-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-primary p-2.5 shadow-glow">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl font-display">{editRecord ? 'Edit Medical Record' : 'Create New Medical Record'}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">{editRecord ? 'Update medical record details' : 'Add a medical record for a pet'}</p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Patient & Provider
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pet Selection */}
              <div className="space-y-2">
                <Label htmlFor="pet">Pet *</Label>
                <Select 
                  value={formData.petId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, petId: value }))}
                  disabled={!!editRecord}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {petsLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading pets...
                      </SelectItem>
                    ) : pets && pets.length > 0 ? (
                      pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id.toString()}>
                          {pet.name} ({pet.species}) - {pet.ownerName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-pets" disabled>
                        No pets available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Veterinarian Selection */}
              <div className="space-y-2">
                <Label htmlFor="veterinarian">Veterinarian *</Label>
                <Select 
                  value={formData.veterinarianId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarianId: value }))}
                  disabled={!!editRecord}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select veterinarian" />
                  </SelectTrigger>
                  <SelectContent>
                    {vetsLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading veterinarians...
                      </SelectItem>
                    ) : veterinarians && veterinarians.length > 0 ? (
                      veterinarians.map((vet) => (
                        <SelectItem key={vet.id} value={vet.id.toString()}>
                          {vet.name} - {vet.specialization}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-vets" disabled>
                        No veterinarians available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Record Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Record Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Record Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${type.color.split(' ')[0]}`} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief title for this record"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Medical Information
            </h4>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the procedure, examination, or treatment..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional observations, recommendations, or follow-up instructions..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Attachments (Optional)
            </h4>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files:</Label>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                        <span className="text-sm truncate">{file.originalName}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow flex-1"
              disabled={editRecord ? (!formData.type || !formData.title || !formData.description || isSubmitting) : (!formData.petId || !formData.veterinarianId || !formData.type || !formData.title || !formData.description || isSubmitting)}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isSubmitting ? (editRecord ? 'Updating...' : 'Creating...') : (editRecord ? 'Update Record' : 'Create Record')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}