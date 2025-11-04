import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LowStockAlertsProps {
  lowStockCount: number;
  outOfStockCount: number;
  expiringBatchesCount: number;
  onFilterLowStock?: () => void;
  onFilterOutOfStock?: () => void;
  onFilterExpiringBatches?: () => void;
}

export default function LowStockAlerts({
  lowStockCount,
  outOfStockCount,
  expiringBatchesCount,
  onFilterLowStock,
  onFilterOutOfStock,
  onFilterExpiringBatches,
}: LowStockAlertsProps) {
  const hasAlerts = lowStockCount > 0 || outOfStockCount > 0 || expiringBatchesCount > 0;

  if (!hasAlerts) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6" data-testid="low-stock-alerts">
      {outOfStockCount > 0 && (
        <Alert variant="destructive" data-testid="alert-out-of-stock">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Out of Stock Alert</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {outOfStockCount} {outOfStockCount === 1 ? "product is" : "products are"} out of stock and need immediate restocking
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterOutOfStock}
              className="ml-4 border-red-600 text-red-600 hover:bg-red-50"
              data-testid="button-filter-out-of-stock"
            >
              View Products
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {lowStockCount > 0 && (
        <Alert className="border-yellow-600 bg-yellow-50" data-testid="alert-low-stock">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Low Stock Warning</AlertTitle>
          <AlertDescription className="flex items-center justify-between text-yellow-700">
            <span>
              {lowStockCount} {lowStockCount === 1 ? "product is" : "products are"} running low on stock
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterLowStock}
              className="ml-4 border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              data-testid="button-filter-low-stock"
            >
              View Products
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {expiringBatchesCount > 0 && (
        <Alert className="border-orange-600 bg-orange-50" data-testid="alert-expiring-batches">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Expiring Batches</AlertTitle>
          <AlertDescription className="flex items-center justify-between text-orange-700">
            <span>
              {expiringBatchesCount} {expiringBatchesCount === 1 ? "batch is" : "batches are"} expiring within 30 days
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterExpiringBatches}
              className="ml-4 border-orange-600 text-orange-700 hover:bg-orange-100"
              data-testid="button-filter-expiring-batches"
            >
              View Batches
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
