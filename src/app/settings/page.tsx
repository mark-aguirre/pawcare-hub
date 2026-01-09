'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Building2, Clock, Bell, Database, Users, Check, ChevronsUpDown, Type, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useClinicSettings, useUpdateClinicSettings, useUsers, useUserPermissions, useUpdateUserPermissions } from '@/hooks/use-settings';
import { toast } from '@/hooks/use-toast';
import { ClinicSettings } from '@/types';

export default function SettingsPage() {
  const { settings: appSettings, updateSettings: updateAppSettings } = useAppSettings();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<string>('');
  const [openUserSelect, setOpenUserSelect] = useState(false);

  // Backend hooks
  const { data: clinicSettings, isLoading: settingsLoading } = useClinicSettings();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: userPermissions } = useUserPermissions(selectedUser);
  const updateClinicMutation = useUpdateClinicSettings();
  const updatePermissionsMutation = useUpdateUserPermissions();

  // Local state for form data
  const [settings, setSettings] = useState<Partial<ClinicSettings>>({});
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

  const isLoading = settingsLoading || usersLoading;

  // Update local state when backend data loads
  useEffect(() => {
    if (clinicSettings) {
      setSettings(clinicSettings);
    }
  }, [clinicSettings]);

  // Update user role when user is selected
  useEffect(() => {
    if (selectedUser && users) {
      const user = users.find(u => u.id === selectedUser);
      setSelectedUserRole(user?.role || '');
    } else {
      setSelectedUserRole('');
    }
  }, [selectedUser, users]);

  // Update user access when user permissions load
  useEffect(() => {
    if (userPermissions) {
      const { appointments, pets, owners, records, inventory, billing, reports, settings } = userPermissions as UserPermissions;
      setUserAccess({ appointments, pets, owners, records, inventory, billing, reports, settings });
    }
  }, [userPermissions]);

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

  const handleSave = async () => {
    try {
      await updateClinicMutation.mutateAsync(settings);
      toast({
        title: 'Settings saved',
        description: 'Your clinic settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) {
      toast({
        title: 'Error',
        description: 'Please select a user first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Update permissions
      await updatePermissionsMutation.mutateAsync({
        userId: selectedUser,
        permissions: userAccess
      });
      
      // Update user role if changed
      const currentUser = users?.find(u => u.id === selectedUser);
      if (currentUser && selectedUserRole !== currentUser.role) {
        await fetch('/api/settings/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser, role: selectedUserRole })
        });
      }
      
      toast({
        title: 'Settings updated',
        description: 'User permissions and role have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    }
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
    <ProtectedRoute requiredPermissions={['settings']}>
      <MainLayout title="Settings" subtitle="Manage your clinic preferences">
        <LoadingWrapper isLoading={isLoading} variant="list">
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
                    value={settings.clinicName || ''}
                    onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email || ''}
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
                    value={settings.workingHoursStart || '08:00'}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      workingHoursStart: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Closing Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={settings.workingHoursEnd || '18:00'}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      workingHoursEnd: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentDuration">Default Appointment Duration (minutes)</Label>
                  <Select
                    value={settings.appointmentDuration?.toString() || '30'}
                    onValueChange={(value) => setSettings({ ...settings, appointmentDuration: parseInt(value) })}
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
                  value={settings.timezone || 'America/New_York'}
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
                  checked={settings.emailNotifications || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                </div>
                <Switch
                  checked={settings.smsNotifications || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send automatic reminders to pet owners</p>
                </div>
                <Switch
                  checked={settings.appointmentReminders || false}
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
                  checked={settings.autoBackup || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>
              {settings.autoBackup && (
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency || 'DAILY'}
                    onValueChange={(value) => setSettings({ ...settings, backupFrequency: value as 'HOURLY' | 'DAILY' | 'WEEKLY' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOURLY">Every Hour</SelectItem>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme || 'SYSTEM'}
                  onValueChange={(value) => setSettings({ ...settings, theme: value as 'LIGHT' | 'DARK' | 'SYSTEM' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIGHT">Light</SelectItem>
                    <SelectItem value="DARK">Dark</SelectItem>
                    <SelectItem value="SYSTEM">System</SelectItem>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          ? users?.find((user) => user.id === selectedUser)?.firstName + ' ' + users?.find((user) => user.id === selectedUser)?.lastName + ' (' + users?.find((user) => user.id === selectedUser)?.role + ')'
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
                            {users?.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.id.toString()}
                                onSelect={(currentValue) => {
                                  const userId = parseInt(currentValue);
                                  setSelectedUser(userId === selectedUser ? null : userId);
                                  setOpenUserSelect(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedUser === user.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {user.firstName} {user.lastName} ({user.role})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userRole">User Role</Label>
                  <Select
                    value={selectedUserRole}
                    onValueChange={setSelectedUserRole}
                    disabled={!selectedUser}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                      <SelectItem value="VETERINARIAN">Veterinarian</SelectItem>
                      <SelectItem value="NURSE">Nurse</SelectItem>
                      <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                      <SelectItem value="TECHNICIAN">Technician</SelectItem>
                      <SelectItem value="OWNER">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

        {/* Save Buttons */}
        <div className="flex justify-end gap-2">
          <Button 
            onClick={handleSavePermissions} 
            variant="outline"
            disabled={!selectedUser || updatePermissionsMutation.isPending}
          >
            {updatePermissionsMutation.isPending ? 'Saving...' : 'Save Permissions'}
          </Button>
          <Button 
            onClick={handleSave} 
            size="lg"
            disabled={updateClinicMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {updateClinicMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Tabs>
      </LoadingWrapper>
    </MainLayout>
    </ProtectedRoute>
  );
}