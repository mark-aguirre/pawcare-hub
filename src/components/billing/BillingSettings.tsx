"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building, 
  Percent,
  Calendar,
  Hash,
  Save,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { mockBillingSettings } from '@/data/mockData';
import { BillingSettings as BillingSettingsType } from '@/types';
import { cn } from '@/lib/utils';

interface BillingSettingsProps {
  className?: string;
}

export function BillingSettings({ className }: BillingSettingsProps) {
  const [settings, setSettings] = useState<BillingSettingsType>(mockBillingSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateSettings = (field: keyof BillingSettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const updateCompanyInfo = (field: keyof BillingSettingsType['companyInfo'], value: string) => {
    setSettings(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, [field]: value }
    }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHasChanges(false);
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const resetToDefaults = () => {
    setSettings(mockBillingSettings);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Save Status */}
      {(hasChanges || saveSuccess) && (
        <Card className={cn(
          "border-l-4",
          hasChanges && !saveSuccess && "border-l-warning bg-warning/5",
          saveSuccess && "border-l-success bg-success/5"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {hasChanges && !saveSuccess && (
                <>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">You have unsaved changes</span>
                </>
              )}
              {saveSuccess && (
                <>
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Settings saved successfully</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={settings.companyInfo.name}
                onChange={(e) => updateCompanyInfo('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={settings.companyInfo.taxId || ''}
                onChange={(e) => updateCompanyInfo('taxId', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={settings.companyInfo.address}
              onChange={(e) => updateCompanyInfo('address', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  value={settings.companyInfo.phone}
                  onChange={(e) => updateCompanyInfo('phone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={settings.companyInfo.email}
                  onChange={(e) => updateCompanyInfo('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="website"
                  value={settings.companyInfo.website || ''}
                  onChange={(e) => updateCompanyInfo('website', e.target.value)}
                  placeholder="Optional"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Invoice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                value={settings.invoicePrefix}
                onChange={(e) => updateSettings('invoicePrefix', e.target.value)}
                placeholder="INV"
              />
              <p className="text-xs text-muted-foreground">
                Example: {settings.invoicePrefix}-2025-001
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
              <Input
                id="nextInvoiceNumber"
                type="number"
                min="1"
                value={settings.nextInvoiceNumber}
                onChange={(e) => updateSettings('nextInvoiceNumber', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Default Payment Terms (Days)</Label>
              <Input
                id="paymentTerms"
                type="number"
                min="1"
                max="365"
                value={settings.defaultPaymentTerms}
                onChange={(e) => updateSettings('defaultPaymentTerms', parseInt(e.target.value) || 30)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={(settings.taxRate * 100).toFixed(2)}
                  onChange={(e) => updateSettings('taxRate', parseFloat(e.target.value) / 100 || 0)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Late Fee Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Late Fee Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lateFeeRate">Late Fee Rate (% per month)</Label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="lateFeeRate"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={(settings.lateFeeRate * 100).toFixed(2)}
                  onChange={(e) => updateSettings('lateFeeRate', parseFloat(e.target.value) / 100 || 0)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
              <Input
                id="gracePeriod"
                type="number"
                min="0"
                max="30"
                value={settings.lateFeeGracePeriod}
                onChange={(e) => updateSettings('lateFeeGracePeriod', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Example:</strong> With a {(settings.lateFeeRate * 100).toFixed(1)}% monthly rate and {settings.lateFeeGracePeriod} day grace period, 
              a $100 invoice that's 35 days overdue would incur a ${(100 * settings.lateFeeRate).toFixed(2)} late fee.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Next Invoice</h4>
              <Badge variant="outline" className="font-mono">
                {settings.invoicePrefix}-{new Date().getFullYear()}-{settings.nextInvoiceNumber.toString().padStart(3, '0')}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Default Due Date</h4>
              <Badge variant="outline">
                {settings.defaultPaymentTerms} days from issue
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Tax Calculation</h4>
              <p className="text-sm text-muted-foreground">
                $100.00 + ${(100 * settings.taxRate).toFixed(2)} tax = ${(100 * (1 + settings.taxRate)).toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Late Fee Example</h4>
              <p className="text-sm text-muted-foreground">
                {(settings.lateFeeRate * 100).toFixed(1)}% per month after {settings.lateFeeGracePeriod} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-between">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setSettings(mockBillingSettings);
              setHasChanges(false);
              setSaveSuccess(false);
            }}
            disabled={!hasChanges}
          >
            Cancel Changes
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}