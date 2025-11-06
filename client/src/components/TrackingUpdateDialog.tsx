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
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  CheckCircle,
  Truck,
  Package,
  Clock,
  Upload,
} from "lucide-react";

interface ShippingOrder {
  id: string;
  orderCode: string;
  customerName: string;
  trackingNumber?: string;
  status: string;
}

interface TrackingUpdate {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface TrackingUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ShippingOrder | null;
}

export default function TrackingUpdateDialog({
  open,
  onOpenChange,
  order,
}: TrackingUpdateDialogProps) {
  const [status, setStatus] = useState("in_transit");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [photoProof, setPhotoProof] = useState<File | null>(null);

  // Mock tracking history
  const trackingHistory: TrackingUpdate[] = [
    {
      timestamp: "2025-01-06T08:00:00",
      status: "picked_up",
      location: "MeeyaLab Store, Jakarta",
      description: "Package picked up by courier",
    },
    {
      timestamp: "2025-01-06T10:30:00",
      status: "in_transit",
      location: "Jakarta Sorting Center",
      description: "Package in transit to destination",
    },
    {
      timestamp: "2025-01-06T14:00:00",
      status: "in_transit",
      location: "Bandung Hub",
      description: "Package arrived at Bandung hub",
    },
  ];

  if (!order) return null;

  const handleUpdateTracking = () => {
    console.log("Updating tracking for order:", order.orderCode);
    console.log("Status:", status);
    console.log("Location:", location);
    console.log("Description:", description);
    console.log("Notify customer:", notifyCustomer);
    console.log("Photo proof:", photoProof);
    
    onOpenChange(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "picked_up":
        return { icon: Package, color: "text-blue-600", bg: "bg-blue-100", label: "Picked Up" };
      case "in_transit":
        return { icon: Truck, color: "text-blue-600", bg: "bg-blue-100", label: "In Transit" };
      case "out_for_delivery":
        return { icon: Truck, color: "text-cyan-600", bg: "bg-cyan-100", label: "Out for Delivery" };
      case "delivered":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Delivered" };
      default:
        return { icon: Clock, color: "text-slate-600", bg: "bg-slate-100", label: status };
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-600" />
            Tracking Update
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-6">
          {/* Order Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Order Code</p>
                <p className="font-semibold text-slate-900" data-testid="text-order-code">{order.orderCode}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Tracking Number</p>
                <p className="font-mono font-semibold text-slate-900" data-testid="text-tracking-number">
                  {order.trackingNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking History Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Tracking History</h3>
            <div className="relative border-l-2 border-slate-200 pl-6 space-y-6">
              {trackingHistory.map((update, index) => {
                const statusInfo = getStatusInfo(update.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[1.8rem] top-1 h-8 w-8 ${statusInfo.bg} rounded-full flex items-center justify-center`}
                    >
                      <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${statusInfo.color}`} data-testid={`text-history-status-${index}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-slate-500" data-testid={`text-history-timestamp-${index}`}>
                          {formatDateTime(update.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 flex items-center gap-1" data-testid={`text-history-location-${index}`}>
                        <MapPin className="h-3 w-3" />
                        {update.location}
                      </p>
                      <p className="text-sm text-slate-900" data-testid={`text-history-description-${index}`}>{update.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Status Update Form */}
          <div className="space-y-4 bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900">Add New Update</h3>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Bandung Hub, Customer Address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="input-location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., Package arrived at sorting center"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                data-testid="textarea-description"
              />
            </div>

            {status === "delivered" && (
              <div className="space-y-2">
                <Label htmlFor="photo-proof">Photo Proof (Optional)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-2">
                    Upload delivery photo proof
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
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-customer"
                checked={notifyCustomer}
                onCheckedChange={(checked) => setNotifyCustomer(checked as boolean)}
                data-testid="checkbox-notify-customer"
              />
              <label
                htmlFor="notify-customer"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Send notification to customer
              </label>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            className="bg-cyan-500 hover:bg-cyan-600"
            onClick={handleUpdateTracking}
            disabled={!location || !description}
            data-testid="button-update-tracking"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Update Tracking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
