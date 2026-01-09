"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { useInventory } from '@/hooks/use-inventory';
import { cn } from '@/lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function InventoryAnalytics() {
  const { data: inventoryItems = [], isLoading } = useInventory();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  // Calculate analytics data
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);
  const outOfStockItems = inventoryItems.filter(item => item.currentStock === 0);
  const expiringSoon = inventoryItems.filter(item => 
    item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  // Category distribution
  const categoryData = inventoryItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count,
    percentage: ((count / totalItems) * 100).toFixed(1)
  }));

  // Stock status distribution
  const statusData = inventoryItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status.replace('-', ' '),
    value: count,
    color: status === 'in-stock' ? '#00C49F' : 
           status === 'low-stock' ? '#FFBB28' : 
           status === 'out-of-stock' ? '#FF8042' : '#8884D8'
  }));

  // Value by category
  const categoryValueData = Object.keys(categoryData).map(category => {
    const categoryItems = inventoryItems.filter(item => item.category === category);
    const totalValue = categoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
    return {
      category,
      value: totalValue,
      items: categoryItems.length
    };
  }).sort((a, b) => b.value - a.value);

  // Stock movement simulation (mock data)
  const stockMovementData = [
    { month: 'Jan', inbound: 120, outbound: 80, net: 40 },
    { month: 'Feb', inbound: 150, outbound: 110, net: 40 },
    { month: 'Mar', inbound: 180, outbound: 140, net: 40 },
    { month: 'Apr', inbound: 160, outbound: 120, net: 40 },
    { month: 'May', inbound: 200, outbound: 160, net: 40 },
    { month: 'Jun', inbound: 170, outbound: 130, net: 40 },
  ];

  // Top items by value
  const topValueItems = inventoryItems
    .map(item => ({
      ...item,
      totalValue: item.currentStock * item.unitPrice
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10);

  // Items needing attention
  const itemsNeedingAttention = inventoryItems.filter(item => 
    item.currentStock <= item.minStock || 
    (item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-primary">{totalItems}</p>
                <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 via-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-success">${totalValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Current inventory value</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 via-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Items below minimum</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/5 via-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-destructive">{expiringSoon.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Within 30 days</p>
              </div>
              <Calendar className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Stock Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Value by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryValueData.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{category.category}</span>
                    <span className="font-bold">${category.value.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(category.value / categoryValueData[0].value) * 100} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{category.items} items</span>
                    <span>{((category.value / totalValue) * 100).toFixed(1)}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Movement Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Stock Movement Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockMovementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="inbound" 
                    stackId="1" 
                    stroke="#00C49F" 
                    fill="#00C49F" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="outbound" 
                    stackId="2" 
                    stroke="#FF8042" 
                    fill="#FF8042" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items by Value */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Items by Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topValueItems.slice(0, 8).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.currentStock} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">${item.totalValue.toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Items Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Items Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {itemsNeedingAttention.slice(0, 8).map((item) => {
                const isLowStock = item.currentStock <= item.minStock;
                const isExpiring = item.expiryDate && item.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        item.currentStock === 0 ? "bg-destructive/10 text-destructive" :
                        isLowStock ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                      )}>
                        {item.currentStock === 0 ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Stock: {item.currentStock}</span>
                          {isExpiring && (
                            <Badge variant="destructive" className="text-xs">
                              Expires Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={item.currentStock === 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}