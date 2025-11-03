import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package, User, Phone, MapPin, Calendar, DollarSign } from "lucide-react";
import type { AdminOrder } from "@/components/AdminOrderList";

export default function OrderDetailPage() {
  const [, params] = useRoute("/admin/orders/:id");
  const [, setLocation] = useLocation();

  const mockOrders: (AdminOrder & { 
    items: { id: string; name: string; quantity: number; price: number }[];
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  })[] = [
    {
      id: "1",
      orderCode: "SK-2025-0001",
      customerName: "John Doe",
      phone: "0812-3456-7890",
      total: 680000,
      status: "PAID",
      createdAt: "2025-01-15 14:30",
      address: "Jl. Sudirman No. 123",
      city: "Jakarta Selatan",
      postalCode: "12190",
      items: [
        { id: "1", name: "Hydrating Serum", quantity: 2, price: 250000 },
        { id: "2", name: "Daily Moisturizer", quantity: 1, price: 180000 },
      ],
      notes: "Please pack carefully, this is a gift"
    },
    {
      id: "2",
      orderCode: "SK-2025-0002",
      customerName: "Jane Smith",
      phone: "0813-7654-3210",
      total: 430000,
      status: "PROCESSING",
      createdAt: "2025-01-15 16:45",
      address: "Jl. Gatot Subroto No. 456",
      city: "Jakarta Pusat",
      postalCode: "10270",
      items: [
        { id: "3", name: "Gentle Cleanser", quantity: 1, price: 150000 },
        { id: "5", name: "Vitamin C Serum", quantity: 1, price: 280000 },
      ],
    },
  ];

  const [order, setOrder] = useState(mockOrders.find(o => o.id === params?.id));

  if (!order) {
    return (
      <AdminLayout onLogout={() => setLocation("/admin/login")}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button onClick={() => setLocation("/admin/orders")} data-testid="button-back-to-orders">
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const getStatusVariant = (status: AdminOrder["status"]) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "secondary";
      case "PAID":
      case "PROCESSING":
      case "SHIPPED":
        return "default";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleStatusUpdate = (newStatus: AdminOrder["status"]) => {
    setOrder({ ...order, status: newStatus });
  };

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <div className="max-w-5xl" data-testid="order-detail-page">
        <button
          onClick={() => setLocation("/admin/orders")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Orders</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1" data-testid="text-order-code">{order.orderCode}</h1>
            <p className="text-sm text-slate-500">Placed on {order.createdAt}</p>
          </div>
          <Badge variant={getStatusVariant(order.status)} className="text-sm px-4 py-2">
            {order.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
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
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm" data-testid="text-address">
                {order.address}<br />
                {order.city}<br />
                {order.postalCode}
              </p>
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
                <span className="text-sm text-slate-500">Subtotal</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="font-bold text-lg" data-testid="text-total">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0" data-testid={`item-${item.id}`}>
                  <div className="flex-1">
                    <p className="font-medium" data-testid={`text-item-name-${item.id}`}>{item.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium" data-testid={`text-item-price-${item.id}`}>{formatPrice(item.price)}</p>
                    <p className="text-sm text-slate-500">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {order.notes && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base font-medium">Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600" data-testid="text-notes">{order.notes}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Order Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Update Order Status</label>
              <Select value={order.status} onValueChange={handleStatusUpdate}>
                <SelectTrigger className="w-full md:w-[300px]" data-testid="select-update-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="border-cyan-500 text-cyan-600 hover:bg-cyan-50"
                data-testid="button-print-invoice"
              >
                Print Invoice
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-300"
                data-testid="button-send-tracking"
              >
                Send Tracking Info
              </Button>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-50"
                data-testid="button-cancel-order"
                onClick={() => {
                  if (confirm("Are you sure you want to cancel this order?")) {
                    handleStatusUpdate("CANCELLED");
                  }
                }}
              >
                Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
