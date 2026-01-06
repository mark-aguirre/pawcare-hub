'use client';

import { DollarSign, TrendingUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RevenueStatCardProps {
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function RevenueStatCard({ value, trend, delay = 0 }: RevenueStatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={cn(
        'group relative rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up overflow-hidden',
        'bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 border-accent/20 hover:border-accent/40'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
            <button
              onMouseDown={() => setIsVisible(true)}
              onMouseUp={() => setIsVisible(false)}
              onMouseLeave={() => setIsVisible(false)}
              className="p-1 rounded-md hover:bg-secondary/50 transition-colors"
              title="Hold to show value"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-4xl font-display font-bold text-foreground tracking-tight">
            {isVisible ? value : '••••'}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-success">
              <TrendingUp className="h-4 w-4" />
              <span>+{trend.value}% from yesterday</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'rounded-2xl p-4 ring-4 transition-all duration-300 group-hover:scale-110',
          'bg-gradient-accent text-accent-foreground shadow-glow-accent ring-accent/20'
        )}>
          <DollarSign className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}