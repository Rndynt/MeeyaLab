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
import { Calendar, TrendingUp, TrendingDown, FileEdit, Package2, ShoppingCart, ClipboardList, Search, Download } from "lucide-react";
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
      add: { className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-sm", label: "Stock In" },
      remove: { className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200 shadow-sm", label: "Stock Out" },
      adjustment: { className: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100 border-cyan-200 shadow-sm", label: "Adjustment" },
      order: { className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 shadow-sm", label: "Order" },
      return: { className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-sm", label: "Return" },
    };

    const variant = variants[type];
    return (
      <Badge className={`${variant.className} border transition-all duration-200`} data-testid={`badge-type-${type}`}>
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
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-slate-600" />
                Transaction Types Legend
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow" data-testid="legend-stock-in">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 border">Stock In</Badge>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow" data-testid="legend-stock-out">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 border">Stock Out</Badge>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow" data-testid="legend-adjustment">
                  <FileEdit className="h-4 w-4 text-cyan-600" />
                  <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100 border-cyan-200 border">Adjustment</Badge>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow" data-testid="legend-order">
                  <ShoppingCart className="h-4 w-4 text-yellow-600" />
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 border">Order</Badge>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow" data-testid="legend-return">
                  <Package2 className="h-4 w-4 text-green-600" />
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 border">Return</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by reason, user, or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-cyan-500/20"
                  data-testid="input-search-history"
                />
              </div>
              <Button 
                variant="outline"
                className="transition-all duration-200 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300 shadow-sm"
                data-testid="button-export-history"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[50vh]">
                <Table>
                  <TableHeader className="sticky top-0 bg-gradient-to-r from-slate-50 to-slate-100 z-10 shadow-md border-b-2 border-slate-200">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[180px] font-semibold text-slate-700">Date & Time</TableHead>
                      <TableHead className="w-[140px] font-semibold text-slate-700">Type</TableHead>
                      <TableHead className="w-[100px] text-right font-semibold text-slate-700">Quantity</TableHead>
                      <TableHead className="w-[100px] text-right font-semibold text-slate-700">Before</TableHead>
                      <TableHead className="w-[100px] text-right font-semibold text-slate-700">After</TableHead>
                      <TableHead className="font-semibold text-slate-700">Reason</TableHead>
                      <TableHead className="w-[140px] font-semibold text-slate-700">Batch</TableHead>
                      <TableHead className="w-[150px] font-semibold text-slate-700">Performed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={8} className="text-center py-16" data-testid="empty-state-history">
                          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                            <div className="rounded-full bg-slate-100 p-6">
                              <ClipboardList className="h-14 w-14 text-slate-400" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-slate-700 font-semibold text-lg">
                                {searchQuery ? "No transactions match your search" : "No stock movements recorded yet"}
                              </p>
                              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                {searchQuery ? "Try adjusting your search terms or clearing the filter" : "Stock changes will appear here when transactions occur"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow 
                          key={transaction.id} 
                          data-testid={`row-transaction-${transaction.id}`}
                          className="hover:bg-slate-50/50 transition-colors duration-150 group"
                        >
                          <TableCell className="font-medium" data-testid={`cell-date-${transaction.id}`}>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-semibold text-slate-900">
                                {format(transaction.date, "dd MMM yyyy")}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
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
                          <TableCell className="text-right font-bold tabular-nums" data-testid={`cell-quantity-${transaction.id}`}>
                            <span className={`${transaction.type === "add" ? "text-green-600" : "text-red-600"} px-2 py-1 rounded-md bg-opacity-10 ${transaction.type === "add" ? "bg-green-600" : "bg-red-600"}`}>
                              {transaction.type === "add" ? "+" : "-"}{transaction.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-slate-600 font-medium tabular-nums" data-testid={`cell-before-${transaction.id}`}>
                            {transaction.previousStock}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-slate-900 tabular-nums" data-testid={`cell-after-${transaction.id}`}>
                            {transaction.newStock}
                          </TableCell>
                          <TableCell data-testid={`cell-reason-${transaction.id}`}>
                            <div className="max-w-[200px]">
                              <p className="text-sm truncate text-slate-700">{transaction.reason}</p>
                              {transaction.orderId && (
                                <p className="text-xs text-cyan-600 mt-1 font-medium">
                                  Order: {transaction.orderId}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell data-testid={`cell-batch-${transaction.id}`}>
                            {transaction.batchNumber && (
                              <Badge variant="outline" className="text-xs font-mono border-slate-300 shadow-sm">
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

            <div className="flex justify-between items-center text-sm bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg px-4 py-3 border border-slate-200 shadow-sm">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                  {filteredTransactions.length}
                </span>
                Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </span>
              <span className="font-medium text-slate-700 flex items-center gap-2">
                Total tracked: 
                <span className="font-bold text-cyan-700">{mockTransactions.length}</span>
              </span>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
