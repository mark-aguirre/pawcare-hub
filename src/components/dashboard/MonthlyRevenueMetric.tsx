'use client';

import { TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MonthlyRevenueMetricProps {
  value: string;
  change: number;
  target: number;
  delay?: number;
}

export function MonthlyRevenueMetric({ value, change, target, delay = 0 }: MonthlyRevenueMetricProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isPositive = change >= 0;
  const progress = Math.min((parseFloat(value.replace(/[^0-9.]/g, '')) / target) * 100, 100);

  return (
    <div 
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-4 rounded-xl bg-card border border-border hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-primary rounded-lg p-2">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div className={cn(
            'flex items-center gap-1 text-xs font-semibold',
            isPositive ? 'text-success' : 'text-destructive'
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? '+' : ''}{change}%
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-2xl font-bold text-foreground">
                {isVisible ? value : '••••'}
              </p>
              <button
                onMouseDown={() => setIsVisible(true)}
                onMouseUp={() => setIsVisible(false)}
                onMouseLeave={() => setIsVisible(false)}
                className="p-1 rounded-md hover:bg-secondary/50 transition-colors"
                title="Hold to show value"
              >
                <Eye className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-500 bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}