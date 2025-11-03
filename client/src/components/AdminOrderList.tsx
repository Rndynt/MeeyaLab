import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Calendar } from "lucide-react";
import { format, isToday, isYesterday, startOfDay, parseISO, isValid } from "date-fns";

export interface AdminOrder {
  id: string;
  orderCode: string;
  customerName: string;
  phone: string;
  total: number;
  status: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

interface AdminOrderListProps {
  orders: AdminOrder[];
  onUpdateStatus?: (id: string, status: AdminOrder["status"]) => void;
}

type DateFilter = "all" | "today" | "yesterday";
type StatusFilter = "all" | AdminOrder["status"];

export default function AdminOrderList({ orders, onUpdateStatus }: AdminOrderListProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const safeParseDate = (dateString: string): Date => {
    const isoDate = parseISO(dateString);
    if (isValid(isoDate)) {
      return isoDate;
    }
    const jsDate = new Date(dateString);
    if (isValid(jsDate)) {
      return jsDate;
    }
    return new Date();
  };

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

  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const filteredAndGroupedOrders = useMemo(() => {
    let filtered = [...orders];

    if (dateFilter === "today") {
      filtered = filtered.filter((order) => isToday(safeParseDate(order.createdAt)));
    } else if (dateFilter === "yesterday") {
      filtered = filtered.filter((order) => isYesterday(safeParseDate(order.createdAt)));
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    filtered.sort((a, b) => safeParseDate(b.createdAt).getTime() - safeParseDate(a.createdAt).getTime());

    const grouped = filtered.reduce((acc, order) => {
      const date = safeParseDate(order.createdAt);
      const dateKey = format(startOfDay(date), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = {
          label: getDateLabel(date),
          orders: [],
        };
      }
      acc[dateKey].orders.push(order);
      return acc;
    }, {} as Record<string, { label: string; orders: AdminOrder[] }>);

    return Object.entries(grouped).map(([dateKey, { label, orders }]) => ({
      dateKey,
      label,
      orders,
    }));
  }, [orders, dateFilter, statusFilter]);

  return (
    <div data-testid="admin-order-list">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-2">
            <Button
              variant={dateFilter === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter(dateFilter === "today" ? "all" : "today")}
              className={dateFilter === "today" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
              data-testid="button-filter-today"
            >
              Today
            </Button>
            <Button
              variant={dateFilter === "yesterday" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter(dateFilter === "yesterday" ? "all" : "yesterday")}
              className={dateFilter === "yesterday" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
              data-testid="button-filter-yesterday"
            >
              Yesterday
            </Button>
            <Button
              variant={dateFilter === "all" && statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDateFilter("all");
                setStatusFilter("all");
              }}
              className={dateFilter === "all" && statusFilter === "all" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
              data-testid="button-filter-all"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredAndGroupedOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No orders found
          </div>
        ) : (
          filteredAndGroupedOrders.map(({ dateKey, label, orders: groupOrders }) => (
            <div key={dateKey} className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-slate-700">{label}</h2>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Code</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupOrders.map((order) => (
                      <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                        <TableCell className="font-medium">{order.orderCode}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.phone}</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {format(safeParseDate(order.createdAt), "HH:mm")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                data-testid={`button-view-${order.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Select
                              value={order.status}
                              onValueChange={(value) => onUpdateStatus?.(order.id, value as AdminOrder["status"])}
                            >
                              <SelectTrigger className="w-[150px]" data-testid={`select-status-${order.id}`}>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
