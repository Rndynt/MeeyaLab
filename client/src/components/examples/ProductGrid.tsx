import ProductGrid from "../ProductGrid";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";
import cleanser from "@assets/generated_images/White_pump_bottle_cleanser_5f9a5b07.png";
import tube from "@assets/generated_images/White_skincare_tube_product_f0b2ba56.png";

export default function ProductGridExample() {
  const products = [
    { id: "1", name: "Hydrating Serum", price: 250000, imageUrl: serum },
    { id: "2", name: "Daily Moisturizer", price: 180000, imageUrl: cream },
    { id: "3", name: "Gentle Cleanser", price: 150000, imageUrl: cleanser },
    { id: "4", name: "Night Cream", price: 220000, imageUrl: tube },
    { id: "5", name: "Vitamin C Serum", price: 280000, imageUrl: serum },
    { id: "6", name: "Eye Cream", price: 190000, imageUrl: cream },
    { id: "7", name: "Face Wash", price: 120000, imageUrl: cleanser },
    { id: "8", name: "Sunscreen SPF 50", price: 160000, imageUrl: tube },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <ProductGrid
        products={products}
        onAddToCart={(product) => console.log("Added to cart:", product)}
      />
    </div>
  );
}
