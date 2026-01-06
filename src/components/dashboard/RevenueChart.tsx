import { TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevenueData {
  day: string;
  revenue: number;
}

const mockRevenueData: RevenueData[] = [
  { day: 'Mon', revenue: 1200 },
  { day: 'Tue', revenue: 1850 },
  { day: 'Wed', revenue: 1400 },
  { day: 'Thu', revenue: 2100 },
  { day: 'Fri', revenue: 1750 },
  { day: 'Sat', revenue: 2300 },
  { day: 'Sun', revenue: 1600 },
];

export function RevenueChart() {
  const maxRevenue = Math.max(...mockRevenueData.map(d => d.revenue));
  const totalWeekRevenue = mockRevenueData.reduce((sum, d) => sum + d.revenue, 0);
  const avgDailyRevenue = totalWeekRevenue / mockRevenueData.length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up shadow-card" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground mb-1">Weekly Revenue</h3>
          <p className="text-sm text-muted-foreground">Last 7 days performance</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-success font-semibold text-sm mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>+12.5%</span>
          </div>
          <p className="text-xs text-muted-foreground">vs last week</p>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <div className="flex items-end justify-between h-32 gap-2">
          {mockRevenueData.map((data, index) => {
            const height = (data.revenue / maxRevenue) * 100;
            const isToday = index === 3; // Thursday is today
            
            return (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full flex items-end justify-center h-24">
                  <div
                    className={cn(
                      'w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer',
                      isToday 
                        ? 'bg-gradient-primary shadow-glow' 
                        : 'bg-secondary hover:bg-secondary/80'
                    )}
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${data.revenue.toLocaleString()}
                  </div>
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  isToday ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {data.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-foreground">
                ${totalWeekRevenue.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Total This Week</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-lg font-bold text-foreground">
                ${Math.round(avgDailyRevenue).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Daily Average</p>
          </div>
        </div>
      </div>
    </div>
  );
}