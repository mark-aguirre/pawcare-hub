'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { mockInvoices, mockAppointments, mockPets, mockMedicalRecords } from '@/data/mockData';
import { Calendar, DollarSign, Users, Activity, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { useState } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30');

  // Revenue Analytics
  const revenueData = mockInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((acc, inv) => {
      const month = inv.paidDate?.toLocaleDateString('en-US', { month: 'short' }) || 'Unknown';
      acc[month] = (acc[month] || 0) + inv.total;
      return acc;
    }, {} as Record<string, number>);

  const monthlyRevenue = Object.entries(revenueData).map(([month, revenue]) => ({
    month,
    revenue: Math.round(revenue)
  }));

  // Appointment Statistics
  const appointmentsByType = mockAppointments.reduce((acc, apt) => {
    acc[apt.type] = (acc[apt.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const appointmentTypeData = Object.entries(appointmentsByType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    value: count
  }));

  // Pet Demographics
  const petsBySpecies = mockPets.reduce((acc, pet) => {
    acc[pet.species] = (acc[pet.species] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const speciesData = Object.entries(petsBySpecies).map(([species, count]) => ({
    species: species.charAt(0).toUpperCase() + species.slice(1),
    count,
    value: count
  }));

  // Service Revenue
  const serviceRevenue = mockInvoices
    .filter(inv => inv.status === 'paid')
    .flatMap(inv => inv.items)
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.total;
      return acc;
    }, {} as Record<string, number>);

  const serviceRevenueData = Object.entries(serviceRevenue).map(([service, revenue]) => ({
    service: service.charAt(0).toUpperCase() + service.slice(1),
    revenue: Math.round(revenue)
  }));

  // Key Metrics
  const totalRevenue = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalAppointments = mockAppointments.length;
  const totalPets = mockPets.length;
  const completedRecords = mockMedicalRecords.filter(record => record.status === 'completed').length;

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <MainLayout title="Reports & Analytics" subtitle="Comprehensive insights and performance metrics">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pets</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPets}</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Records</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRecords}</div>
              <p className="text-xs text-muted-foreground">+15% completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="demographics">Pet Demographics</TabsTrigger>
            <TabsTrigger value="services">Service Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Revenue Trend
                  </CardTitle>
                  <CardDescription>Revenue performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <AreaChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue by service category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={serviceRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="service" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Types Distribution</CardTitle>
                  <CardDescription>Breakdown of appointment categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={appointmentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {appointmentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Volume</CardTitle>
                  <CardDescription>Number of appointments by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={appointmentTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Pet Species Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of pets by species</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={speciesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ species, percent }) => `${species} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {speciesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pet Count by Species</CardTitle>
                  <CardDescription>Total number of pets registered</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={speciesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="species" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Performance Overview</CardTitle>
                  <CardDescription>Revenue and volume metrics by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">${serviceRevenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Service Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{serviceRevenueData.length}</div>
                      <div className="text-sm text-muted-foreground">Service Categories</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">${Math.round(serviceRevenueData.reduce((sum, item) => sum + item.revenue, 0) / serviceRevenueData.length).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Average per Category</div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={serviceRevenueData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="service" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="#FF8042" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}