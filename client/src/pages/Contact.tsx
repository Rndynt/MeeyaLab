import { useState } from "react";
import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function Contact() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} onCartClick={() => setCartOpen(true)} />
      
      <main className="flex-1 bg-slate-50 pt-16 md:pt-20 pb-8">
        <ContactSection />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={[]}
        onCheckout={() => setCartOpen(false)}
      />
    </div>
  );
}
