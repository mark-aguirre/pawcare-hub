'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  PawPrint,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import { Owner } from '@/types';
import { useOwnerAppointments, useOwnerTotalSpent } from '@/hooks/use-owners';
import { EditOwnerModal } from './EditOwnerModal';

interface OwnerDetailModalProps {
  owner: Owner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const speciesEmoji = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾',
};

export function OwnerDetailModal({ owner, open, onOpenChange }: OwnerDetailModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { data: ownerAppointments = [] } = useOwnerAppointments(owner?.id);
  const { data: totalSpent = 0 } = useOwnerTotalSpent(owner?.id);
  
  if (!owner) return null;

  const ownerPets = owner.pets || [];
  const ownerInvoices: any[] = []; // TODO: Fetch from invoices API
  const fullName = `${owner.firstName} ${owner.lastName}`;
  const initials = `${owner.firstName[0]}${owner.lastName[0]}`;
  const createdDate = new Date(owner.createdAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20 bg-gradient-primary">
                <AvatarFallback className="text-lg font-bold text-primary-foreground bg-transparent">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="text-muted-foreground">Customer since {createdDate.toLocaleDateString()}</p>
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
            <TabsTrigger value="pets">Pets ({ownerPets.length})</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <PawPrint className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{ownerPets.length}</p>
                      <p className="text-sm text-muted-foreground">Pets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{ownerAppointments.length}</p>
                      <p className="text-sm text-muted-foreground">Appointments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownerPets.length > 0 ? (
                ownerPets.map((pet) => (
                  <Card key={pet.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg">{speciesEmoji[pet.species.toLowerCase() as keyof typeof speciesEmoji] || '🐾'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{pet.name}</h4>
                          <p className="text-sm text-muted-foreground">{pet.breed || 'Mixed breed'}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{pet.species}</Badge>
                            {pet.dateOfBirth && (
                              <Badge variant="secondary" className="text-xs">
                                {new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear()}y
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  <PawPrint className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No pets registered</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="space-y-3">
              {ownerAppointments.length > 0 ? (
                ownerAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold capitalize">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.petName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {appointment.date.toLocaleDateString()} at {appointment.time}
                          </p>
                        </div>
                        <Badge variant={
                          appointment.status === 'completed' ? 'default' :
                          appointment.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No appointments found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="space-y-3">
              {ownerInvoices.length > 0 ? (
                ownerInvoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{invoice.invoiceNumber}</h4>
                          <p className="text-sm text-muted-foreground">{invoice.petName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {invoice.issueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${invoice.total.toFixed(2)}</p>
                          <Badge variant={
                            invoice.status === 'paid' ? 'default' :
                            invoice.status === 'overdue' ? 'destructive' :
                            'secondary'
                          }>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No invoices found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <EditOwnerModal 
          owner={owner}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
      </DialogContent>
    </Dialog>
  );
}