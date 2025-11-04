import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  const cartItems: CartItem[] = [];
  const cartItemCount = 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        cartItemCount={cartItemCount} 
        onCartClick={() => setCartOpen(true)}
        onProfileClick={() => setLocation("/profile")} 
      />
      
      <main className="flex-1 py-8 pt-24 md:pt-28">
        {children}
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onUpdateQuantity={(id, qty) => console.log("Update qty:", id, qty)}
        onRemoveItem={(id) => console.log("Remove:", id)}
        onCheckout={() => setCartOpen(false)}
        onLogin={() => {
          setCartOpen(false);
          setLocation("/login");
        }}
      />
    </div>
  );
}
