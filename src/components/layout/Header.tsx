import { Bell, Search, Plus, Sparkles, LogOut, User, Settings, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useClinic } from '@/contexts/ClinicContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { user, logout } = useAuth();
  const { currentClinic } = useClinic();
  
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div className="animate-slide-in-left">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">{title}</h1>
          {currentClinic && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{currentClinic.name}</span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4 animate-slide-in-right">
        {/* Search */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            type="search"
            placeholder="Search pets, owners..."
            className="w-72 pl-11 pr-4 h-11 bg-secondary/50 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-card transition-all"
          />
        </div>

        {/* Action Button */}
        {action && (
          <Button 
            onClick={action.onClick} 
            className="h-11 px-5 rounded-xl bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2"
          >
            <Plus className="h-4 w-4" />
            {action.label}
          </Button>
        )}

        {/* Notifications */}
        <NotificationBell />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
              <Avatar className="relative h-11 w-11 border-2 border-primary/20 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=44&h=44&fit=crop&crop=face" />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            {user?.role === 'ADMINISTRATOR' && (
              <DropdownMenuItem asChild>
                <Link href="/clinics">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Manage Clinics</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}