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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertTriangle,
  Package,
  Calendar,
  Upload,
  RotateCcw,
  PackageX,
  XCircle,
} from "lucide-react";

interface ShippingOrder {
  id: string;
  orderCode: string;
  customerName: string;
  trackingNumber?: string;
  address: string;
  city: string;
  phone: string;
}

interface FailedDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ShippingOrder | null;
}

export default function FailedDeliveryDialog({
  open,
  onOpenChange,
  order,
}: FailedDeliveryDialogProps) {
  const [failureReason, setFailureReason] = useState("customer_not_available");
  const [customReason, setCustomReason] = useState("");
  const [failureDetails, setFailureDetails] = useState("");
  const [resolution, setResolution] = useState<"reschedule" | "return" | "cancel">(
    "reschedule"
  );
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [photoProof, setPhotoProof] = useState<File | null>(null);

  if (!order) return null;

  const failureReasons = [
    { value: "customer_not_available", label: "Customer not available" },
    { value: "wrong_address", label: "Wrong/incomplete address" },
    { value: "address_inaccessible", label: "Address inaccessible" },
    { value: "customer_refused", label: "Customer refused package" },
    { value: "other", label: "Other (please specify)" },
  ];

  const handleSubmit = () => {
    console.log("Failed delivery report for order:", order.orderCode);
    console.log("Failure reason:", failureReason);
    console.log("Custom reason:", customReason);
    console.log("Details:", failureDetails);
    console.log("Resolution:", resolution);
    console.log("Reschedule date:", rescheduleDate);
    console.log("Notes:", resolutionNotes);
    console.log("Photo proof:", photoProof);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Resolve Failed Delivery
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-6">
          {/* Order Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-red-600" />
              <h3 className="font-semibold text-red-900">Order Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-red-700">Order Code:</span>
                <p className="font-medium text-red-900" data-testid="text-order-code">{order.orderCode}</p>
              </div>
              <div>
                <span className="text-red-700">Tracking:</span>
                <p className="font-mono font-medium text-red-900" data-testid="text-tracking-number">
                  {order.trackingNumber || "N/A"}
                </p>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-red-700">Customer:</span>
              <p className="font-medium text-red-900" data-testid="text-customer-name">{order.customerName}</p>
            </div>
            <div className="text-sm">
              <span className="text-red-700">Address:</span>
              <p className="text-red-900" data-testid="text-customer-address">
                {order.address}, {order.city}
              </p>
            </div>
          </div>

          {/* Failure Reason */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Failure Reason</h3>
            <div className="space-y-2">
              <Label htmlFor="failure-reason">Select Reason</Label>
              <Select value={failureReason} onValueChange={setFailureReason}>
                <SelectTrigger id="failure-reason" data-testid="select-failure-reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {failureReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {failureReason === "other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Custom Reason</Label>
                <Input
                  id="custom-reason"
                  placeholder="Please specify the reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  data-testid="input-custom-reason"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="failure-details">Additional Details</Label>
              <Textarea
                id="failure-details"
                placeholder="Provide more details about the failed delivery attempt..."
                value={failureDetails}
                onChange={(e) => setFailureDetails(e.target.value)}
                rows={3}
                data-testid="textarea-failure-details"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo-proof">Photo Proof (Optional)</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-2">
                  Upload photo of the location or delivery attempt
                </p>
                <Input
                  id="photo-proof"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoProof(e.target.files?.[0] || null)}
                  className="max-w-xs mx-auto"
                  data-testid="input-photo-proof"
                />
              </div>
            </div>
          </div>

          {/* Resolution Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Resolution</h3>
            <RadioGroup
              value={resolution}
              onValueChange={(value) => setResolution(value as typeof resolution)}
            >
              <div className="space-y-3">
                {/* Reschedule */}
                <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <RadioGroupItem
                    value="reschedule"
                    id="reschedule"
                    data-testid="radio-reschedule"
                  />
                  <div className="flex-1 space-y-2">
                    <label
                      htmlFor="reschedule"
                      className="flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4 text-cyan-600" />
                      Reschedule Delivery
                    </label>
                    <p className="text-sm text-slate-600">
                      Schedule another delivery attempt on a different date
                    </p>
                    {resolution === "reschedule" && (
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="reschedule-date">New Delivery Date</Label>
                        <Input
                          id="reschedule-date"
                          type="date"
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          data-testid="input-reschedule-date"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Return to Sender */}
                <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <RadioGroupItem
                    value="return"
                    id="return"
                    data-testid="radio-return"
                  />
                  <div className="flex-1 space-y-2">
                    <label
                      htmlFor="return"
                      className="flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <PackageX className="h-4 w-4 text-yellow-600" />
                      Return to Sender
                    </label>
                    <p className="text-sm text-slate-600">
                      Send the package back to the warehouse/store
                    </p>
                  </div>
                </div>

                {/* Cancel Order */}
                <div className="flex items-start space-x-3 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  <RadioGroupItem
                    value="cancel"
                    id="cancel"
                    data-testid="radio-cancel"
                  />
                  <div className="flex-1 space-y-2">
                    <label
                      htmlFor="cancel"
                      className="flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                      Cancel Order
                    </label>
                    <p className="text-sm text-slate-600">
                      Cancel the order and initiate refund process
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="resolution-notes">Resolution Notes</Label>
              <Textarea
                id="resolution-notes"
                placeholder="Add any notes about the resolution..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={3}
                data-testid="textarea-resolution-notes"
              />
            </div>
          </div>

          {/* Warning for Cancel */}
          {resolution === "cancel" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-900 mb-1">
                    Warning: Order Cancellation
                  </p>
                  <p className="text-yellow-800">
                    Cancelling this order will initiate the refund process. The customer
                    will be notified automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-dialog"
          >
            Cancel
          </Button>
          <Button
            className={
              resolution === "cancel"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-cyan-500 hover:bg-cyan-600"
            }
            onClick={handleSubmit}
            disabled={
              !failureDetails ||
              (resolution === "reschedule" && !rescheduleDate) ||
              (failureReason === "other" && !customReason)
            }
            data-testid="button-submit-resolution"
          >
            {resolution === "reschedule" && (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reschedule Delivery
              </>
            )}
            {resolution === "return" && (
              <>
                <PackageX className="h-4 w-4 mr-2" />
                Return to Sender
              </>
            )}
            {resolution === "cancel" && (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
