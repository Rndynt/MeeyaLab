import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import CategoryPills from "@/components/CategoryPills";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import type { Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";
import cleanser from "@assets/generated_images/White_pump_bottle_cleanser_5f9a5b07.png";
import tube from "@assets/generated_images/White_skincare_tube_product_f0b2ba56.png";

export default function Products() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const allProducts: Product[] = [
    { id: "1", name: "Hydrating Serum", price: 250000, imageUrl: serum, category: "Serums", brand: "SkinLite", inStock: true },
    { id: "2", name: "Daily Moisturizer", price: 180000, imageUrl: cream, category: "Moisturizers", brand: "GlowLab", inStock: true },
    { id: "3", name: "Gentle Cleanser", price: 150000, imageUrl: cleanser, category: "Cleansers", brand: "PureEssence", inStock: true },
    { id: "4", name: "Night Cream", price: 220000, imageUrl: tube, category: "Treatments", brand: "SkinLite", inStock: false },
    { id: "5", name: "Vitamin C Serum", price: 280000, imageUrl: serum, category: "Serums", brand: "GlowLab", inStock: true },
    { id: "6", name: "Eye Cream", price: 190000, imageUrl: cream, category: "Treatments", brand: "PureEssence", inStock: true },
    { id: "7", name: "Face Wash", price: 120000, imageUrl: cleanser, category: "Cleansers", brand: "SkinLite", inStock: true },
    { id: "8", name: "Sunscreen SPF 50", price: 160000, imageUrl: tube, category: "Sunscreen", brand: "GlowLab", inStock: false },
  ];

  const categories = ["All", "Cleansers", "Serums", "Moisturizers", "Sunscreen", "Treatments"];
  
  const brands = ["all", ...Array.from(new Set(allProducts.map(p => p.brand).filter((b): b is string => !!b)))];

  // Apply filters
  let filteredProducts = allProducts;
  
  // Filter by category
  if (activeCategory !== "All") {
    filteredProducts = filteredProducts.filter((p) => p.category === activeCategory);
  }
  
  // Filter by brand
  if (filterBrand !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.brand === filterBrand);
  }
  
  // Filter by availability
  if (filterAvailability === "in-stock") {
    filteredProducts = filteredProducts.filter((p) => p.inStock === true);
  } else if (filterAvailability === "out-of-stock") {
    filteredProducts = filteredProducts.filter((p) => p.inStock === false);
  }
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0; // default order
  });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItemCount} onCartClick={() => setCartOpen(true)} />
      
      <main className="flex-1 pt-16 md:pt-20">
        <div className="bg-white py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
            <p className="text-slate-600 mt-2">Browse our complete skincare collection</p>
          </div>
        </div>

        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
        />

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-wrap gap-3 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" data-testid="button-sort">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="default" data-testid="sort-default">Default</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-low" data-testid="sort-price-low">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-high" data-testid="sort-price-high">Price: High to Low</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name" data-testid="sort-name">Name (A-Z)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" data-testid="button-filter-brand">
                  <Filter className="h-4 w-4" />
                  Brand
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by Brand</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterBrand} onValueChange={setFilterBrand}>
                  <DropdownMenuRadioItem value="all" data-testid="filter-brand-all">All Brands</DropdownMenuRadioItem>
                  {brands.filter(b => b !== "all").map((brand) => (
                    <DropdownMenuRadioItem key={brand} value={brand} data-testid={`filter-brand-${brand}`}>
                      {brand}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" data-testid="button-filter-availability">
                  <Filter className="h-4 w-4" />
                  Availability
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by Availability</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterAvailability} onValueChange={setFilterAvailability}>
                  <DropdownMenuRadioItem value="all" data-testid="filter-availability-all">All Products</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="in-stock" data-testid="filter-availability-in-stock">In Stock</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="out-of-stock" data-testid="filter-availability-out-of-stock">Out of Stock</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <ProductGrid products={sortedProducts} onAddToCart={handleAddToCart} />
        </section>
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
