import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package, AlertTriangle, Calendar, Truck } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface ProductBatch {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  remainingQuantity: number;
  expiryDate: Date | null;
  manufacturingDate: Date | null;
  receivedDate: Date;
  supplier: string;
  notes?: string;
  isActive: boolean;
}

interface BatchManagementViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockBatches: ProductBatch[] = [
  {
    id: "1",
    productId: "p1",
    productName: "Hydrating Serum",
    batchNumber: "BATCH-2025-001",
    quantity: 100,
    remainingQuantity: 45,
    expiryDate: new Date(2026, 11, 31),
    manufacturingDate: new Date(2025, 5, 15),
    receivedDate: new Date(2025, 6, 1),
    supplier: "SkinCare Supplier Co.",
    notes: "Premium quality batch",
    isActive: true,
  },
  {
    id: "2",
    productId: "p2",
    productName: "Daily Moisturizer",
    batchNumber: "BATCH-2025-002",
    quantity: 80,
    remainingQuantity: 15,
    expiryDate: new Date(2025, 11, 15),
    manufacturingDate: new Date(2025, 2, 10),
    receivedDate: new Date(2025, 2, 20),
    supplier: "Beauty Labs Inc.",
    isActive: true,
  },
  {
    id: "3",
    productId: "p3",
    productName: "Vitamin C Serum",
    batchNumber: "BATCH-2024-099",
    quantity: 60,
    remainingQuantity: 8,
    expiryDate: new Date(2025, 10, 20),
    manufacturingDate: new Date(2024, 8, 5),
    receivedDate: new Date(2024, 8, 15),
    supplier: "VitaSkin Manufacturing",
    notes: "Last batch from 2024",
    isActive: true,
  },
  {
    id: "4",
    productId: "p4",
    productName: "Night Cream",
    batchNumber: "BATCH-2025-003",
    quantity: 120,
    remainingQuantity: 95,
    expiryDate: new Date(2027, 3, 30),
    manufacturingDate: new Date(2025, 7, 20),
    receivedDate: new Date(2025, 8, 1),
    supplier: "SkinCare Supplier Co.",
    isActive: true,
  },
];

const mockProducts = [
  { id: "p1", name: "Hydrating Serum" },
  { id: "p2", name: "Daily Moisturizer" },
  { id: "p3", name: "Vitamin C Serum" },
  { id: "p4", name: "Night Cream" },
  { id: "p5", name: "Eye Cream" },
];

