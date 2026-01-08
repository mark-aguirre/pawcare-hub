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

export default function PortalPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [ownerPets, setOwnerPets] = useState([]);
  const [ownerAppointments, setOwnerAppointments] = useState([]);
  const [ownerRecords, setOwnerRecords] = useState([]);
  const [ownerInvoices, setOwnerInvoices] = useState([]);

  useEffect(() => {
    const fetchPortalData = async () => {
      if (!user?.id) return;
      
      try {
        const ownerId = user.id; // Use user ID directly since auth returns owner data
        
        const [pets, appointments, records, invoices] = await Promise.all([
          fetch(`/api/portal/pets?ownerId=${ownerId}`).then(res => res.json()),
          fetch(`/api/portal/appointments?ownerId=${ownerId}`).then(res => res.json()),
          fetch(`/api/portal/records?ownerId=${ownerId}`).then(res => res.json()),
          fetch(`/api/portal/billing?ownerId=${ownerId}`).then(res => res.json())
        ]);
        
        setOwnerPets(pets);
        setOwnerAppointments(appointments);
        setOwnerRecords(records);
        setOwnerInvoices(invoices);
      } catch (error) {
        console.error('Failed to fetch portal data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortalData();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  return (
    <ProtectedRoute requiredPermissions={['portal']}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <LoadingWrapper isLoading={isLoading} variant="dashboard">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                  <PawPrint className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">PawCare Portal</h1>
                  <p className="text-primary-foreground/80">Welcome back, {user?.firstName || user?.name}</p>
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
          {/* Main Content */}
          <Tabs defaultValue="pets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-1">
              <TabsTrigger value="pets" className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg">
                <PawPrint className="h-4 w-4 mr-2" />
                My Pets ({Array.isArray(ownerPets) ? ownerPets.length : 0})
              </TabsTrigger>
              <TabsTrigger value="appointments" className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments ({Array.isArray(ownerAppointments) ? ownerAppointments.length : 0})
              </TabsTrigger>
              <TabsTrigger value="records" className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg">
                <FileText className="h-4 w-4 mr-2" />
                Medical Records ({Array.isArray(ownerRecords) ? ownerRecords.length : 0})
              </TabsTrigger>
              <TabsTrigger value="billing" className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg">
                <Receipt className="h-4 w-4 mr-2" />
                Billing ({Array.isArray(ownerInvoices) ? ownerInvoices.filter(i => i.status !== 'paid').length : 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pets" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(ownerPets) && ownerPets.map((pet) => (
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
                      {pet.conditions && pet.conditions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Health Conditions:</p>
                          <div className="flex flex-wrap gap-2">
                            {pet.conditions && pet.conditions.map((condition, index) => (
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
              {Array.isArray(ownerAppointments) && ownerAppointments.map((appointment) => (
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
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
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
                            {new Date(record.date).toLocaleDateString()} • {record.veterinarianName}
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
              {Array.isArray(ownerInvoices) && ownerInvoices.map((invoice) => (
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
                            Issued: {new Date(invoice.issueDate).toLocaleDateString()}
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