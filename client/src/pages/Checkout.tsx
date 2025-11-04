import { useState } from "react";
import Header from "@/components/Header";
import CheckoutForm, { type CheckoutData } from "@/components/CheckoutForm";
import Footer from "@/components/Footer";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";

export default function Checkout() {
  const [cartOpen, setCartOpen] = useState(false);
  
  const cartItems: CartItem[] = [
    { id: "1", name: "Hydrating Serum", price: 250000, quantity: 2, imageUrl: serum },
    { id: "2", name: "Daily Moisturizer", price: 180000, quantity: 1, imageUrl: cream },
  ];

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (data: CheckoutData) => {
    console.log("Checkout submitted:", data);
    alert("Payment processing would happen here with Midtrans!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItemCount} onCartClick={() => setCartOpen(true)} />
      
      <main className="flex-1 bg-slate-50">
        <CheckoutForm cartItems={cartItems} onSubmit={handleCheckoutSubmit} />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onUpdateQuantity={(id, qty) => console.log("Update qty:", id, qty)}
        onRemoveItem={(id) => console.log("Remove:", id)}
        onCheckout={() => setCartOpen(false)}
        onLogin={() => setCartOpen(false)}
      />
    </div>
  );
}
