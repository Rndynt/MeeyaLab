import ProductCard from "../ProductCard";
import productImage from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";

export default function ProductCardExample() {
  return (
    <div className="max-w-xs">
      <ProductCard
        product={{
          id: "1",
          name: "Hydrating Serum",
          price: 250000,
          imageUrl: productImage,
          category: "Serums",
        }}
        onAddToCart={(product) => console.log("Added to cart:", product)}
      />
    </div>
  );
}
