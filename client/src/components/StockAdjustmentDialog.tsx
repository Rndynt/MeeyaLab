import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Package, 
  ArrowUpDown, 
  Hash, 
  MessageSquare, 
  Barcode,
  Edit,
  Plus,
  Minus,
  CheckCircle2
} from "lucide-react";

interface Product {
  id: string;
  name: string;
}

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSubmit?: (adjustment: {
    productId: string;
    type: "add" | "remove";
    quantity: number;
    reason: string;
    batchNumber?: string;
  }) => void;
}

export default function StockAdjustmentDialog({
  open,
  onOpenChange,
  products,
  onSubmit,
}: StockAdjustmentDialogProps) {
  const [productId, setProductId] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !quantity || !reason) {
      return;
    }

    const adjustment = {
      productId,
      type: adjustmentType,
      quantity: parseInt(quantity),
      reason,
      batchNumber: batchNumber || undefined,
    };

    console.log("Stock adjustment:", adjustment);
    onSubmit?.(adjustment);

    setProductId("");
    setAdjustmentType("add");
    setQuantity("");
    setReason("");
    setBatchNumber("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-2xl" data-testid="dialog-stock-adjustment">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-cyan-600" />
            Stock Adjustment
          </DialogTitle>
          <DialogDescription>
            Adjust product stock levels by adding or removing inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="stock-adjustment-form" className="flex flex-col flex-1 min-h-0">
          <DialogBody>
            <div className="space-y-5">
              {/* Product Selection Section */}
              <div className="p-5 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 space-y-4 transition-all duration-300 hover:shadow-md hover:border-cyan-200">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Package className="h-4 w-4 text-cyan-600" />
                  Product Selection
                </h3>
                <div>
                  <Label htmlFor="product" className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <Package className="h-3.5 w-3.5 text-slate-500" />
                    Product
                  </Label>
                  <Select value={productId} onValueChange={setProductId} required>
                    <SelectTrigger 
                      id="product" 
                      data-testid="select-product" 
                      className="transition-all duration-200 hover:border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    >
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem 
                          key={product.id} 
                          value={product.id}
                          data-testid={`select-item-product-${product.id}`}
                          className="cursor-pointer"
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-product">
                    {/* Validation error will appear here */}
                  </p>
                </div>
              </div>

              {/* Adjustment Details Section */}
              <div className="p-5 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-cyan-50/50 to-cyan-100/30 space-y-4 transition-all duration-300 hover:shadow-md hover:border-cyan-300">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-cyan-600" />
                  Adjustment Details
                </h3>
                
                <div>
                  <Label htmlFor="adjustment-type" className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                    Adjustment Type
                  </Label>
                  <Select value={adjustmentType} onValueChange={(value: "add" | "remove") => setAdjustmentType(value)} required>
                    <SelectTrigger 
                      id="adjustment-type" 
                      data-testid="select-adjustment-type" 
                      className="transition-all duration-200 hover:border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add" data-testid="select-item-add" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4 text-green-600" />
                          <span>Add Stock</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="remove" data-testid="select-item-remove" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Minus className="h-4 w-4 text-red-600" />
                          <span>Remove Stock</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-adjustment-type">
                    {/* Validation error will appear here */}
                  </p>
                </div>

                <div>
                  <Label htmlFor="quantity" className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <Hash className="h-3.5 w-3.5 text-slate-500" />
                    Quantity
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      placeholder="Enter quantity"
                      data-testid="input-quantity"
                      className="pl-10 transition-all duration-200 hover:border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5" data-testid="helper-quantity">
                    <span className="text-cyan-600 mt-0.5">ℹ</span>
                    Enter the number of units to add or remove
                  </p>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-quantity">
                    {/* Validation error will appear here */}
                  </p>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="p-5 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 space-y-4 transition-all duration-300 hover:shadow-md hover:border-cyan-200">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-cyan-600" />
                  Additional Information
                </h3>
                
                <div>
                  <Label htmlFor="reason" className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                    Reason
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder="e.g., New stock arrival, Damaged items, Customer return"
                    className="min-h-[100px] transition-all duration-200 hover:border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 resize-none"
                    data-testid="textarea-reason"
                  />
                  <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5" data-testid="helper-reason">
                    <span className="text-cyan-600 mt-0.5">ℹ</span>
                    Provide a clear reason for audit trail purposes
                  </p>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-reason">
                    {/* Validation error will appear here */}
                  </p>
                </div>

                <div>
                  <Label htmlFor="batch-number" className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <Barcode className="h-3.5 w-3.5 text-slate-500" />
                    Batch/Lot Number <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="batch-number"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      placeholder="e.g., BATCH-2024-001"
                      data-testid="input-batch-number"
                      className="pl-10 transition-all duration-200 hover:border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-mono"
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5" data-testid="helper-batch-number">
                    <span className="text-cyan-600 mt-0.5">ℹ</span>
                    Track specific product batches for BPOM compliance
                  </p>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-batch-number">
                    {/* Validation error will appear here */}
                  </p>
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
              className="transition-all duration-200 hover:bg-slate-100 hover:border-slate-400 shadow-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 shadow-md hover:shadow-lg transition-all duration-200"
              data-testid="button-submit-adjustment"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Apply Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
