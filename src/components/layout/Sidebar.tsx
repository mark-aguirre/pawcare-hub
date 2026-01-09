"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRoutePreload } from '@/lib/preload';
import {
  LayoutDashboard,
  PawPrint,
  Users,
  Calendar,
  FileText,
  Package,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Syringe,
  Pill,
  TestTube,
  Globe,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, permissions: [] },
  { name: 'Pets', href: '/pets', icon: PawPrint, permissions: ['pets'] },
  { name: 'Owners', href: '/owners', icon: Users, permissions: ['owners'] },
  { name: 'Appointments', href: '/appointments', icon: Calendar, permissions: ['appointments'] },
  { name: 'Medical Records', href: '/records', icon: FileText, permissions: ['records'] },
  { name: 'Vaccinations', href: '/vaccinations', icon: Syringe, permissions: ['vaccinations'] },
  { name: 'Prescriptions', href: '/prescriptions', icon: Pill, permissions: ['prescriptions'] },
  { name: 'Lab Tests', href: '/lab-tests', icon: TestTube, permissions: ['lab-tests'] },
  { name: 'Inventory', href: '/inventory', icon: Package, permissions: ['inventory'] },
  { name: 'Billing', href: '/billing', icon: Receipt, permissions: ['billing'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, permissions: ['reports'] },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings, permissions: ['settings'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { settings } = useAppSettings();
  const { user, logout } = useAuth();
  const { preloadOnHover } = useRoutePreload();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow overflow-hidden">
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={`${settings.appName} logo`} 
                className="h-full w-full object-cover"
              />
            ) : (
              <PawPrint className="h-6 w-6 text-primary-foreground" />
            )}
            <div className="absolute -right-1 -top-1">
              <Sparkles className="h-4 w-4 text-accent animate-pulse-soft" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-sidebar-foreground tracking-tight">{settings.appName}</h1>
            <p className="text-xs text-sidebar-foreground/50">{settings.appSubtitle}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {navigation
            .filter(item => {
              if (!user) return false;
              if (user.role === 'ADMINISTRATOR') return true;
              return item.permissions.length === 0 || 
                     (item.permissions.includes('pets') && user.role === 'VETERINARIAN') ||
                     (item.permissions.includes('appointments') && ['VETERINARIAN', 'NURSE', 'TECHNICIAN'].includes(user.role));
            })
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                  {...preloadOnHover(item.href)}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-all duration-200',
                      isActive 
                        ? 'text-primary-foreground' 
                        : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground group-hover:scale-110'
                    )}
                  />
                  <span className="tracking-wide">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-3 h-2 w-2 rounded-full bg-primary-foreground/80 animate-pulse-soft" />
                  )}
                </Link>
              );
            })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border px-3 py-4 space-y-1.5">
          {bottomNavigation
            .filter(item => {
              if (!user) return false;
              if (user.role === 'ADMINISTRATOR') return true;
              return false;
            })
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                  {...preloadOnHover(item.href)}
                >
                  <item.icon className="h-5 w-5 text-sidebar-foreground/50 group-hover:text-sidebar-foreground" />
                  {item.name}
                </Link>
              );
            })}
          
          <button 
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-destructive/20 hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}