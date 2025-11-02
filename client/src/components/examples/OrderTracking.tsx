import { useState } from "react";
import OrderTracking, { type Order } from "../OrderTracking";

export default function OrderTrackingExample() {
  const [order, setOrder] = useState<Order | null>(null);

  const mockOrder: Order = {
    orderCode: "SK-2025-0001",
    customerName: "John Doe",
    phone: "0812-3456-7890",
    total: 680000,
    status: "PAID",
    createdAt: "2025-01-15 14:30",
    items: [
      { name: "Hydrating Serum", quantity: 2, price: 250000 },
      { name: "Daily Moisturizer", quantity: 1, price: 180000 },
    ],
  };

  return (
    <OrderTracking
      onSearch={(query) => {
        console.log("Searching for:", query);
        setOrder(mockOrder);
      }}
      order={order}
    />
  );
}
