import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Vaccination, Pet, Veterinarian } from '@/types';

interface VaccinationFormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingVaccination: Vaccination | null;
  formData: {
    petId: number;
    vaccineType: string;
    administeredDate: string;
    nextDueDate: string;
    veterinarianId: number;
    batchNumber: string;
    notes: string;
    status: 'SCHEDULED' | 'ADMINISTERED' | 'OVERDUE';
  };
  setFormData: (data: any) => void;
  pets: Pet[];
  veterinarians: Veterinarian[];
}

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

export function VaccinationFormPanel({
  isOpen,
  onClose,
  onSave,
  editingVaccination,
  formData,
  setFormData,
  pets,
  veterinarians
}: VaccinationFormPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {editingVaccination ? 'Edit Vaccination' : 'New Vaccination Record'}
          </SheetTitle>
          <SheetDescription>
            {editingVaccination ? 'Update vaccination details' : 'Add a new vaccination record for a pet'}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pet">Pet *</Label>
            <Select 
              value={formData.petId > 0 ? formData.petId.toString() : ""} 
              onValueChange={(value) => setFormData({...formData, petId: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pet" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id.toString()}>
                    {pet.name} ({pet.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vaccine">Vaccine Type *</Label>
            <Select 
              value={formData.vaccineType} 
              onValueChange={(value) => setFormData({...formData, vaccineType: value})}
            >
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="administered">Administered Date *</Label>
              <Input
                type="date"
                value={formData.administeredDate}
                onChange={(e) => setFormData({...formData, administeredDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextDue">Next Due Date *</Label>
              <Input
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vet">Veterinarian *</Label>
            <Select 
              value={formData.veterinarianId > 0 ? formData.veterinarianId.toString() : ""} 
              onValueChange={(value) => setFormData({...formData, veterinarianId: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select veterinarian" />
              </SelectTrigger>
              <SelectContent>
                {veterinarians.length > 0 ? veterinarians.map((vet) => (
                  <SelectItem key={vet.id} value={vet.id.toString()}>
                    {vet.name}
                  </SelectItem>
                )) : (
                  <SelectItem value="" disabled>
                    No veterinarians available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({...formData, status: value as 'SCHEDULED' | 'ADMINISTERED' | 'OVERDUE'})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ADMINISTERED">Administered</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
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
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              {editingVaccination ? 'Update' : 'Save'} Vaccination
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}