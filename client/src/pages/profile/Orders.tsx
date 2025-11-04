import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ProfileLayout from "@/components/ProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Package, ArrowLeft, Truck, CheckCircle, Clock, CreditCard } from "lucide-react";
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
  PENDING_PAYMENT: { 
    label: "Pending Payment", 
    color: "bg-amber-50 text-amber-700 border-amber-100",
    icon: Clock 
  },
  PAID: { 
    label: "Paid", 
    color: "bg-blue-50 text-blue-700 border-blue-100",
    icon: CreditCard 
  },
  PROCESSING: { 
    label: "Processing", 
    color: "bg-purple-50 text-purple-700 border-purple-100",
    icon: Package 
  },
  SHIPPED: { 
    label: "Shipped", 
    color: "bg-cyan-50 text-cyan-700 border-cyan-100",
    icon: Truck 
  },
  COMPLETED: { 
    label: "Completed", 
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: CheckCircle 
  },
};

type StatusFilter = "ALL" | Order["status"];

export default function Orders() {
  const [orders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set(["1"]));
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

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
              data-testid="filter-all"
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter("PENDING_PAYMENT")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === "PENDING_PAYMENT"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
              data-testid="filter-pending"
            >
              <Clock className="h-3.5 w-3.5" />
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("PROCESSING")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === "PROCESSING"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
              data-testid="filter-processing"
            >
              <Package className="h-3.5 w-3.5" />
              Processing
            </button>
            <button
              onClick={() => setStatusFilter("SHIPPED")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === "SHIPPED"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
              data-testid="filter-shipped"
            >
              <Truck className="h-3.5 w-3.5" />
              Shipped
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === "COMPLETED"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
              data-testid="filter-completed"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Completed
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="border-slate-100 shadow-sm">
            <CardContent className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders found</h3>
              <p className="text-sm text-slate-500" data-testid="text-no-orders">
                No orders match the selected filter
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <Collapsible 
                  key={order.id}
                  open={expandedOrders.has(order.id)}
                  onOpenChange={() => toggleOrder(order.id)}
                >
                  <Card 
                    className="border border-slate-100 hover:border-slate-200 transition-all duration-200 overflow-hidden"
                    data-testid={`card-order-${order.id}`}
                  >
                    <CollapsibleTrigger asChild>
                      <button className="w-full">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 flex items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1.5">
                                  <h3 className="font-semibold text-slate-900 text-base" data-testid={`text-order-code-${order.id}`}>
                                    {order.orderCode}
                                  </h3>
                                  <span 
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[order.status].color}`}
                                    data-testid={`badge-status-${order.id}`}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {statusConfig[order.status].label}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500" data-testid={`text-order-date-${order.id}`}>
                                  {formatDate(order.date)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-xs text-slate-500 mb-0.5">Total</p>
                                <p className="text-lg font-semibold text-slate-900" data-testid={`text-order-total-${order.id}`}>
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                              <div className="ml-2">
                                {expandedOrders.has(order.id) ? (
                                  <ChevronUp className="h-5 w-5 text-slate-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-slate-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t border-slate-50 bg-slate-25">
                        <CardContent className="p-6 pt-5 space-y-5">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Package className="h-4 w-4 text-slate-400" />
                              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Order Items</h4>
                            </div>
                            <div className="space-y-2.5">
                              {order.items.map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex items-center justify-between py-2"
                                  data-testid={`order-item-${order.id}-${idx}`}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm text-slate-900 font-medium">
                                      {item.productName}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      Qty: {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Truck className="h-4 w-4 text-slate-400" />
                              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Delivery Address</h4>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed" data-testid={`text-shipping-address-${order.id}`}>
                              {order.shippingAddress}
                            </p>
                          </div>

                          <div className="border-t border-slate-100 pt-4">
                            <Button
                              variant="ghost"
                              className="w-full justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 h-10"
                              data-testid={`button-track-order-${order.id}`}
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Track Shipment
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
