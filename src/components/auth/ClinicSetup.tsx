'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clinic } from '@/types';
import { useClinic } from '@/contexts/ClinicContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface ClinicSetupProps {
  onComplete: () => void;
}

export function ClinicSetup({ onComplete }: ClinicSetupProps) {
  const { setCurrentClinic } = useClinic();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    subscription: 'BASIC' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/clinics', {
        ...formData,
        userId: user.id
      });
      
      if (response.success && response.clinic) {
        // Convert backend clinic format to frontend format
        const clinic: Clinic = {
          id: response.clinic.id.toString(),
          code: response.clinic.clinicCode,
          name: response.clinic.clinicName,
          address: response.clinic.address,
          phone: response.clinic.phone,
          email: response.clinic.email,
          website: formData.website,
          ownerId: user.id,
          subscription: formData.subscription,
          isActive: true,
          createdAt: response.clinic.createdAt,
          updatedAt: response.clinic.updatedAt
        };
        
        setCurrentClinic(clinic);
        onComplete();
      }
    } catch (error) {
      console.error('Failed to create clinic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Setup Your Veterinary Clinic</CardTitle>
          <CardDescription>
            Configure your PawCare Hub to get started with managing your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Clinic Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Happy Paws Veterinary Clinic"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main Street, City, State 12345"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="info@happypaws.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://happypaws.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription">Subscription Plan</Label>
              <Select 
                value={formData.subscription} 
                onValueChange={(value: 'BASIC' | 'PREMIUM' | 'ENTERPRISE') => 
                  setFormData(prev => ({ ...prev, subscription: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic - $29/month</SelectItem>
                  <SelectItem value="PREMIUM">Premium - $59/month</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise - $99/month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Clinic...' : 'Create My Clinic Hub'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}