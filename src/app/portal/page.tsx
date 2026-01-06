'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { PawPrint, Calendar, FileText, Receipt, Download, Phone, Mail } from 'lucide-react';
import { mockPets, mockAppointments, mockMedicalRecords, mockInvoices } from '@/data/mockData';

export default function PortalPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (user?.role !== 'pet-owner') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">This portal is only available to pet owners.</p>
        </div>
      </div>
    );
  }

  // Mock data for the logged-in pet owner
  const ownerPets = mockPets.filter(pet => pet.ownerId === 'owner-1'); // Assuming logged-in owner
  const ownerAppointments = mockAppointments.filter(apt => apt.ownerId === 'owner-1');
  const ownerRecords = mockMedicalRecords.filter(record => record.ownerId === 'owner-1');
  const ownerInvoices = mockInvoices.filter(invoice => invoice.ownerId === 'owner-1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <LoadingWrapper isLoading={isLoading} variant="dashboard">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <PawPrint className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">PawCare Portal</h1>
                  <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Clinic
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">My Pets</p>
                    <p className="text-2xl font-bold">{ownerPets.length}</p>
                  </div>
                  <PawPrint className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                    <p className="text-2xl font-bold">{ownerAppointments.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medical Records</p>
                    <p className="text-2xl font-bold">{ownerRecords.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Bills</p>
                    <p className="text-2xl font-bold">{ownerInvoices.filter(i => i.status !== 'paid').length}</p>
                  </div>
                  <Receipt className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="pets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pets">My Pets</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="pets" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownerPets.map((pet) => (
                  <Card key={pet.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {pet.photoUrl ? (
                          <img src={pet.photoUrl} alt={pet.name} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <PawPrint className="h-8 w-8 text-primary" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{pet.name}</h3>
                          <p className="text-muted-foreground capitalize">{pet.species} • {pet.breed}</p>
                          <p className="text-sm text-muted-foreground">{pet.age} years old • {pet.weight}kg</p>
                        </div>
                      </div>
                      {pet.conditions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Conditions:</p>
                          <div className="flex flex-wrap gap-1">
                            {pet.conditions.map((condition, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              {ownerAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{appointment.petName}</h3>
                          <p className="text-muted-foreground capitalize">{appointment.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date.toLocaleDateString()} at {appointment.time}
                          </p>
                          <p className="text-sm text-muted-foreground">{appointment.veterinarianName}</p>
                        </div>
                      </div>
                      <Badge variant={
                        appointment.status === 'completed' ? 'default' :
                        appointment.status === 'scheduled' ? 'secondary' : 'outline'
                      }>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              {ownerRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{record.title}</h3>
                          <p className="text-muted-foreground">{record.petName}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.date.toLocaleDateString()} • {record.veterinarianName}
                          </p>
                          <p className="text-sm mt-2">{record.description}</p>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Notes:</span> {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              {ownerInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          <Receipt className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                          <p className="text-muted-foreground">{invoice.petName}</p>
                          <p className="text-sm text-muted-foreground">
                            Issued: {invoice.issueDate.toLocaleDateString()}
                          </p>
                          <p className="text-lg font-semibold mt-1">${invoice.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' :
                          invoice.status === 'overdue' ? 'destructive' : 'secondary'
                        }>
                          {invoice.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        {invoice.status !== 'paid' && (
                          <Button size="sm">
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </LoadingWrapper>
    </div>
  );
}