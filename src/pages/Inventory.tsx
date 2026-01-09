"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InventoryCard } from '@/components/inventory/InventoryCard';
import { InventoryDetailPanel } from '@/components/inventory/InventoryDetailModal';
import { InventoryFormPanel } from '@/components/inventory/InventoryFormModal';
import { StockAdjustmentPanel } from '@/components/inventory/StockAdjustmentModal';
import { InventoryAnalytics } from '@/components/inventory/InventoryAnalytics';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Package, 
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Plus,
  Download,
  Upload,
  BarChart3,
  Pill,
  Wrench,
  ShoppingCart,
  Heart,
  Calendar,
  Clock
} from 'lucide-react';
import { InventoryItem } from '@/types';
import * as XLSX from 'xlsx';
import { 
  useInventory, 
  useCreateInventoryItem, 
  useUpdateInventoryItem, 
  useAdjustStock 
} from '@/hooks/use-inventory';
import { toast } from '@/hooks/use-toast';

const statusFilters = ['all', 'in-stock', 'low-stock', 'out-of-stock', 'expired'] as const;
const categoryFilters = ['all', 'medication', 'supplies', 'equipment', 'food', 'toys', 'other'] as const;

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<typeof statusFilters[number]>('all');
  const [selectedCategory, setSelectedCategory] = useState<typeof categoryFilters[number]>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'expiry'>('name');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const { data: inventoryItems = [], isLoading, error } = useInventory();
  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();
  const adjustStockMutation = useAdjustStock();

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock':
        return a.currentStock - b.currentStock;
      case 'price':
        return a.unitPrice - b.unitPrice;
      case 'expiry':
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = inventoryItems.filter(item => item.status === 'out-of-stock').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const expiringSoon = inventoryItems.filter(item => 
    item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsFormModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleStockAdjustment = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsStockAdjustmentOpen(true);
  };

  const handleSaveItem = (itemData: Partial<InventoryItem>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: itemData });
    } else {
      createMutation.mutate(itemData as Omit<InventoryItem, 'id' | 'createdAt'>);
    }
    setIsFormModalOpen(false);
  };

  const handleStockAdjustmentSubmit = (itemId: string, adjustment: any) => {
    adjustStockMutation.mutate({ id: itemId, adjustment });
    setIsStockAdjustmentOpen(false);
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Name', 'SKU', 'Category', 'Current Stock', 'Unit Price', 'Total Value', 'Status', 'Location'],
      ...inventoryItems.map(item => [
        item.name,
        item.sku,
        item.category,
        item.currentStock,
        item.unitPrice,
        (item.currentStock * item.unitPrice).toFixed(2),
        item.status,
        item.location
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportInventory = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          toast({ title: 'Error', description: 'File must have headers and data rows', variant: 'destructive' });
          return;
        }

        const headers = jsonData[0].map(h => h?.toString().toLowerCase());
        const rows = jsonData.slice(1);
        
        let imported = 0;
        for (const row of rows) {
          if (!row[0]) continue; // Skip empty rows
          
          const item = {
            name: row[headers.indexOf('name')] || row[0],
            sku: row[headers.indexOf('sku')] || `SKU-${Date.now()}-${imported}`,
            category: (row[headers.indexOf('category')] || 'SUPPLIES').toUpperCase(),
            description: row[headers.indexOf('description')] || '',
            currentStock: parseInt(row[headers.indexOf('currentstock') || headers.indexOf('stock')]) || 0,
            minStock: parseInt(row[headers.indexOf('minstock')]) || 0,
            maxStock: parseInt(row[headers.indexOf('maxstock')]) || 100,
            unitPrice: parseFloat(row[headers.indexOf('unitprice') || headers.indexOf('price')]) || 0,
            supplier: row[headers.indexOf('supplier')] || 'Unknown',
            location: row[headers.indexOf('location')] || 'Storage',
            batchNumber: row[headers.indexOf('batchnumber')] || '',
            notes: row[headers.indexOf('notes')] || ''
          };
          
          try {
            await createMutation.mutateAsync(item);
            imported++;
          } catch (error) {
            console.error('Failed to import item:', item.name, error);
          }
        }
        
        toast({ 
          title: 'Import Complete', 
          description: `Successfully imported ${imported} items from ${file.name}` 
        });
      } catch (error) {
        toast({ 
          title: 'Import Failed', 
          description: 'Error reading file. Please check format.', 
          variant: 'destructive' 
        });
      }
    };
    input.click();
  };

  if (error) {
    return (
      <MainLayout title="Inventory Management" subtitle="Error loading inventory">
        <Card className="p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load inventory</h3>
          <p className="text-muted-foreground mb-4">
            Unable to connect to the inventory service. Please check your connection.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Inventory Management"
      subtitle={`${totalItems} total items • ${lowStockItems} low stock • ${outOfStockItems} out of stock`}
      action={{ label: 'Add Item', onClick: handleCreateItem }}
    >
      <LoadingWrapper isLoading={isLoading} variant="billing">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                        <p className="text-2xl font-bold text-primary">{totalItems}</p>
                      </div>
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warning/5 via-warning/10 to-warning/5 border-warning/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                        <p className="text-2xl font-bold text-warning">{lowStockItems}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-warning" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-destructive/5 via-destructive/10 to-destructive/5 border-destructive/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                        <p className="text-2xl font-bold text-destructive">{outOfStockItems}</p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-destructive" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success/5 via-success/10 to-success/5 border-success/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-bold text-success">${totalValue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-success" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search by name, SKU, supplier, or location..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="name">Sort by Name</option>
                          <option value="stock">Sort by Stock</option>
                          <option value="price">Sort by Price</option>
                          <option value="expiry">Sort by Expiry</option>
                        </select>
                      </div>
                    </div>

                    <Tabs defaultValue="status" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="status">Status</TabsTrigger>
                        <TabsTrigger value="category">Category</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="status" className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {statusFilters.map((status) => (
                            <Button
                              key={status}
                              variant={selectedStatus === status ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedStatus(status)}
                              className="capitalize"
                            >
                              {status === 'all' ? 'All Status' : status.replace('-', ' ')}
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="category" className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {categoryFilters.map((category) => (
                            <Button
                              key={category}
                              variant={selectedCategory === category ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedCategory(category)}
                              className="capitalize"
                            >
                              {category === 'all' ? 'All Categories' : category}
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredItems.map((item, index) => (
                      <InventoryCard
                        key={item.id}
                        item={item}
                        delay={index * 50}
                        onClick={() => handleItemClick(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
                    <p className="text-muted-foreground mb-4">
                      {search || selectedStatus !== 'all' || selectedCategory !== 'all'
                        ? 'Try adjusting your filters or search terms.'
                        : 'No inventory items have been added yet.'}
                    </p>
                    <Button onClick={() => {
                      setSearch('');
                      setSelectedStatus('all');
                      setSelectedCategory('all');
                    }}>
                      Clear Filters
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={handleCreateItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleImportInventory}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Inventory
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleExportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('analytics')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lowStockItems > 0 && (
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <div className="flex items-center gap-2 text-warning mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Low Stock Alert</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lowStockItems} items are running low on stock
                      </p>
                    </div>
                  )}
                  
                  {outOfStockItems > 0 && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 text-destructive mb-1">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-medium">Out of Stock</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {outOfStockItems} items are completely out of stock
                      </p>
                    </div>
                  )}

                  {expiringSoon > 0 && (
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <div className="flex items-center gap-2 text-warning mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Expiring Soon</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {expiringSoon} items expire within 30 days
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { category: 'medication', icon: Pill, count: inventoryItems.filter(i => i.category.toLowerCase() === 'medication').length },
                    { category: 'supplies', icon: Package, count: inventoryItems.filter(i => i.category.toLowerCase() === 'supplies').length },
                    { category: 'equipment', icon: Wrench, count: inventoryItems.filter(i => i.category.toLowerCase() === 'equipment').length },
                    { category: 'food', icon: ShoppingCart, count: inventoryItems.filter(i => i.category.toLowerCase() === 'food').length },
                    { category: 'toys', icon: Heart, count: inventoryItems.filter(i => i.category.toLowerCase() === 'toys').length },
                  ].map(({ category, icon: Icon, count }) => (
                    <div key={category} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground capitalize">
                          {category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {count} items
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inventoryItems
                    .sort((a, b) => new Date(b.lastRestocked).getTime() - new Date(a.lastRestocked).getTime())
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                          <Package className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Restocked • {new Date(item.lastRestocked).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <InventoryAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Inventory Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Download className="h-6 w-6" />
                  <span>Stock Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span>Low Stock Alert</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Expiry Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Valuation Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Movement Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Package className="h-6 w-6" />
                  <span>Category Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </LoadingWrapper>

      <InventoryDetailPanel
        item={selectedItem}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onEdit={handleEditItem}
        onStockAdjustment={handleStockAdjustment}
      />

      <InventoryFormPanel
        item={editingItem}
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSave={handleSaveItem}
      />

      <StockAdjustmentPanel
        item={selectedItem}
        open={isStockAdjustmentOpen}
        onOpenChange={setIsStockAdjustmentOpen}
        onAdjustment={handleStockAdjustmentSubmit}
      />
    </MainLayout>
  );
}