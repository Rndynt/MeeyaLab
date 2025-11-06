import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import ShippingLabelDialog from "@/components/ShippingLabelDialog";
import TrackingUpdateDialog from "@/components/TrackingUpdateDialog";
import FailedDeliveryDialog from "@/components/FailedDeliveryDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Truck,
  Package,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  Weight,
  FileText,
  Printer,
  Eye,
  Search,
  PackageCheck,
  PackageX,
  Clock,
} from "lucide-react";

interface ShippingOrder {
  id: string;
  orderId: string;
  orderCode: string;
  customerName: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  courierName: "JNE" | "J&T" | "SiCepat" | "AnterAja";
  courierService: string;
  trackingNumber?: string;
  weight: number;
  shippingCost: number;
  estimatedDeliveryDays: number;
  status:
    | "ready_to_ship"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "failed"
    | "returned";
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

type TabType = "ready_to_ship" | "in_transit" | "delivered" | "failed";

export default function ShippingLogisticsPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("ready_to_ship");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [failedDialogOpen, setFailedDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null);

  const [shippingOrders] = useState<ShippingOrder[]>([
    {
      id: "1",
      orderId: "ord-1",
      orderCode: "SK-2025-001",
      customerName: "Siti Nurhaliza",
      recipientName: "Siti Nurhaliza",
      phone: "081234567890",
      address: "Jl. Sudirman No. 123, RT 01/RW 05",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12190",
      courierName: "JNE",
      courierService: "REG",
      weight: 500,
      shippingCost: 25000,
      estimatedDeliveryDays: 3,
      status: "ready_to_ship",
      createdAt: "2025-01-06T08:00:00",
    },
    {
      id: "2",
      orderId: "ord-2",
      orderCode: "SK-2025-002",
      customerName: "Budi Santoso",
      recipientName: "Budi Santoso",
      phone: "081298765432",
      address: "Jl. Braga No. 45, Kav 3",
      city: "Bandung",
      province: "Jawa Barat",
      postalCode: "40111",
      courierName: "J&T",
      courierService: "YES",
      weight: 750,
      shippingCost: 30000,
      estimatedDeliveryDays: 2,
      status: "ready_to_ship",
      createdAt: "2025-01-06T09:30:00",
    },
    {
      id: "3",
      orderId: "ord-3",
      orderCode: "SK-2025-003",
      customerName: "Dewi Lestari",
      recipientName: "Dewi Lestari",
      phone: "081345678901",
      address: "Jl. Pemuda No. 78",
      city: "Surabaya",
      province: "Jawa Timur",
      postalCode: "60271",
      courierName: "SiCepat",
      courierService: "HALU",
      trackingNumber: "SICEPAT-2025-0003",
      weight: 600,
      shippingCost: 35000,
      estimatedDeliveryDays: 2,
      status: "in_transit",
      shippedAt: "2025-01-05T10:00:00",
      createdAt: "2025-01-05T08:00:00",
    },
    {
      id: "4",
      orderId: "ord-4",
      orderCode: "SK-2025-004",
      customerName: "Ahmad Hidayat",
      recipientName: "Ahmad Hidayat",
      phone: "081456789012",
      address: "Jl. Pahlawan No. 12",
      city: "Semarang",
      province: "Jawa Tengah",
      postalCode: "50134",
      courierName: "AnterAja",
      courierService: "REG",
      trackingNumber: "ANTERAJA-2025-0004",
      weight: 450,
      shippingCost: 28000,
      estimatedDeliveryDays: 3,
      status: "in_transit",
      shippedAt: "2025-01-05T14:00:00",
      createdAt: "2025-01-05T10:00:00",
    },
    {
      id: "5",
      orderId: "ord-5",
      orderCode: "SK-2025-005",
      customerName: "Rina Wati",
      recipientName: "Rina Wati",
      phone: "081567890123",
      address: "Jl. Gatot Subroto No. 234",
      city: "Denpasar",
      province: "Bali",
      postalCode: "80234",
      courierName: "JNE",
      courierService: "YES",
      trackingNumber: "JNE-2025-0005",
      weight: 800,
      shippingCost: 45000,
      estimatedDeliveryDays: 4,
      status: "delivered",
      shippedAt: "2025-01-03T09:00:00",
      deliveredAt: "2025-01-06T15:30:00",
      createdAt: "2025-01-03T08:00:00",
    },
    {
      id: "6",
      orderId: "ord-6",
      orderCode: "SK-2025-006",
      customerName: "Fajar Ramadhan",
      recipientName: "Fajar Ramadhan",
      phone: "081678901234",
      address: "Jl. Diponegoro No. 56",
      city: "Yogyakarta",
      province: "DI Yogyakarta",
      postalCode: "55223",
      courierName: "J&T",
      courierService: "REG",
      trackingNumber: "JT-2025-0006",
      weight: 550,
      shippingCost: 32000,
      estimatedDeliveryDays: 3,
      status: "delivered",
      shippedAt: "2025-01-04T11:00:00",
      deliveredAt: "2025-01-06T14:00:00",
      createdAt: "2025-01-04T09:00:00",
    },
    {
      id: "7",
      orderId: "ord-7",
      orderCode: "SK-2025-007",
      customerName: "Linda Wijaya",
      recipientName: "Linda Wijaya",
      phone: "081789012345",
      address: "Jl. Ahmad Yani No. 89",
      city: "Malang",
      province: "Jawa Timur",
      postalCode: "65145",
      courierName: "SiCepat",
      courierService: "REG",
      trackingNumber: "SICEPAT-2025-0007",
      weight: 400,
      shippingCost: 27000,
      estimatedDeliveryDays: 3,
      status: "failed",
      shippedAt: "2025-01-05T08:00:00",
      createdAt: "2025-01-05T07:00:00",
    },
    {
      id: "8",
      orderId: "ord-8",
      orderCode: "SK-2025-008",
      customerName: "Hendra Kusuma",
      recipientName: "Hendra Kusuma",
      phone: "081890123456",
      address: "Jl. Veteran No. 45, Blok C",
      city: "Medan",
      province: "Sumatera Utara",
      postalCode: "20112",
      courierName: "JNE",
      courierService: "REG",
      weight: 650,
      shippingCost: 38000,
      estimatedDeliveryDays: 5,
      status: "ready_to_ship",
      createdAt: "2025-01-06T10:00:00",
    },
  ]);

