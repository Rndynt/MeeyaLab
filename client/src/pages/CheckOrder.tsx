import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import OrderTracking, { type Order } from "@/components/OrderTracking";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function CheckOrder() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    
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
    setOrder(mockOrder);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} onCartClick={() => setCartOpen(true)} onProfileClick={() => setLocation("/profile")} />
      
      <main className="flex-1 bg-slate-50 pt-16 md:pt-20 pb-8">
        <OrderTracking onSearch={handleSearch} order={order} />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={[]}
        onCheckout={() => setCartOpen(false)}
        onLogin={() => setCartOpen(false)}
      />
    </div>
  );
}
