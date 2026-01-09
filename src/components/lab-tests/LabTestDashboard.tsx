'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLabTests } from '@/hooks/use-lab-tests';
import { LabTestAnalytics } from './LabTestAnalytics';
import { exportLabTestsToCSV, printLabTestSummary } from '@/lib/lab-test-utils';
import { TestTube, TrendingUp, Clock, CheckCircle, Download, Printer, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function LabTestDashboard() {
  const { labTests, stats, isLoading } = useLabTests({ autoFetch: true });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
      </div>
    );
  }

  const recentTests = labTests
    .filter(test => {
      const testDate = new Date(test.requestedDate);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return testDate >= sevenDaysAgo;
    })
    .slice(0, 5);

  const urgentTests = labTests.filter(test => {
    if (test.status !== 'requested') return false;
    const requestedDate = new Date(test.requestedDate);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return requestedDate <= threeDaysAgo;
  });

  const completionRate = stats ? (stats.byStatus.completed / stats.total) * 100 : 0;

  return (
    <div className=\"space-y-6\">
      {/* Quick Actions */}
      <div className=\"flex justify-between items-center\">
        <h2 className=\"text-2xl font-bold\">Laboratory Tests Dashboard</h2>
        <div className=\"flex gap-2\">
          <Button
            variant=\"outline\"
            size=\"sm\"
            onClick={() => {
              exportLabTestsToCSV(labTests);
              toast({
                title: \"Export Complete\",
                description: \"Lab tests data has been exported to CSV.\"
              });
            }}
          >
            <Download className=\"h-4 w-4 mr-2\" />
            Export Data
          </Button>
          <Button
            variant=\"outline\"
            size=\"sm\"
            onClick={() => printLabTestSummary(labTests)}
          >
            <Printer className=\"h-4 w-4 mr-2\" />
            Print Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue=\"overview\" className=\"space-y-6\">
        <TabsList>
          <TabsTrigger value=\"overview\">Overview</TabsTrigger>
          <TabsTrigger value=\"analytics\">Analytics</TabsTrigger>
          <TabsTrigger value=\"recent\">Recent Activity</TabsTrigger>
          <TabsTrigger value=\"urgent\">Urgent Items</TabsTrigger>
        </TabsList>

        <TabsContent value=\"overview\" className=\"space-y-6\">
          {/* Key Metrics */}
          <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">
            <Card>
              <CardContent className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-muted-foreground\">Total Tests</p>
                    <p className=\"text-3xl font-bold\">{stats?.total || 0}</p>
                  </div>
                  <TestTube className=\"h-8 w-8 text-primary\" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-muted-foreground\">Completion Rate</p>
                    <p className=\"text-3xl font-bold\">{completionRate.toFixed(1)}%</p>
                  </div>
                  <CheckCircle className=\"h-8 w-8 text-success\" />
                </div>
                <Progress value={completionRate} className=\"mt-2\" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-muted-foreground\">Avg. Completion</p>
                    <p className=\"text-3xl font-bold\">{stats?.avgCompletionTime || 0}</p>
                    <p className=\"text-xs text-muted-foreground\">days</p>
                  </div>
                  <Clock className=\"h-8 w-8 text-warning\" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-muted-foreground\">This Week</p>
                    <p className=\"text-3xl font-bold\">{stats?.recentlyCompleted || 0}</p>
                    <p className=\"text-xs text-muted-foreground\">completed</p>
                  </div>
                  <TrendingUp className=\"h-8 w-8 text-primary\" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
            <Card>
              <CardHeader>
                <CardTitle>Test Status Overview</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"flex items-center justify-between\">
                  <div className=\"flex items-center gap-2\">
                    <Badge variant=\"outline\">Requested</Badge>
                    <span className=\"text-sm text-muted-foreground\">
                      {stats?.byStatus.requested || 0} tests
                    </span>
                  </div>
                  <span className=\"font-medium\">
                    {stats && stats.total > 0 ? ((stats.byStatus.requested / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <Progress 
                  value={stats && stats.total > 0 ? (stats.byStatus.requested / stats.total) * 100 : 0} 
                  className=\"h-2\" 
                />

                <div className=\"flex items-center justify-between\">
                  <div className=\"flex items-center gap-2\">
                    <Badge variant=\"secondary\">In Progress</Badge>
                    <span className=\"text-sm text-muted-foreground\">
                      {stats?.byStatus.inProgress || 0} tests
                    </span>
                  </div>
                  <span className=\"font-medium\">
                    {stats && stats.total > 0 ? ((stats.byStatus.inProgress / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <Progress 
                  value={stats && stats.total > 0 ? (stats.byStatus.inProgress / stats.total) * 100 : 0} 
                  className=\"h-2\" 
                />

                <div className=\"flex items-center justify-between\">
                  <div className=\"flex items-center gap-2\">
                    <Badge variant=\"default\">Completed</Badge>
                    <span className=\"text-sm text-muted-foreground\">
                      {stats?.byStatus.completed || 0} tests
                    </span>
                  </div>
                  <span className=\"font-medium\">{completionRate.toFixed(1)}%</span>
                </div>
                <Progress value={completionRate} className=\"h-2\" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Common Tests</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                {stats && stats.mostCommonTests.length > 0 ? (
                  stats.mostCommonTests.map((test, index) => (
                    <div key={test.type} className=\"flex items-center justify-between\">
                      <div className=\"flex items-center gap-2\">
                        <Badge variant=\"outline\" className=\"text-xs\">
                          #{index + 1}
                        </Badge>
                        <span className=\"text-sm font-medium\">{test.type}</span>
                      </div>
                      <div className=\"flex items-center gap-2\">
                        <span className=\"text-sm text-muted-foreground\">
                          {test.count} tests
                        </span>
                        <Progress 
                          value={stats.total > 0 ? (test.count / stats.total) * 100 : 0} 
                          className=\"w-16 h-2\" 
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className=\"text-sm text-muted-foreground text-center py-4\">
                    No test data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value=\"analytics\">
          <LabTestAnalytics />
        </TabsContent>

        <TabsContent value=\"recent\" className=\"space-y-6\">
          <Card>
            <CardHeader>
              <CardTitle className=\"flex items-center gap-2\">
                <Calendar className=\"h-5 w-5\" />
                Recent Test Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTests.length > 0 ? (
                <div className=\"space-y-4\">
                  {recentTests.map((test) => (
                    <div key={test.id} className=\"flex items-center justify-between p-3 border rounded-lg\">
                      <div className=\"flex items-center gap-3\">
                        <TestTube className=\"h-4 w-4 text-muted-foreground\" />
                        <div>
                          <p className=\"font-medium\">{test.testType}</p>
                          <p className=\"text-sm text-muted-foreground\">
                            {test.petName} • {test.veterinarianName}
                          </p>
                        </div>
                      </div>
                      <div className=\"flex items-center gap-2\">
                        <Badge variant={test.status === 'completed' ? 'default' : test.status === 'in-progress' ? 'secondary' : 'outline'}>
                          {test.status}
                        </Badge>
                        <span className=\"text-sm text-muted-foreground\">
                          {new Date(test.requestedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className=\"text-center text-muted-foreground py-8\">
                  No recent test activity
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value=\"urgent\" className=\"space-y-6\">
          <Card>
            <CardHeader>
              <CardTitle className=\"flex items-center gap-2\">
                <AlertTriangle className=\"h-5 w-5 text-warning\" />
                Urgent Items Requiring Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              {urgentTests.length > 0 ? (
                <div className=\"space-y-4\">
                  {urgentTests.map((test) => (
                    <div key={test.id} className=\"flex items-center justify-between p-3 border border-warning/20 bg-warning/5 rounded-lg\">
                      <div className=\"flex items-center gap-3\">
                        <AlertTriangle className=\"h-4 w-4 text-warning\" />
                        <div>
                          <p className=\"font-medium\">{test.testType}</p>
                          <p className=\"text-sm text-muted-foreground\">
                            {test.petName} • Requested {Math.floor((new Date().getTime() - new Date(test.requestedDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                          </p>
                        </div>
                      </div>
                      <Badge variant=\"outline\" className=\"border-warning text-warning\">
                        Overdue
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className=\"text-center py-8\">
                  <CheckCircle className=\"h-12 w-12 text-success mx-auto mb-2\" />
                  <p className=\"text-muted-foreground\">No urgent items - all tests are on track!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}