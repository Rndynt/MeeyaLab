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

export default function AdminOrderList({ orders, onUpdateStatus }: AdminOrderListProps) {
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

  return (
    <div data-testid="admin-order-list">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded-lg border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Code</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
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
                <TableCell className="text-sm text-slate-600">{order.createdAt}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => onUpdateStatus?.(order.id, value as AdminOrder["status"])}
                  >
                    <SelectTrigger className="w-[180px]" data-testid={`select-status-${order.id}`}>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
