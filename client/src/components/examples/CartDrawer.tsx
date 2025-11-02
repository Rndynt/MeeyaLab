import { useState } from "react";
import CartDrawer, { type CartItem } from "../CartDrawer";
import { Button } from "@/components/ui/button";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";

export default function CartDrawerExample() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([
    { id: "1", name: "Hydrating Serum", price: 250000, quantity: 2, imageUrl: serum },
    { id: "2", name: "Daily Moisturizer", price: 180000, quantity: 1, imageUrl: cream },
  ]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Cart</Button>
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        items={items}
        onUpdateQuantity={(id, quantity) => {
          setItems(items.map(item => item.id === id ? { ...item, quantity } : item));
        }}
        onRemoveItem={(id) => {
          setItems(items.filter(item => item.id !== id));
        }}
        onCheckout={() => console.log("Checkout clicked")}
      />
    </>
  );
}