  const getStatusBadge = (
    status: ShippingOrder["status"]
  ): { text: string; className: string } => {
    switch (status) {
      case "ready_to_ship":
        return {
          text: "Ready to Ship",
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        };
      case "picked_up":
        return {
          text: "Picked Up",
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        };
      case "in_transit":
        return {
          text: "In Transit",
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        };
      case "out_for_delivery":
        return {
          text: "Out for Delivery",
          className: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
        };
      case "delivered":
        return {
          text: "Delivered",
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        };
      case "failed":
        return {
          text: "Failed",
          className: "bg-red-100 text-red-800 hover:bg-red-100",
        };
      case "returned":
        return {
          text: "Returned",
          className: "bg-slate-100 text-slate-800 hover:bg-slate-100",
        };
    }
  };

  const getOrdersByTab = (tab: TabType): ShippingOrder[] => {
    let orders = shippingOrders;

    if (tab === "ready_to_ship") {
      orders = orders.filter((o) => o.status === "ready_to_ship");
    } else if (tab === "in_transit") {
      orders = orders.filter(
        (o) =>
          o.status === "in_transit" ||
          o.status === "picked_up" ||
          o.status === "out_for_delivery"
      );
    } else if (tab === "delivered") {
      orders = orders.filter((o) => o.status === "delivered");
    } else if (tab === "failed") {
      orders = orders.filter(
        (o) => o.status === "failed" || o.status === "returned"
      );
    }

    if (searchQuery) {
      orders = orders.filter(
        (o) =>
          o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return orders;
  };

  const stats = [
    {
      title: "Ready to Ship",
      value: shippingOrders.filter((o) => o.status === "ready_to_ship").length,
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      badge: "Pending",
      badgeColor: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    {
      title: "In Transit",
      value: shippingOrders.filter(
        (o) =>
          o.status === "in_transit" ||
          o.status === "picked_up" ||
          o.status === "out_for_delivery"
      ).length,
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      badge: "Active",
      badgeColor: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    {
      title: "Delivered Today",
      value: shippingOrders.filter(
        (o) =>
          o.status === "delivered" &&
          o.deliveredAt &&
          new Date(o.deliveredAt).toDateString() === new Date().toDateString()
      ).length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      badge: "Success",
      badgeColor: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    {
      title: "Failed Deliveries",
      value: shippingOrders.filter(
        (o) => o.status === "failed" || o.status === "returned"
      ).length,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      badge: "Attention",
      badgeColor: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    const tabOrders = getOrdersByTab(activeTab);
    if (selectedOrders.length === tabOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(tabOrders.map((o) => o.id));
    }
  };

  const handlePrintLabel = (order: ShippingOrder) => {
    setSelectedOrder(order);
    setLabelDialogOpen(true);
  };

  const handleUpdateTracking = (order: ShippingOrder) => {
    setSelectedOrder(order);
    setTrackingDialogOpen(true);
  };

  const handleResolveFailure = (order: ShippingOrder) => {
    setSelectedOrder(order);
    setFailedDialogOpen(true);
  };

  const tabOrders = getOrdersByTab(activeTab);
  const allSelected = selectedOrders.length === tabOrders.length && tabOrders.length > 0;

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <div className="space-y-6" data-testid="shipping-logistics-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
            Shipping & Logistics
          </h1>
          <Badge
            className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 w-fit"
            data-testid="badge-live-status"
          >
            Live Tracking
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="transition-all hover:shadow-md"
                data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge className={stat.badgeColor}>{stat.badge}</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-sm text-slate-600 mt-1">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Bulk Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by order code, tracking number, or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          {selectedOrders.length > 0 && (
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="px-3 py-2"
                data-testid="badge-selected-count"
              >
                {selectedOrders.length} selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                data-testid="button-print-selected"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Labels
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-cyan-500 hover:bg-cyan-600"
                data-testid="button-mark-shipped"
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark Shipped
              </Button>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as TabType);
            setSelectedOrders([]);
          }}
          className="space-y-4"
        >
          <TabsList className="w-full sm:w-auto" data-testid="tabs-list">
            <TabsTrigger value="ready_to_ship" data-testid="tab-ready-to-ship">
              Ready to Ship ({shippingOrders.filter((o) => o.status === "ready_to_ship").length})
            </TabsTrigger>
            <TabsTrigger value="in_transit" data-testid="tab-in-transit">
              In Transit (
              {
                shippingOrders.filter(
                  (o) =>
                    o.status === "in_transit" ||
                    o.status === "picked_up" ||
                    o.status === "out_for_delivery"
                ).length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="delivered" data-testid="tab-delivered">
              Delivered ({shippingOrders.filter((o) => o.status === "delivered").length})
            </TabsTrigger>
            <TabsTrigger value="failed" data-testid="tab-failed">
              Failed (
              {
                shippingOrders.filter(
                  (o) => o.status === "failed" || o.status === "returned"
                ).length
              }
              )
            </TabsTrigger>
          </TabsList>

          {/* Select All Checkbox for Ready to Ship */}
          {activeTab === "ready_to_ship" && tabOrders.length > 0 && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                data-testid="checkbox-select-all"
              />
              <label className="text-sm text-slate-600">Select all orders</label>
            </div>
          )}

          {/* Tab Contents */}
          <TabsContent value={activeTab} className="space-y-4">
            {tabOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No shipping orders found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {tabOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  const isSelected = selectedOrders.includes(order.id);

                  return (
                    <Card
                      key={order.id}
                      className={`transition-all hover:shadow-md ${
                        isSelected ? "ring-2 ring-cyan-500" : ""
                      }`}
                      data-testid={`card-order-${order.orderCode}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {activeTab === "ready_to_ship" && (
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleSelectOrder(order.id)}
                                data-testid={`checkbox-order-${order.orderCode}`}
                              />
                            )}
                            <div>
                              <CardTitle className="text-base font-semibold">
                                {order.orderCode}
                              </CardTitle>
                              <p className="text-sm text-slate-500 mt-1">
                                {order.customerName}
                              </p>
                            </div>
                          </div>
                          <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Courier Info */}
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-900">
                            {order.courierName} {order.courierService}
                          </span>
                          {order.trackingNumber && (
                            <Badge variant="outline" className="ml-auto">
                              {order.trackingNumber}
                            </Badge>
                          )}
                        </div>

                        {/* Destination */}
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-slate-900">{order.city}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{order.address}</p>
                          </div>
                        </div>

                        {/* Weight & Cost */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{order.weight}g</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">
                              {formatCurrency(order.shippingCost)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-auto">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">
                              {order.estimatedDeliveryDays}d
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          {order.status === "ready_to_ship" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handlePrintLabel(order)}
                                data-testid={`button-print-label-${order.orderCode}`}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Label
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                                data-testid={`button-mark-shipped-${order.orderCode}`}
                              >
                                <Truck className="h-4 w-4 mr-1" />
                                Ship
                              </Button>
                            </>
                          )}
                          {(order.status === "in_transit" ||
                            order.status === "picked_up" ||
                            order.status === "out_for_delivery") && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleUpdateTracking(order)}
                                data-testid={`button-update-tracking-${order.orderCode}`}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Tracking
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-green-500 hover:bg-green-600"
                                data-testid={`button-mark-delivered-${order.orderCode}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Delivered
                              </Button>
                            </>
                          )}
                          {order.status === "delivered" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleUpdateTracking(order)}
                                data-testid={`button-view-proof-${order.orderCode}`}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Proof
                              </Button>
                              <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
                                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                {order.deliveredAt && formatDate(order.deliveredAt)}
                              </div>
                            </>
                          )}
                          {(order.status === "failed" || order.status === "returned") && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleResolveFailure(order)}
                                data-testid={`button-resolve-${order.orderCode}`}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Resolve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                data-testid={`button-cancel-${order.orderCode}`}
                              >
                                <PackageX className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <ShippingLabelDialog
        open={labelDialogOpen}
        onOpenChange={setLabelDialogOpen}
        order={selectedOrder}
      />

      <TrackingUpdateDialog
        open={trackingDialogOpen}
        onOpenChange={setTrackingDialogOpen}
        order={selectedOrder}
      />

      <FailedDeliveryDialog
        open={failedDialogOpen}
        onOpenChange={setFailedDialogOpen}
        order={selectedOrder}
      />
    </AdminLayout>
  );
}
