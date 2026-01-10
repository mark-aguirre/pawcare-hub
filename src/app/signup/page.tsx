'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PawPrint, Eye, EyeOff, Building2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState('owner');
  const [formData, setFormData] = useState({
    clinicCode: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ADMINISTRATOR'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // For clinic owners, don't require clinic code
          clinicCode: activeTab === 'owner' ? null : formData.clinicCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Registration successful',
          description: activeTab === 'owner' 
            ? 'Account created! You can now setup your clinic.' 
            : 'Account created! Please login.',
        });
        router.push('/login');
      } else {
        toast({
          title: 'Registration failed',
          description: data.message || 'Unable to create account',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Unable to connect to server',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
              <PawPrint className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Join PawCare</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owner" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Clinic Owner
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Staff Member
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="owner" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Create your own veterinary practice hub
              </p>
            </TabsContent>
            
            <TabsContent value="staff" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Join an existing clinic with a clinic code
              </p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'staff' && (
              <div className="space-y-2">
                <Label htmlFor="clinicCode">Clinic Code</Label>
                <Input
                  id="clinicCode"
                  type="text"
                  value={formData.clinicCode}
                  onChange={(e) => setFormData(prev => ({...prev, clinicCode: e.target.value}))}
                  placeholder="Enter clinic code (e.g., 00000000)"
                  required
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 
               activeTab === 'owner' ? 'Create Clinic Account' : 'Join Clinic'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}