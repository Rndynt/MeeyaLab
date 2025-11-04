import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Package, CheckCircle2, XCircle, User, Phone, Calendar, DollarSign } from "lucide-react";

export interface Order {
  orderCode: string;
  customerName: string;
  phone: string;
  total: number;
  status: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

interface OrderTrackingProps {
  onSearch?: (query: string) => void;
  order?: Order | null;
}

export default function OrderTracking({ onSearch, order }: OrderTrackingProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      PENDING_PAYMENT: { label: "Pending Payment", variant: "secondary" as const, icon: Package },
      PAID: { label: "Paid", variant: "default" as const, icon: CheckCircle2 },
      PROCESSING: { label: "Processing", variant: "default" as const, icon: Package },
      SHIPPED: { label: "Shipped", variant: "default" as const, icon: Package },
      COMPLETED: { label: "Completed", variant: "default" as const, icon: CheckCircle2 },
      CANCELLED: { label: "Cancelled", variant: "destructive" as const, icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-testid="section-order-tracking">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Check Your Order</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="search">Order Code or Phone Number</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SK-2025-0001 or 08xx-xxxx-xxxx"
                  data-testid="input-search-order"
                />
                <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600" data-testid="button-search">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {order && (
        <div className="space-y-6" data-testid="card-order-details">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1" data-testid="text-order-code">{order.orderCode}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {order.createdAt}
              </p>
            </div>
            <Badge variant={getStatusBadge(order.status).props.variant} className="text-sm px-4 py-2">
              {order.status.replace("_", " ")}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="font-medium" data-testid="text-customer-name">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-medium" data-testid="text-customer-phone">{order.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Total Amount</span>
                  <span className="font-medium">{formatPrice(order.total)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="font-bold text-lg" data-testid="text-order-total">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0" data-testid={`item-${idx}`}>
                    <div className="flex-1">
                      <p className="font-medium" data-testid={`text-item-name-${idx}`}>{item.name}</p>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium" data-testid={`text-item-price-${idx}`}>{formatPrice(item.price)}</p>
                      <p className="text-sm text-slate-500">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
