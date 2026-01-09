'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLabTests } from '@/hooks/use-lab-tests';
import { TestTube, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export function LabTestAnalytics() {
  const { stats, isLoading } = useLabTests({ autoFetch: true });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const completionRate = stats.total > 0 ? (stats.byStatus.completed / stats.total) * 100 : 0;
  const inProgressRate = stats.total > 0 ? (stats.byStatus.inProgress / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <TestTube className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold">{completionRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Completion Time</p>
                <p className="text-3xl font-bold">{stats.avgCompletionTime}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recently Completed</p>
                <p className="text-3xl font-bold">{stats.recentlyCompleted}</p>
                <p className="text-xs text-muted-foreground">last 7 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Requested</Badge>
                <span className="text-sm text-muted-foreground">
                  {stats.byStatus.requested} tests
                </span>
              </div>
              <span className="font-medium">
                {stats.total > 0 ? ((stats.byStatus.requested / stats.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <Progress 
              value={stats.total > 0 ? (stats.byStatus.requested / stats.total) * 100 : 0} 
              className="h-2" 
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">In Progress</Badge>
                <span className="text-sm text-muted-foreground">
                  {stats.byStatus.inProgress} tests
                </span>
              </div>
              <span className="font-medium">
                {stats.total > 0 ? ((stats.byStatus.inProgress / stats.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <Progress 
              value={inProgressRate} 
              className="h-2" 
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default">Completed</Badge>
                <span className="text-sm text-muted-foreground">
                  {stats.byStatus.completed} tests
                </span>
              </div>
              <span className="font-medium">
                {completionRate.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={completionRate} 
              className="h-2" 
            />

            {stats.byStatus.cancelled > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Cancelled</Badge>
                    <span className="text-sm text-muted-foreground">
                      {stats.byStatus.cancelled} tests
                    </span>
                  </div>
                  <span className="font-medium">
                    {stats.total > 0 ? ((stats.byStatus.cancelled / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <Progress 
                  value={stats.total > 0 ? (stats.byStatus.cancelled / stats.total) * 100 : 0} 
                  className="h-2" 
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Common Test Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.mostCommonTests.length > 0 ? (
              stats.mostCommonTests.map((test, index) => (
                <div key={test.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm font-medium">{test.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {test.count} tests
                    </span>
                    <Progress 
                      value={stats.total > 0 ? (test.count / stats.total) * 100 : 0} 
                      className="w-16 h-2" 
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No test data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}