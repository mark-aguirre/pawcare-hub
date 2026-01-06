'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Building2, Clock, Bell, Database, Users, Check, ChevronsUpDown, Image, Type, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSettings } from '@/contexts/AppSettingsContext';

export default function SettingsPage() {
  const { settings: appSettings, updateSettings: updateAppSettings } = useAppSettings();
  const [selectedUser, setSelectedUser] = useState('');
  const [openUserSelect, setOpenUserSelect] = useState(false);

  const users = [
    { value: 'dr-smith', label: 'Dr. Sarah Smith', role: 'Veterinarian' },
    { value: 'nurse-jones', label: 'Mike Jones', role: 'Veterinary Nurse' },
    { value: 'receptionist-brown', label: 'Lisa Brown', role: 'Receptionist' },
    { value: 'admin-wilson', label: 'John Wilson', role: 'Administrator' },
    { value: 'dr-johnson', label: 'Dr. Emily Johnson', role: 'Veterinarian' },
    { value: 'tech-davis', label: 'Robert Davis', role: 'Veterinary Technician' }
  ];

  const [settings, setSettings] = useState({
    clinicName: 'PawCare Veterinary Clinic',
    address: '123 Pet Street, Animal City, AC 12345',
    phone: '(555) 123-4567',
    email: 'info@pawcare.com',
    timezone: 'America/New_York',
    appointmentDuration: '30',
    workingHours: { start: '08:00', end: '18:00' },
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    autoBackup: true,
    backupFrequency: 'daily',
    theme: 'system'
  });

  const [userAccess, setUserAccess] = useState({
    appointments: true,
    pets: true,
    owners: true,
    records: true,
    inventory: true,
    billing: true,
    reports: false,
    settings: false
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateAppSettings({ logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Settings saved:', { settings, userAccess, appSettings });
  };

  const modules = [
    { key: 'appointments', label: 'Appointments', description: 'View and manage appointments' },
    { key: 'pets', label: 'Pets', description: 'Access pet records and information' },
    { key: 'owners', label: 'Owners', description: 'Manage pet owner information' },
    { key: 'records', label: 'Medical Records', description: 'View and edit medical records' },
    { key: 'inventory', label: 'Inventory', description: 'Manage clinic inventory' },
    { key: 'billing', label: 'Billing', description: 'Handle invoices and payments' },
    { key: 'reports', label: 'Reports', description: 'Generate and view reports' },
    { key: 'settings', label: 'Settings', description: 'Modify system settings' }
  ];

  return (
    <MainLayout title="Settings" subtitle="Manage your clinic preferences">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="access">User Access</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          {/* Application Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Application Branding
              </CardTitle>
              <CardDescription>
                Customize your application name and logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    value={appSettings.appName}
                    onChange={(e) => updateAppSettings({ appName: e.target.value })}
                    placeholder="Enter application name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appSubtitle">Application Subtitle</Label>
                  <Input
                    id="appSubtitle"
                    value={appSettings.appSubtitle}
                    onChange={(e) => updateAppSettings({ appSubtitle: e.target.value })}
                    placeholder="Enter application subtitle"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUpload">Logo Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateAppSettings({ logoUrl: '' })}
                    className="px-3"
                  >
                    Clear
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload an image file. Recommended size: 48x48 pixels.
                </p>
              </div>
              {appSettings.logoUrl && (
                <div className="space-y-2">
                  <Label>Logo Preview</Label>
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow overflow-hidden">
                      <img 
                        src={appSettings.logoUrl} 
                        alt="Logo preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{appSettings.appName}</h3>
                      <p className="text-sm text-muted-foreground">{appSettings.appSubtitle}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          {/* Clinic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Clinic Information
              </CardTitle>
              <CardDescription>
                Basic information about your veterinary clinic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input
                    id="clinicName"
                    value={settings.clinicName}
                    onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule Settings
              </CardTitle>
              <CardDescription>
                Configure your clinic's operating hours and appointment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Opening Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      workingHours: { ...settings.workingHours, start: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Closing Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      workingHours: { ...settings.workingHours, end: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentDuration">Default Appointment Duration (minutes)</Label>
                  <Select
                    value={settings.appointmentDuration}
                    onValueChange={(value) => setSettings({ ...settings, appointmentDuration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications and reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send automatic reminders to pet owners</p>
                </div>
                <Switch
                  checked={settings.appointmentReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, appointmentReminders: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system preferences and data management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>
              {settings.autoBackup && (
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => setSettings({ ...settings, theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Access Control
              </CardTitle>
              <CardDescription>
                Select a user and configure their access to different modules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userSelect">Select User</Label>
                <Popover open={openUserSelect} onOpenChange={setOpenUserSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUserSelect}
                      className="w-full justify-between"
                    >
                      {selectedUser
                        ? users.find((user) => user.value === selectedUser)?.label + ' (' + users.find((user) => user.value === selectedUser)?.role + ')'
                        : "Choose a user to configure access..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.value}
                              value={user.value}
                              onSelect={(currentValue) => {
                                setSelectedUser(currentValue === selectedUser ? "" : currentValue);
                                setOpenUserSelect(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedUser === user.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {user.label} ({user.role})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Module Access Permissions</h4>
                {modules.map((module) => (
                  <div key={module.key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{module.label}</Label>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    <Switch
                      checked={userAccess[module.key as keyof typeof userAccess]}
                      onCheckedChange={(checked) => 
                        setUserAccess({ ...userAccess, [module.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Settings
          </Button>
        </div>
      </Tabs>
    </MainLayout>
  );
}