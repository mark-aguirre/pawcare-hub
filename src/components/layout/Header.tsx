import { Bell, Search, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div className="animate-slide-in-left">
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">{title}</h1>
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

        {/* User Avatar */}
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
          <Avatar className="relative h-11 w-11 border-2 border-primary/20 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=44&h=44&fit=crop&crop=face" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