export default function BatchManagementView({
  open,
  onOpenChange,
}: BatchManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [addBatchOpen, setAddBatchOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "expiring" | "low">("all");

  const getExpiryStatus = (expiryDate: Date | null) => {
    if (!expiryDate) return { status: "none", days: 0, className: "", label: "" };

    const daysUntilExpiry = differenceInDays(expiryDate, new Date());

    if (daysUntilExpiry < 0) {
      return { 
        status: "expired", 
        days: daysUntilExpiry, 
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        label: "Expired"
      };
    } else if (daysUntilExpiry <= 30) {
      return { 
        status: "expiring-soon", 
        days: daysUntilExpiry, 
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        label: `${daysUntilExpiry}d left`
      };
    } else if (daysUntilExpiry <= 90) {
      return { 
        status: "warning", 
        days: daysUntilExpiry, 
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        label: `${daysUntilExpiry}d left`
      };
    } else {
      return { 
        status: "good", 
        days: daysUntilExpiry, 
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        label: "Good"
      };
    }
  };

  const filteredBatches = mockBatches.filter((batch) => {
    const matchesSearch = 
      batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.supplier.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "expiring") {
      const { days } = getExpiryStatus(batch.expiryDate);
      return matchesSearch && days >= 0 && days <= 30;
    } else if (filterStatus === "low") {
      const percentageRemaining = (batch.remainingQuantity / batch.quantity) * 100;
      return matchesSearch && percentageRemaining < 30;
    }

    return matchesSearch;
  });

  const expiringCount = mockBatches.filter(b => {
    const { days } = getExpiryStatus(b.expiryDate);
    return days >= 0 && days <= 30;
  }).length;

  const lowStockCount = mockBatches.filter(b => {
    const percentage = (b.remainingQuantity / b.quantity) * 100;
    return percentage < 30;
  }).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="flex flex-col max-w-7xl max-h-[90vh]" 
        data-testid="dialog-batch-management"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Batch & Lot Number Management
          </DialogTitle>
          <DialogDescription>
            Track product batches with expiry dates for BPOM compliance
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            {(expiringCount > 0 || lowStockCount > 0) && (
              <div className="flex flex-wrap gap-2">
                {expiringCount > 0 && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm" data-testid="alert-expiring-batches">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-red-800">
                      <strong>{expiringCount}</strong> batches expiring in 30 days
                    </span>
                  </div>
                )}
                {lowStockCount > 0 && (
                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm" data-testid="alert-low-batch-stock">
                    <Package className="h-4 w-4 text-yellow-600" />
                    <span className="text-yellow-800">
                      <strong>{lowStockCount}</strong> batches running low
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                  data-testid="button-filter-all-batches"
                >
                  All Batches
                </Button>
                <Button
                  variant={filterStatus === "expiring" ? "default" : "outline"}
                  onClick={() => setFilterStatus("expiring")}
                  className={filterStatus === "expiring" ? "bg-red-500 hover:bg-red-600" : ""}
                  data-testid="button-filter-expiring"
                >
                  Expiring Soon
                </Button>
                <Button
                  variant={filterStatus === "low" ? "default" : "outline"}
                  onClick={() => setFilterStatus("low")}
                  className={filterStatus === "low" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  data-testid="button-filter-low-stock"
                >
                  Low Stock
                </Button>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Search batches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 sm:w-64"
                  data-testid="input-search-batches"
                />
                <Dialog open={addBatchOpen} onOpenChange={setAddBatchOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-cyan-500 hover:bg-cyan-600"
                      data-testid="button-add-batch"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Batch
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col" data-testid="dialog-add-batch">
                    <DialogHeader>
                      <DialogTitle>Add New Batch</DialogTitle>
                      <DialogDescription>
                        Register a new product batch with expiry tracking
                      </DialogDescription>
                    </DialogHeader>
                    <form id="add-batch-form" className="flex flex-col flex-1 min-h-0">
                      <DialogBody>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="product">Product *</Label>
                            <Select>
                              <SelectTrigger id="product" data-testid="select-product">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockProducts.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="batchNumber">Batch Number *</Label>
                              <Input 
                                id="batchNumber" 
                                placeholder="BATCH-2025-XXX" 
                                data-testid="input-batch-number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="quantity">Quantity *</Label>
                              <Input 
                                id="quantity" 
                                type="number" 
                                placeholder="100" 
                                data-testid="input-quantity"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                              <Input 
                                id="manufacturingDate" 
                                type="date" 
                                data-testid="input-manufacturing-date"
                              />
                            </div>
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date *</Label>
                              <Input 
                                id="expiryDate" 
                                type="date" 
                                data-testid="input-expiry-date"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="supplier">Supplier</Label>
                            <Input 
                              id="supplier" 
                              placeholder="Supplier name" 
                              data-testid="input-supplier"
                            />
                          </div>

                          <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea 
                              id="notes" 
                              placeholder="Additional notes about this batch..." 
                              rows={3}
                              data-testid="textarea-notes"
                            />
                          </div>
                        </div>
                      </DialogBody>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setAddBatchOpen(false)}
                          data-testid="button-cancel-batch"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-cyan-500 hover:bg-cyan-600"
                          data-testid="button-save-batch"
                        >
                          Save Batch
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-[50vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead>Stock %</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Supplier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                          No batches found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBatches.map((batch) => {
                        const percentageRemaining = Math.round((batch.remainingQuantity / batch.quantity) * 100);
                        const expiryStatus = getExpiryStatus(batch.expiryDate);

                        return (
                          <TableRow key={batch.id} data-testid={`row-batch-${batch.id}`}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-slate-400" />
                                {batch.batchNumber}
                              </div>
                            </TableCell>
                            <TableCell>{batch.productName}</TableCell>
                            <TableCell className="text-right">{batch.quantity}</TableCell>
                            <TableCell className="text-right font-medium">
                              {batch.remainingQuantity}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all ${
                                      percentageRemaining < 30 ? 'bg-red-500' :
                                      percentageRemaining < 50 ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${percentageRemaining}%` }}
                                  />
                                </div>
                                <span className="text-sm text-slate-600">{percentageRemaining}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {batch.expiryDate ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-slate-400" />
                                  <span className="text-sm">
                                    {format(batch.expiryDate, "dd MMM yyyy")}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-sm">No expiry</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {expiryStatus.status !== "none" && (
                                <Badge className={expiryStatus.className}>
                                  {expiryStatus.label}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Truck className="h-4 w-4" />
                                {batch.supplier}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-600 pt-2">
              <span>Showing {filteredBatches.length} batches</span>
              <span>Total batches: {mockBatches.length}</span>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
