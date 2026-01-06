'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { PawPrint, Calendar, FileText, Receipt, Download, Phone, Mail, LogOut } from 'lucide-react';
import { mockPets, mockAppointments, mockMedicalRecords, mockInvoices } from '@/data/mockData';

export default function PortalPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for the logged-in pet owner
  const ownerPets = mockPets.filter(pet => pet.ownerId === 'owner-1'); // Assuming logged-in owner
  const ownerAppointments = mockAppointments.filter(apt => apt.ownerId === 'owner-1');
  const ownerRecords = mockMedicalRecords.filter(record => record.ownerId === 'owner-1');
  const ownerInvoices = mockInvoices.filter(invoice => invoice.ownerId === 'owner-1');

  return (
    <ProtectedRoute requiredPermissions={['portal']}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <LoadingWrapper isLoading={isLoading} variant="dashboard">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                  <PawPrint className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">PawCare Portal</h1>
                  <p className="text-primary-foreground/80">Welcome back, {user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0" onClick={() => window.open('tel:+15551234567')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Clinic
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0" onClick={() => window.open('mailto:info@pawcare.com')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">My Pets</p>
                    <p className="text-3xl font-bold text-blue-900">{ownerPets.length}</p>
                  </div>
                  <PawPrint className="h-10 w-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Appointments</p>
                    <p className="text-3xl font-bold text-green-900">{ownerAppointments.length}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Records</p>
                    <p className="text-3xl font-bold text-purple-900">{ownerRecords.length}</p>
                  </div>
                  <FileText className="h-10 w-10 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Pending Bills</p>
                    <p className="text-3xl font-bold text-orange-900">{ownerInvoices.filter(i => i.status !== 'paid').length}</p>
                  </div>
                  <Receipt className="h-10 w-10 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="pets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="pets" className="text-sm font-medium">My Pets</TabsTrigger>
              <TabsTrigger value="appointments" className="text-sm font-medium">Appointments</TabsTrigger>
              <TabsTrigger value="records" className="text-sm font-medium">Medical Records</TabsTrigger>
              <TabsTrigger value="billing" className="text-sm font-medium">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="pets" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ownerPets.map((pet) => (
                  <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {pet.photoUrl ? (
                          <img src={pet.photoUrl} alt={pet.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary/20" />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-4 border-primary/20">
                            <PawPrint className="h-10 w-10 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-primary">{pet.name}</h3>
                          <p className="text-muted-foreground capitalize text-lg">{pet.species} • {pet.breed}</p>
                          <p className="text-sm text-muted-foreground">{pet.age} years old • {pet.weight}kg</p>
                        </div>
                      </div>
                      {pet.conditions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Health Conditions:</p>
                          <div className="flex flex-wrap gap-2">
                            {pet.conditions.map((condition, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
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
    </ProtectedRoute>
  );
}