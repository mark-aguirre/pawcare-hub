import { TrendingUp, TrendingDown, Target, Award, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonthlyRevenueMetric } from './MonthlyRevenueMetric';

interface MetricProps {
  label: string;
  value: string;
  change: number;
  target?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function Metric({ label, value, change, target, icon: Icon, color }: MetricProps) {
  const isPositive = change >= 0;
  const progress = target ? Math.min((parseFloat(value.replace(/[^0-9.]/g, '')) / target) * 100, 100) : 0;

  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('rounded-lg p-2', color)}>
          <Icon className="h-4 w-4 text-white" />
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
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        
        {target && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div
                className={cn('h-1.5 rounded-full transition-all duration-500', color.replace('bg-', 'bg-'))}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PerformanceSummary() {
  const metrics = [
    {
      label: 'Patient Satisfaction',
      value: '4.8/5',
      change: 2.1,
      target: 5,
      icon: Award,
      color: 'bg-success',
    },
    {
      label: 'Active Clients',
      value: '1,247',
      change: 8.7,
      target: 1500,
      icon: Users,
      color: 'bg-accent',
    },
    {
      label: 'Appointment Rate',
      value: '94%',
      change: -1.2,
      target: 95,
      icon: Calendar,
      color: 'bg-warning',
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-2.5 shadow-glow">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">Performance Summary</h3>
            <p className="text-sm text-muted-foreground">Key metrics for this month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MonthlyRevenueMetric
          value="$24,500"
          change={15.2}
          target={30000}
          delay={300}
        />
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="animate-slide-up"
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <Metric {...metric} />
          </div>
        ))}
      </div>

      {/* Summary insights */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-success">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Revenue is trending 15% above target</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Client base growing steadily</span>
          </div>
        </div>
      </div>
    </div>
  );
}