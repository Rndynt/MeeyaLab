import { useState } from "react";
import { useLocation } from "wouter";
import HeroHeader from "@/components/HeroHeader";
import CategoryPills from "@/components/CategoryPills";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import type { Product } from "@/components/ProductCard";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";
import cleanser from "@assets/generated_images/White_pump_bottle_cleanser_5f9a5b07.png";
import tube from "@assets/generated_images/White_skincare_tube_product_f0b2ba56.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const allProducts: Product[] = [
    { id: "1", name: "Hydrating Serum", price: 250000, imageUrl: serum, category: "Serums", brand: "SkinLite" },
    { id: "2", name: "Daily Moisturizer", price: 180000, imageUrl: cream, category: "Moisturizers", brand: "SkinLite" },
    { id: "3", name: "Gentle Cleanser", price: 150000, imageUrl: cleanser, category: "Cleansers", brand: "SkinLite" },
    { id: "4", name: "Night Cream", price: 220000, imageUrl: tube, category: "Treatments", brand: "SkinLite" },
    { id: "5", name: "Vitamin C Serum", price: 280000, imageUrl: serum, category: "Serums", brand: "SkinLite" },
    { id: "6", name: "Eye Cream", price: 190000, imageUrl: cream, category: "Treatments", brand: "SkinLite" },
    { id: "7", name: "Face Wash", price: 120000, imageUrl: cleanser, category: "Cleansers", brand: "SkinLite" },
    { id: "8", name: "Sunscreen SPF 50", price: 160000, imageUrl: tube, category: "Sunscreen", brand: "SkinLite" },
  ];

  const categories = ["All", "Cleansers", "Serums", "Moisturizers", "Sunscreen", "Treatments"];

  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ]);
    }
    console.log(`Added ${product.name} to cart`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleProductClick = (product: Product) => {
    setLocation(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeroHeader
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
        onShopClick={() => {
          const productsSection = document.getElementById("products");
          productsSection?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      
      <main className="flex-1 bg-white">
        <div id="products" className="mt-8 md:mt-12">
          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onCategoryClick={setActiveCategory}
          />

          <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <ProductGrid 
              products={filteredProducts} 
              onAddToCart={handleAddToCart}
              onProductClick={handleProductClick}
            />
          </section>
        </div>
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          setLocation("/checkout");
        }}
      />
    </div>
  );
}
