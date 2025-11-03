import { useState } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import AdminOrderList, { type AdminOrder } from "@/components/AdminOrderList";

export default function AdminOrdersPage() {
  const [, setLocation] = useLocation();
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const [orders, setOrders] = useState<AdminOrder[]>([
    {
      id: "1",
      orderCode: "SK-2025-0001",
      customerName: "John Doe",
      phone: "0812-3456-7890",
      total: 680000,
      status: "PAID",
      createdAt: today.toISOString(),
    },
    {
      id: "2",
      orderCode: "SK-2025-0002",
      customerName: "Jane Smith",
      phone: "0813-7654-3210",
      total: 430000,
      status: "PROCESSING",
      createdAt: today.toISOString(),
    },
    {
      id: "3",
      orderCode: "SK-2025-0003",
      customerName: "Alice Johnson",
      phone: "0814-5555-1234",
      total: 520000,
      status: "SHIPPED",
      createdAt: yesterday.toISOString(),
    },
    {
      id: "4",
      orderCode: "SK-2025-0004",
      customerName: "Bob Wilson",
      phone: "0815-6666-5678",
      total: 320000,
      status: "COMPLETED",
      createdAt: yesterday.toISOString(),
    },
    {
      id: "5",
      orderCode: "SK-2025-0005",
      customerName: "Charlie Brown",
      phone: "0816-7777-9012",
      total: 750000,
      status: "PENDING_PAYMENT",
      createdAt: twoDaysAgo.toISOString(),
    },
    {
      id: "6",
      orderCode: "SK-2025-0006",
      customerName: "Diana Prince",
      phone: "0817-8888-3456",
      total: 890000,
      status: "CANCELLED",
      createdAt: threeDaysAgo.toISOString(),
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
