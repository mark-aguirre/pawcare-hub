import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'success';
  delay?: number;
}

const variantStyles = {
  default: {
    card: 'bg-card border-border hover:shadow-card-hover',
    icon: 'bg-secondary text-foreground',
    iconRing: 'ring-secondary',
  },
  primary: {
    card: 'bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 hover:border-primary/40',
    icon: 'bg-gradient-primary text-primary-foreground shadow-glow',
    iconRing: 'ring-primary/20',
  },
  accent: {
    card: 'bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 border-accent/20 hover:border-accent/40',
    icon: 'bg-gradient-accent text-accent-foreground shadow-glow-accent',
    iconRing: 'ring-accent/20',
  },
  warning: {
    card: 'bg-gradient-to-br from-warning/5 via-warning/10 to-warning/5 border-warning/20 hover:border-warning/40',
    icon: 'bg-warning text-warning-foreground',
    iconRing: 'ring-warning/20',
  },
  success: {
    card: 'bg-gradient-to-br from-success/5 via-success/10 to-success/5 border-success/20 hover:border-success/40',
    icon: 'bg-gradient-success text-success-foreground',
    iconRing: 'ring-success/20',
  },
};

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', delay = 0 }: StatCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <div
      className={cn(
        'group relative rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up overflow-hidden',
        styles.card
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-4xl font-display font-bold text-foreground tracking-tight">{value}</p>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1.5 text-sm font-semibold',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}% from yesterday</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'rounded-2xl p-4 ring-4 transition-all duration-300 group-hover:scale-110',
          styles.icon,
          styles.iconRing
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
