import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, XCircle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
    return (
      <div className="mb-6" data-testid="low-stock-alerts">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="border-green-600 bg-green-50" data-testid="alert-all-clear">
            <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
            <AlertTitle className="text-green-800">All Clear</AlertTitle>
            <AlertDescription className="text-green-700">
              All products are well-stocked. No inventory alerts at this time.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-6" data-testid="low-stock-alerts">
      <AnimatePresence mode="popLayout">
        {outOfStockCount > 0 && (
          <motion.div
            key="out-of-stock"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" data-testid="alert-out-of-stock">
              <XCircle className="h-4 w-4 mr-3" />
              <AlertTitle>Out of Stock Alert</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>
                  {outOfStockCount} {outOfStockCount === 1 ? "product is" : "products are"} out of stock and need immediate restocking
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFilterOutOfStock}
                  className="border-red-600 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                  data-testid="button-filter-out-of-stock"
                >
                  View Products
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {lowStockCount > 0 && (
          <motion.div
            key="low-stock"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="border-yellow-600 bg-yellow-50" data-testid="alert-low-stock">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-3" />
              <AlertTitle className="text-yellow-800">Low Stock Warning</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-yellow-700">
                <span>
                  {lowStockCount} {lowStockCount === 1 ? "product is" : "products are"} running low on stock
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFilterLowStock}
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 w-full sm:w-auto"
                  data-testid="button-filter-low-stock"
                >
                  View Products
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {expiringBatchesCount > 0 && (
          <motion.div
            key="expiring-batches"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="border-red-600 bg-red-50" data-testid="alert-expiring-batches">
              <Clock className="h-4 w-4 text-red-600 mr-3" />
              <AlertTitle className="text-red-800">Expiring Batches</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-red-700">
                <span>
                  {expiringBatchesCount} {expiringBatchesCount === 1 ? "batch is" : "batches are"} expiring within 30 days
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFilterExpiringBatches}
                  className="border-red-600 text-red-700 hover:bg-red-100 w-full sm:w-auto"
                  data-testid="button-filter-expiring-batches"
                >
                  View Batches
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
