import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, CheckCircle2, XCircle } from "lucide-react";

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
        <Card data-testid="card-order-details">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Order {order.orderCode}</CardTitle>
                <p className="text-sm text-slate-600 mt-1">{order.createdAt}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-2">Customer Information</h3>
              <p className="text-sm text-slate-600">{order.customerName}</p>
              <p className="text-sm text-slate-600">{order.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3">Order Items</h3>
              <table className="w-full">
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 text-sm text-slate-600">{item.name}</td>
                      <td className="py-3 text-sm text-center text-slate-500">x{item.quantity}</td>
                      <td className="py-3 text-sm text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold" data-testid="text-order-total">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
