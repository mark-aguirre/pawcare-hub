'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface NewOwnerPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewOwnerPanel({ open, onOpenChange }: NewOwnerPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('New owner:', formData);
    
    toast({
      title: "Owner Registered",
      description: `${formData.name} has been successfully added as a new client.`,
      variant: "default",
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      notes: '',
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:w-[800px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-primary p-2.5 shadow-glow">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl font-display">Add New Owner</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">Register a new pet owner in the system</p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  placeholder="Street address, city, state, zip code"
                  className="pl-10 min-h-[80px]"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Emergency Contact (Optional)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emergency Contact Name */}
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Contact person name"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                />
              </div>

              {/* Emergency Phone */}
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="+1 (555) 987-6543"
                    className="pl-10"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about the owner..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-glow flex-1"
              disabled={!formData.name || !formData.email || !formData.phone}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Owner
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