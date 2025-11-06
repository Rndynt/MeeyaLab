import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Download, Truck, Package, MapPin, Hash } from "lucide-react";

interface ShippingOrder {
  id: string;
  orderCode: string;
  customerName: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  courierName: string;
  courierService: string;
  weight: number;
  shippingCost: number;
}

interface ShippingLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ShippingOrder | null;
}

export default function ShippingLabelDialog({
  open,
  onOpenChange,
  order,
}: ShippingLabelDialogProps) {
  const [courierName, setCourierName] = useState(order?.courierName || "JNE");
  const [courierService, setCourierService] = useState(order?.courierService || "REG");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [weight, setWeight] = useState(order?.weight.toString() || "");

  if (!order) return null;

  const handleGenerateLabel = () => {
    console.log("Generating label for order:", order.orderCode);
    console.log("Courier:", courierName, courierService);
    console.log("Tracking:", trackingNumber);
  };

  const handlePrintLabel = () => {
    console.log("Printing label for order:", order.orderCode);
    window.print();
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF label for order:", order.orderCode);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-cyan-600" />
            Generate Shipping Label
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-6">
          {/* Order Information */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-slate-900">Order Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-600">Order Code:</span>
                <p className="font-medium text-slate-900" data-testid="text-order-code">{order.orderCode}</p>
              </div>
              <div>
                <span className="text-slate-600">Customer:</span>
                <p className="font-medium text-slate-900" data-testid="text-customer-name">{order.customerName}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900">Shipping Address</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
              <p className="font-medium text-slate-900" data-testid="text-recipient-name">{order.recipientName}</p>
              <p className="text-sm text-slate-600" data-testid="text-recipient-phone">{order.phone}</p>
              <p className="text-sm text-slate-600" data-testid="text-recipient-address">{order.address}</p>
              <p className="text-sm text-slate-600" data-testid="text-recipient-city">
                {order.city}, {order.province} {order.postalCode}
              </p>
            </div>
          </div>

          {/* Courier Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900">Courier Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courier-name">Courier</Label>
                <Select value={courierName} onValueChange={setCourierName}>
                  <SelectTrigger id="courier-name" data-testid="select-courier-name">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JNE">JNE</SelectItem>
                    <SelectItem value="J&T">J&T Express</SelectItem>
                    <SelectItem value="SiCepat">SiCepat</SelectItem>
                    <SelectItem value="AnterAja">AnterAja</SelectItem>
                    <SelectItem value="Ninja">Ninja Xpress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="courier-service">Service Type</Label>
                <Select value={courierService} onValueChange={setCourierService}>
                  <SelectTrigger id="courier-service" data-testid="select-courier-service">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REG">Regular</SelectItem>
                    <SelectItem value="YES">YES (Next Day)</SelectItem>
                    <SelectItem value="HALU">HALU (Same Day)</SelectItem>
                    <SelectItem value="OKE">OKE (Economy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tracking-number">Tracking Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking-number"
                    placeholder="Auto-generate or manual"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    data-testid="input-tracking-number"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const auto = `${courierName.toUpperCase()}-${Date.now().toString().slice(-8)}`;
                      setTrackingNumber(auto);
                    }}
                    data-testid="button-auto-generate"
                  >
                    Auto
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (grams)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="500"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  data-testid="input-weight"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping Cost:</span>
                <span className="font-semibold text-slate-900" data-testid="text-shipping-cost">
                  {formatCurrency(order.shippingCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Label Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Label Preview</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-white">
              <div className="max-w-md mx-auto space-y-4">
                {/* From */}
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">From:</p>
                  <p className="text-sm font-medium">MeeyaLab</p>
                  <p className="text-xs text-slate-600">Jakarta, Indonesia</p>
                </div>

                <div className="border-t border-slate-200 my-3"></div>

                {/* To */}
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">To:</p>
                  <p className="text-sm font-semibold" data-testid="text-preview-recipient-name">{order.recipientName}</p>
                  <p className="text-xs text-slate-600" data-testid="text-preview-address">{order.address}</p>
                  <p className="text-xs text-slate-600" data-testid="text-preview-city">
                    {order.city}, {order.province} {order.postalCode}
                  </p>
                  <p className="text-xs text-slate-600 mt-1" data-testid="text-preview-phone">{order.phone}</p>
                </div>

                <div className="border-t border-slate-200 my-3"></div>

                {/* Shipping Details */}
                <div className="flex justify-between text-xs">
                  <div>
                    <p className="text-slate-500">Courier:</p>
                    <p className="font-semibold" data-testid="text-preview-courier">
                      {courierName} {courierService}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Weight:</p>
                    <p className="font-semibold" data-testid="text-preview-weight">{weight}g</p>
                  </div>
                </div>

                {/* Tracking Number */}
                {trackingNumber && (
                  <div className="bg-slate-900 text-white text-center py-2 rounded">
                    <p className="text-xs mb-1">Tracking Number</p>
                    <p className="font-mono font-bold text-sm" data-testid="text-preview-tracking-number">{trackingNumber}</p>
                  </div>
                )}

                {/* Order Code */}
                <div className="text-center">
                  <p className="text-xs text-slate-500" data-testid="text-preview-order-code">Order: {order.orderCode}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handlePrintLabel}
            data-testid="button-print"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            className="bg-cyan-500 hover:bg-cyan-600"
            onClick={handleGenerateLabel}
            data-testid="button-generate"
          >
            <Truck className="h-4 w-4 mr-2" />
            Generate & Mark Shipped
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
