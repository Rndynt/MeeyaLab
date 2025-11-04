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
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, TrendingDown, FileEdit, Package2, ShoppingCart, ClipboardList } from "lucide-react";
import { format } from "date-fns";

interface StockTransaction {
  id: string;
  date: Date;
  type: "add" | "remove" | "adjustment" | "order" | "return";
  productName: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  batchNumber?: string;
  performedBy: string;
  orderId?: string;
}

interface StockHistoryViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
}

const mockTransactions: StockTransaction[] = [
  {
    id: "1",
    date: new Date(2025, 10, 4, 10, 30),
    type: "add",
    productName: "Hydrating Serum",
    quantity: 50,
    previousStock: 45,
    newStock: 95,
    reason: "Restocking from supplier",
    batchNumber: "BATCH-2025-001",
    performedBy: "Admin User",
  },
  {
    id: "2",
    date: new Date(2025, 10, 4, 9, 15),
    type: "order",
    productName: "Hydrating Serum",
    quantity: 5,
    previousStock: 50,
    newStock: 45,
    reason: "Order fulfillment",
    orderId: "ORD-2025-156",
    performedBy: "System",
  },
  {
    id: "3",
    date: new Date(2025, 10, 3, 14, 20),
    type: "remove",
    productName: "Hydrating Serum",
    quantity: 2,
    previousStock: 52,
    newStock: 50,
    reason: "Damaged products",
    performedBy: "Admin User",
  },
  {
    id: "4",
    date: new Date(2025, 10, 3, 11, 45),
    type: "adjustment",
    productName: "Hydrating Serum",
    quantity: 3,
    previousStock: 49,
    newStock: 52,
    reason: "Stock count correction",
    performedBy: "Admin User",
  },
  {
    id: "5",
    date: new Date(2025, 10, 2, 16, 30),
    type: "order",
    productName: "Hydrating Serum",
    quantity: 8,
    previousStock: 57,
    newStock: 49,
    reason: "Order fulfillment",
    orderId: "ORD-2025-145",
    performedBy: "System",
  },
];

export default function StockHistoryView({
  open,
  onOpenChange,
  productId,
}: StockHistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getTypeIcon = (type: StockTransaction["type"]) => {
    switch (type) {
      case "add":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "remove":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "adjustment":
        return <FileEdit className="h-4 w-4 text-cyan-600" />;
      case "order":
        return <ShoppingCart className="h-4 w-4 text-yellow-600" />;
      case "return":
        return <Package2 className="h-4 w-4 text-green-600" />;
    }
  };

  const getTypeBadge = (type: StockTransaction["type"]) => {
    const variants = {
      add: { className: "bg-green-100 text-green-800 hover:bg-green-100", label: "Stock In" },
      remove: { className: "bg-red-100 text-red-800 hover:bg-red-100", label: "Stock Out" },
      adjustment: { className: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100", label: "Adjustment" },
      order: { className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", label: "Order" },
      return: { className: "bg-green-100 text-green-800 hover:bg-green-100", label: "Return" },
    };

    const variant = variants[type];
    return (
      <Badge className={variant.className} data-testid={`badge-type-${type}`}>
        {variant.label}
      </Badge>
    );
  };

  const filteredTransactions = mockTransactions.filter((transaction) =>
    transaction.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="flex flex-col max-w-6xl max-h-[90vh]" 
        data-testid="dialog-stock-history"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Stock History & Audit Trail
          </DialogTitle>
          <DialogDescription>
            View all stock movements and changes for inventory tracking
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-700 mb-3">Transaction Types Legend</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2" data-testid="legend-stock-in">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Stock In</Badge>
                </div>
                <div className="flex items-center gap-2" data-testid="legend-stock-out">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Stock Out</Badge>
                </div>
                <div className="flex items-center gap-2" data-testid="legend-adjustment">
                  <FileEdit className="h-4 w-4 text-cyan-600" />
                  <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">Adjustment</Badge>
                </div>
                <div className="flex items-center gap-2" data-testid="legend-order">
                  <ShoppingCart className="h-4 w-4 text-yellow-600" />
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Order</Badge>
                </div>
                <div className="flex items-center gap-2" data-testid="legend-return">
                  <Package2 className="h-4 w-4 text-green-600" />
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Return</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search by reason, user, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                data-testid="input-search-history"
              />
              <Button 
                variant="outline"
                data-testid="button-export-history"
              >
                Export CSV
              </Button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-[50vh]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="w-[180px]">Date & Time</TableHead>
                      <TableHead className="w-[140px]">Type</TableHead>
                      <TableHead className="w-[100px] text-right">Quantity</TableHead>
                      <TableHead className="w-[100px] text-right">Before</TableHead>
                      <TableHead className="w-[100px] text-right">After</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="w-[140px]">Batch</TableHead>
                      <TableHead className="w-[150px]">Performed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12" data-testid="empty-state-history">
                          <div className="flex flex-col items-center gap-3">
                            <ClipboardList className="h-12 w-12 text-slate-300" />
                            <div>
                              <p className="text-slate-600 font-medium">
                                {searchQuery ? "No transactions match your search" : "No stock movements recorded yet"}
                              </p>
                              <p className="text-sm text-slate-400 mt-1">
                                {searchQuery ? "Try adjusting your search terms" : "Stock changes will appear here when transactions occur"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id} data-testid={`row-transaction-${transaction.id}`}>
                          <TableCell className="font-medium" data-testid={`cell-date-${transaction.id}`}>
                            <div className="flex flex-col">
                              <span className="text-sm">
                                {format(transaction.date, "dd MMM yyyy")}
                              </span>
                              <span className="text-xs text-slate-500">
                                {format(transaction.date, "HH:mm")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell data-testid={`cell-type-${transaction.id}`}>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(transaction.type)}
                              {getTypeBadge(transaction.type)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold" data-testid={`cell-quantity-${transaction.id}`}>
                            <span className={transaction.type === "add" ? "text-green-600" : "text-red-600"}>
                              {transaction.type === "add" ? "+" : "-"}{transaction.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-slate-600" data-testid={`cell-before-${transaction.id}`}>
                            {transaction.previousStock}
                          </TableCell>
                          <TableCell className="text-right font-medium" data-testid={`cell-after-${transaction.id}`}>
                            {transaction.newStock}
                          </TableCell>
                          <TableCell data-testid={`cell-reason-${transaction.id}`}>
                            <div className="max-w-[200px]">
                              <p className="text-sm truncate">{transaction.reason}</p>
                              {transaction.orderId && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Order: {transaction.orderId}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell data-testid={`cell-batch-${transaction.id}`}>
                            {transaction.batchNumber && (
                              <Badge variant="outline" className="text-xs">
                                {transaction.batchNumber}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600" data-testid={`cell-performed-by-${transaction.id}`}>
                            {transaction.performedBy}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-600 pt-2">
              <span>Showing {filteredTransactions.length} transactions</span>
              <span>Total changes tracked: {mockTransactions.length}</span>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
