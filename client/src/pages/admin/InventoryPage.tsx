import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import LowStockAlerts from "@/components/LowStockAlerts";
import StockAdjustmentDialog from "@/components/StockAdjustmentDialog";
import StockHistoryView from "@/components/StockHistoryView";
import BatchManagementView from "@/components/BatchManagementView";
import BulkStockUpdateDialog from "@/components/BulkStockUpdateDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Download, Package, History, PackageOpen, PackageSearch, PackageX, Search, AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: string;
  productName: string;
  currentStock: number;
  reservedStock: number;
  reorderPoint: number;
}

type FilterType = "all" | "low" | "out";

export default function InventoryPage() {
  const [, setLocation] = useLocation();
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [stockHistoryOpen, setStockHistoryOpen] = useState(false);
  const [batchManagementOpen, setBatchManagementOpen] = useState(false);
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "1",
      productName: "Hydrating Serum",
      currentStock: 50,
      reservedStock: 10,
      reorderPoint: 20,
    },
    {
      id: "2",
      productName: "Daily Moisturizer",
      currentStock: 15,
      reservedStock: 5,
      reorderPoint: 25,
    },
    {
      id: "3",
      productName: "Gentle Cleanser",
      currentStock: 0,
      reservedStock: 0,
      reorderPoint: 30,
    },
    {
      id: "4",
      productName: "Night Cream",
      currentStock: 75,
      reservedStock: 15,
      reorderPoint: 20,
    },
    {
      id: "5",
      productName: "Eye Cream",
      currentStock: 8,
      reservedStock: 3,
      reorderPoint: 15,
    },
    {
      id: "6",
      productName: "Vitamin C Serum",
      currentStock: 0,
      reservedStock: 0,
      reorderPoint: 25,
    },
    {
      id: "7",
      productName: "Sunscreen SPF 50",
      currentStock: 120,
      reservedStock: 20,
      reorderPoint: 40,
    },
    {
      id: "8",
      productName: "Retinol Cream",
      currentStock: 12,
      reservedStock: 4,
      reorderPoint: 20,
    },
  ]);

  const getStockStatus = (item: InventoryItem): "good" | "low" | "out" => {
    const availableStock = item.currentStock - item.reservedStock;
    if (item.currentStock === 0) return "out";
    if (availableStock <= item.reorderPoint) return "low";
    return "good";
  };

  const getStatusBadge = (status: "good" | "low" | "out") => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-500 hover:bg-green-600 transition-colors" data-testid="badge-status-good">In Stock</Badge>;
      case "low":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 transition-colors" data-testid="badge-status-low">Low Stock</Badge>;
      case "out":
        return <Badge variant="destructive" className="transition-colors" data-testid="badge-status-out">Out of Stock</Badge>;
    }
  };

  const filteredItems = useMemo(() => {
    let items = inventoryItems;

    if (filter !== "all") {
      items = items.filter((item) => getStockStatus(item) === filter);
    }

    if (searchQuery) {
      items = items.filter((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [inventoryItems, filter, searchQuery]);

  const lowStockCount = inventoryItems.filter((item) => getStockStatus(item) === "low").length;
  const outOfStockCount = inventoryItems.filter((item) => getStockStatus(item) === "out").length;

  const handleExportReport = () => {
    console.log("Exporting inventory report...");
    const csvContent = [
      ["Product Name", "Current Stock", "Reserved Stock", "Available Stock", "Reorder Point", "Status"],
      ...inventoryItems.map((item) => [
        item.productName,
        item.currentStock.toString(),
        item.reservedStock.toString(),
        (item.currentStock - item.reservedStock).toString(),
        item.reorderPoint.toString(),
        getStockStatus(item),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkStockUpdate = () => {
    setBulkUpdateOpen(true);
  };

  const handleViewHistory = () => {
    setStockHistoryOpen(true);
  };

  const handleManageBatches = () => {
    setBatchManagementOpen(true);
  };

  const products = inventoryItems.map((item) => ({
    id: item.id,
    name: item.productName,
  }));

  const getEmptyStateContent = () => {
    if (searchQuery && filteredItems.length === 0) {
      return {
        icon: PackageSearch,
        title: "No products match your search",
        description: `We couldn't find any products matching "${searchQuery}". Try adjusting your search terms.`,
      };
    }

    switch (filter) {
      case "low":
        return {
          icon: Package,
          title: "No low stock items",
          description: "Great news! All your products are well-stocked above their reorder points.",
        };
      case "out":
        return {
          icon: PackageX,
          title: "No out of stock items",
          description: "Excellent! All products currently have inventory available.",
        };
      default:
        return {
          icon: Package,
          title: "No inventory items yet",
          description: "Start by adding products to your inventory using the Stock Adjustment button.",
        };
    }
  };

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <div data-testid="inventory-page" className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
              <p className="text-sm text-slate-500 mt-2">Track and manage your product inventory</p>
            </div>
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 transition-all shadow-sm hover:shadow-md sm:w-auto w-full"
              onClick={() => setAdjustmentDialogOpen(true)}
              data-testid="button-add-adjustment"
            >
              <Plus className="h-4 w-4 mr-2" />
              Stock Adjustment
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleViewHistory}
              data-testid="button-view-history"
              className="transition-all hover:bg-slate-50 hover:border-cyan-300 shadow-sm"
            >
              <History className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Stock History</span>
              <span className="sm:hidden">History</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleManageBatches}
              data-testid="button-manage-batches"
              className="transition-all hover:bg-slate-50 hover:border-cyan-300 shadow-sm"
            >
              <PackageOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Manage Batches</span>
              <span className="sm:hidden">Batches</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleBulkStockUpdate}
              data-testid="button-bulk-update"
              className="transition-all hover:bg-slate-50 hover:border-cyan-300 shadow-sm"
            >
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Bulk Update</span>
              <span className="sm:hidden">Bulk</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleExportReport}
              data-testid="button-export-report"
              className="transition-all hover:bg-slate-50 hover:border-cyan-300 shadow-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        <LowStockAlerts
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
          expiringBatchesCount={3}
          onFilterLowStock={() => setFilter("low")}
          onFilterOutOfStock={() => setFilter("out")}
          onFilterExpiringBatches={() => console.log("Filter expiring batches")}
        />

        <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "bg-cyan-500 hover:bg-cyan-600 transition-all shadow-sm" : "transition-all hover:bg-slate-50 hover:border-cyan-200 shadow-sm"}
                  data-testid="button-filter-all"
                >
                  <Package className="h-4 w-4 mr-2" />
                  All Products
                </Button>
                <Button
                  variant={filter === "low" ? "default" : "outline"}
                  onClick={() => setFilter("low")}
                  className={filter === "low" ? "bg-yellow-500 hover:bg-yellow-600 transition-all shadow-sm" : "transition-all hover:bg-slate-50 hover:border-yellow-200 shadow-sm"}
                  data-testid="button-filter-low"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Low Stock
                </Button>
                <Button
                  variant={filter === "out" ? "default" : "outline"}
                  onClick={() => setFilter("out")}
                  className={filter === "out" ? "bg-red-500 hover:bg-red-600 transition-all shadow-sm" : "transition-all hover:bg-slate-50 hover:border-red-200 shadow-sm"}
                  data-testid="button-filter-out"
                >
                  <PackageX className="h-4 w-4 mr-2" />
                  Out of Stock
                </Button>
              </div>
              <div className="relative flex-1 sm:flex-none sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 transition-all focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-300 shadow-sm"
                  data-testid="input-search"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-300">
              {(() => {
                const EmptyIcon = getEmptyStateContent().icon;
                const content = getEmptyStateContent();
                return (
                  <>
                    <div className="mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200/50 p-8 shadow-sm">
                      <EmptyIcon className="h-14 w-14 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {content.title}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                      {content.description}
                    </p>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                    <TableHead className="font-semibold whitespace-nowrap min-w-[180px]">Product Name</TableHead>
                    <TableHead className="text-right font-semibold whitespace-nowrap min-w-[120px]">Current Stock</TableHead>
                    <TableHead className="text-right font-semibold whitespace-nowrap min-w-[130px]">Reserved Stock</TableHead>
                    <TableHead className="text-right font-semibold whitespace-nowrap min-w-[140px]">Available Stock</TableHead>
                    <TableHead className="text-right font-semibold whitespace-nowrap min-w-[120px]">Reorder Point</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap min-w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const availableStock = item.currentStock - item.reservedStock;
                    const status = getStockStatus(item);
                    return (
                      <TableRow 
                        key={item.id} 
                        data-testid={`row-inventory-${item.id}`}
                        className="transition-all duration-200 hover:bg-slate-50/70 hover:shadow-sm"
                      >
                        <TableCell className="font-medium whitespace-nowrap">{item.productName}</TableCell>
                        <TableCell className="text-right" data-testid={`text-current-stock-${item.id}`}>
                          {item.currentStock}
                        </TableCell>
                        <TableCell className="text-right" data-testid={`text-reserved-stock-${item.id}`}>
                          {item.reservedStock}
                        </TableCell>
                        <TableCell className="text-right" data-testid={`text-available-stock-${item.id}`}>
                          {availableStock}
                        </TableCell>
                        <TableCell className="text-right" data-testid={`text-reorder-point-${item.id}`}>
                          {item.reorderPoint}
                        </TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <StockAdjustmentDialog
          open={adjustmentDialogOpen}
          onOpenChange={setAdjustmentDialogOpen}
          products={products}
          onSubmit={(adjustment) => {
            console.log("Stock adjustment submitted:", adjustment);
            const item = inventoryItems.find((i) => i.id === adjustment.productId);
            if (item) {
              setInventoryItems(
                inventoryItems.map((i) =>
                  i.id === adjustment.productId
                    ? {
                        ...i,
                        currentStock:
                          adjustment.type === "add"
                            ? i.currentStock + adjustment.quantity
                            : Math.max(0, i.currentStock - adjustment.quantity),
                      }
                    : i
                )
              );
            }
          }}
        />
        
        <StockHistoryView
          open={stockHistoryOpen}
          onOpenChange={setStockHistoryOpen}
        />
        
        <BatchManagementView
          open={batchManagementOpen}
          onOpenChange={setBatchManagementOpen}
        />
        
        <BulkStockUpdateDialog
          open={bulkUpdateOpen}
          onOpenChange={setBulkUpdateOpen}
          onSubmit={(updates) => {
            console.log("Bulk update submitted:", updates);
          }}
        />
      </div>
    </AdminLayout>
  );
}
