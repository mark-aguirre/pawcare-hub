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
import { mockOwners, mockMedicalRecords, mockAppointments } from '@/data/mockData';
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
  if (!pet) return null;

  const owner = mockOwners.find(o => o.id === pet.ownerId);
  const petRecords = mockMedicalRecords.filter(r => r.petId === pet.id);
  const petAppointments = mockAppointments.filter(a => a.petId === pet.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarImage src={pet.photoUrl} alt={pet.name} />
                <AvatarFallback className="text-xl">{speciesEmoji[pet.species]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{pet.name}</h2>
                <p className="text-muted-foreground">{pet.breed}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
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
                    <Badge variant="secondary" className={cn('border font-semibold', speciesColors[pet.species])}>
                      {pet.species}
                    </Badge>
                    <Badge variant="secondary">
                      {pet.gender === 'male' ? '♂ Male' : '♀ Female'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{pet.age} years old</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Weight className="h-4 w-4 text-primary" />
                      <span>{pet.weight} kg</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-medium">{pet.color}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                    {pet.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {pet.allergies.map((allergy, index) => (
                          <Badge key={index} variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No known allergies</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
                    {pet.conditions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {pet.conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                            <Heart className="h-3 w-3 mr-1" />
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No medical conditions</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <div className="space-y-3">
              {petRecords.length > 0 ? (
                petRecords.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{record.title}</h4>
                            <p className="text-sm text-muted-foreground">{record.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {record.date.toLocaleDateString()} • {record.veterinarianName}
                            </p>
                          </div>
                        </div>
                        <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </div>
                      {record.notes && (
                        <p className="text-sm mt-3 p-3 bg-secondary/50 rounded-lg">{record.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No medical records found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="space-y-3">
              {petAppointments.length > 0 ? (
                petAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold capitalize">{appointment.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date.toLocaleDateString()} at {appointment.time}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {appointment.veterinarianName} • {appointment.duration} minutes
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          appointment.status === 'completed' ? 'default' :
                          appointment.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm mt-3 p-3 bg-secondary/50 rounded-lg">{appointment.notes}</p>
                      )}
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
            {owner && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{owner.name}</h3>
                    <p className="text-sm text-muted-foreground">Pet Owner since {owner.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{owner.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{owner.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{owner.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}