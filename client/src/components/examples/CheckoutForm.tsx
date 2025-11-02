import CheckoutForm from "../CheckoutForm";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";

export default function CheckoutFormExample() {
  const cartItems = [
    { id: "1", name: "Hydrating Serum", price: 250000, quantity: 2, imageUrl: serum },
    { id: "2", name: "Daily Moisturizer", price: 180000, quantity: 1, imageUrl: cream },
  ];

  return (
    <CheckoutForm
      cartItems={cartItems}
      onSubmit={(data) => console.log("Checkout submitted:", data)}
    />
  );
}
