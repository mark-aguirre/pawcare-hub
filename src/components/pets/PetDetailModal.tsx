'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Weight, 
  AlertCircle, 
  Heart, 
  Phone, 
  Mail, 
  MapPin,
  Edit,
  FileText,
  Activity
} from 'lucide-react';
import { Pet } from '@/types';
import { usePetAppointments } from '@/hooks/use-pets';
import { EditPetModal } from './EditPetModal';
import { cn } from '@/lib/utils';

interface PetDetailModalProps {
  pet: Pet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const speciesColors = {
  dog: 'bg-primary/10 text-primary border-primary/20',
  cat: 'bg-accent/10 text-accent border-accent/20',
  bird: 'bg-success/10 text-success border-success/20',
  rabbit: 'bg-warning/10 text-warning border-warning/20',
  hamster: 'bg-destructive/10 text-destructive border-destructive/20',
  other: 'bg-secondary text-secondary-foreground border-border',
};

const speciesEmoji = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾',
};

export function PetDetailModal({ pet, open, onOpenChange }: PetDetailModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { data: petAppointments = [] } = usePetAppointments(pet?.id);
  
  if (!pet) return null;

  const owner = pet.owner;
  const age = pet.dateOfBirth ? new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear() : 'Unknown';
  const speciesKey = pet.species.toLowerCase() as keyof typeof speciesColors;
  const displaySpecies = speciesColors[speciesKey] ? speciesKey : 'other';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarFallback className="text-xl">{speciesEmoji[displaySpecies]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{pet.name}</h2>
                <p className="text-muted-foreground">{pet.breed || 'Mixed breed'}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="owner">Owner</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className={cn('border font-semibold', speciesColors[displaySpecies])}>
                      {pet.species}
                    </Badge>
                    {pet.gender && (
                      <Badge variant="secondary">
                        {pet.gender === 'Male' ? '♂ Male' : '♀ Female'}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{age} years old</span>
                    </div>
                    {pet.weight && (
                      <div className="flex items-center gap-2 text-sm">
                        <Weight className="h-4 w-4 text-primary" />
                        <span>{pet.weight} kg</span>
                      </div>
                    )}
                  </div>
                  {pet.color && (
                    <div>
                      <p className="text-sm text-muted-foreground">Color</p>
                      <p className="font-medium">{pet.color}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                    <p className="text-sm text-muted-foreground">No known allergies</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
                    <p className="text-sm text-muted-foreground">No medical conditions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Medical records will be available soon</p>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="space-y-3">
              {petAppointments.length > 0 ? (
                petAppointments.map((appointment: any) => (
                  <Card key={appointment.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold capitalize">{appointment.type?.toLowerCase() || 'Appointment'}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.veterinarianName || 'Dr. Unknown'}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </p>
                        </div>
                        <Badge variant={
                          appointment.status === 'COMPLETED' ? 'default' :
                          appointment.status === 'IN_PROGRESS' ? 'secondary' :
                          'outline'
                        }>
                          {appointment.status?.toLowerCase() || 'scheduled'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No appointments found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="owner" className="space-y-4">
            {owner ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{owner.firstName} {owner.lastName}</h3>
                    <p className="text-sm text-muted-foreground">Pet Owner since {new Date(owner.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{owner.email}</span>
                    </div>
                    {owner.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{owner.phone}</span>
                      </div>
                    )}
                    {owner.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{owner.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Owner information not available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <EditPetModal 
          pet={pet}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
      </DialogContent>
    </Dialog>
  );
}