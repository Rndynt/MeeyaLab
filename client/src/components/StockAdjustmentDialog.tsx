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
      <DialogContent className="flex flex-col" data-testid="dialog-stock-adjustment">
        <DialogHeader>
          <DialogTitle>Stock Adjustment</DialogTitle>
          <DialogDescription>
            Adjust product stock levels by adding or removing inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="stock-adjustment-form" className="flex flex-col flex-1 min-h-0">
          <DialogBody>
            <div className="space-y-6">
              {/* Product Selection Section */}
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3 transition-all hover:bg-muted/50">
                <h3 className="text-sm font-semibold text-foreground">Product Selection</h3>
                <div>
                  <Label htmlFor="product">Product</Label>
                  <Select value={productId} onValueChange={setProductId} required>
                    <SelectTrigger id="product" data-testid="select-product" className="transition-all">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem 
                          key={product.id} 
                          value={product.id}
                          data-testid={`select-item-product-${product.id}`}
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
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4 transition-all hover:bg-muted/50">
                <h3 className="text-sm font-semibold text-foreground">Adjustment Details</h3>
                
                <div>
                  <Label htmlFor="adjustment-type">Adjustment Type</Label>
                  <Select value={adjustmentType} onValueChange={(value: "add" | "remove") => setAdjustmentType(value)} required>
                    <SelectTrigger id="adjustment-type" data-testid="select-adjustment-type" className="transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add" data-testid="select-item-add">Add Stock</SelectItem>
                      <SelectItem value="remove" data-testid="select-item-remove">Remove Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-adjustment-type">
                    {/* Validation error will appear here */}
                  </p>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    placeholder="Enter quantity"
                    data-testid="input-quantity"
                    className="transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5" data-testid="helper-quantity">
                    Enter the number of units to add or remove
                  </p>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-quantity">
                    {/* Validation error will appear here */}
                  </p>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4 transition-all hover:bg-muted/50">
                <h3 className="text-sm font-semibold text-foreground">Additional Information</h3>
                
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder="e.g., New stock arrival, Damaged items, Customer return"
                    className="min-h-[100px] transition-all"
                    data-testid="textarea-reason"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5" data-testid="helper-reason">
                    Provide a clear reason for audit trail purposes
                  </p>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-reason">
                    {/* Validation error will appear here */}
                  </p>
                </div>

                <div>
                  <Label htmlFor="batch-number">Batch/Lot Number (Optional)</Label>
                  <Input
                    id="batch-number"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g., BATCH-2024-001"
                    data-testid="input-batch-number"
                    className="transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5" data-testid="helper-batch-number">
                    Track specific product batches for BPOM compliance
                  </p>
                  <p className="text-sm text-red-600 mt-1 min-h-[20px]" data-testid="error-batch-number">
                    {/* Validation error will appear here */}
                  </p>
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
              className="transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 transition-all"
              data-testid="button-submit-adjustment"
            >
              Apply Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
