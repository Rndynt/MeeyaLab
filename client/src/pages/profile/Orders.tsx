import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ProfileLayout from "@/components/ProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Package, ArrowLeft } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderCode: string;
  date: string;
  status: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderCode: "ORD-2025-001",
    date: "2025-01-15",
    status: "COMPLETED",
    total: 450000,
    items: [
      { productName: "Gentle Cleanser", quantity: 2, price: 150000 },
      { productName: "Hydrating Serum", quantity: 1, price: 300000 },
    ],
    shippingAddress: "Jl. Sudirman No. 123, Jakarta Selatan, 12190",
  },
  {
    id: "2",
    orderCode: "ORD-2025-002",
    date: "2025-01-20",
    status: "SHIPPED",
    total: 350000,
    items: [
      { productName: "Vitamin C Serum", quantity: 1, price: 350000 },
    ],
    shippingAddress: "Jl. Sudirman No. 123, Jakarta Selatan, 12190",
  },
  {
    id: "3",
    orderCode: "ORD-2025-003",
    date: "2025-01-25",
    status: "PROCESSING",
    total: 200000,
    items: [
      { productName: "Moisturizer", quantity: 1, price: 200000 },
    ],
    shippingAddress: "Jl. Gatot Subroto Kav. 56, Jakarta Pusat, 10260",
  },
  {
    id: "4",
    orderCode: "ORD-2025-004",
    date: "2025-01-28",
    status: "PENDING_PAYMENT",
    total: 500000,
    items: [
      { productName: "Anti-Aging Cream", quantity: 1, price: 400000 },
      { productName: "Eye Cream", quantity: 1, price: 100000 },
    ],
    shippingAddress: "Jl. Sudirman No. 123, Jakarta Selatan, 12190",
  },
];

const statusConfig = {
  PENDING_PAYMENT: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  PAID: { label: "Paid", color: "bg-blue-100 text-blue-800 border-blue-300" },
  PROCESSING: { label: "Processing", color: "bg-purple-100 text-purple-800 border-purple-300" },
  SHIPPED: { label: "Shipped", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800 border-green-300" },
};

type StatusFilter = "ALL" | Order["status"];

export default function Orders() {
  const [orders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const filteredOrders = statusFilter === "ALL" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <ProfileLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <button
          onClick={() => setLocation("/profile")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          data-testid="button-back-to-profile"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Profile</span>
        </button>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2" data-testid="text-page-title">
            Order History
          </h1>
          <p className="text-slate-600">
            Track and view your past orders
          </p>
        </div>

        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto gap-2 bg-transparent">
            <TabsTrigger 
              value="ALL" 
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
              data-testid="filter-all"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="PENDING_PAYMENT"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
              data-testid="filter-pending"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="PROCESSING"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
              data-testid="filter-processing"
            >
              Processing
            </TabsTrigger>
            <TabsTrigger 
              value="SHIPPED"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
              data-testid="filter-shipped"
            >
              Shipped
            </TabsTrigger>
            <TabsTrigger 
              value="COMPLETED"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
              data-testid="filter-completed"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredOrders.length === 0 ? (
          <Card className="border-slate-200/60">
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600" data-testid="text-no-orders">
                No orders found for this status
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Collapsible 
                key={order.id}
                open={expandedOrders.has(order.id)}
                onOpenChange={() => toggleOrder(order.id)}
              >
                <Card 
                  className="border border-slate-200/60 hover:shadow-sm transition-shadow"
                  data-testid={`card-order-${order.id}`}
                >
                  <CardContent className="p-6">
                    <CollapsibleTrigger asChild>
                      <button className="w-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900" data-testid={`text-order-code-${order.id}`}>
                                {order.orderCode}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={statusConfig[order.status].color}
                                data-testid={`badge-status-${order.id}`}
                              >
                                {statusConfig[order.status].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600" data-testid={`text-order-date-${order.id}`}>
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-slate-600 mb-1">Total</p>
                              <p className="font-semibold text-slate-900" data-testid={`text-order-total-${order.id}`}>
                                {formatPrice(order.total)}
                              </p>
                            </div>
                            {expandedOrders.has(order.id) ? (
                              <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t border-slate-100 pt-4 mt-2">
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div 
                                key={idx} 
                                className="flex justify-between text-sm"
                                data-testid={`order-item-${order.id}-${idx}`}
                              >
                                <span className="text-slate-700">
                                  {item.productName} <span className="text-slate-500">x{item.quantity}</span>
                                </span>
                                <span className="font-medium text-slate-900">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Shipping Address</h4>
                          <p className="text-sm text-slate-700" data-testid={`text-shipping-address-${order.id}`}>
                            {order.shippingAddress}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full border-slate-300 hover:bg-slate-50"
                          data-testid={`button-track-order-${order.id}`}
                        >
                          Track Order
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
