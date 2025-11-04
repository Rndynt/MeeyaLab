import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserLogin from "@/components/UserLogin";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";
import { useState } from "react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  const cartItems: CartItem[] = [];
  const cartItemCount = 0;

  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt:", { email, password });
    alert("Login successful! (Design only - functionality not implemented)");
    setLocation("/");
  };

  const handleGuestContinue = () => {
    console.log("Continue as guest");
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header cartItemCount={cartItemCount} onCartClick={() => setCartOpen(true)} onProfileClick={() => setLocation("/profile")} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16 pt-28">
        <UserLogin onLogin={handleLogin} onGuestContinue={handleGuestContinue} />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onUpdateQuantity={(id, qty) => console.log("Update qty:", id, qty)}
        onRemoveItem={(id) => console.log("Remove:", id)}
        onCheckout={() => setCartOpen(false)}
      />
    </div>
  );
}
