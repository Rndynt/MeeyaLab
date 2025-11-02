import { useState } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import AdminOrderList, { type AdminOrder } from "@/components/AdminOrderList";

export default function AdminOrdersPage() {
  const [, setLocation] = useLocation();
  
  const [orders, setOrders] = useState<AdminOrder[]>([
    {
      id: "1",
      orderCode: "SK-2025-0001",
      customerName: "John Doe",
      phone: "0812-3456-7890",
      total: 680000,
      status: "PAID",
      createdAt: "2025-01-15 14:30",
    },
    {
      id: "2",
      orderCode: "SK-2025-0002",
      customerName: "Jane Smith",
      phone: "0813-7654-3210",
      total: 430000,
      status: "PROCESSING",
      createdAt: "2025-01-15 16:45",
    },
  ]);

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <AdminOrderList
        orders={orders}
        onUpdateStatus={(id, status) => {
          console.log("Update order status:", id, status);
          setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        }}
      />
    </AdminLayout>
  );
}
