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
    { 
      id: "1", 
      name: "Hydrating Serum", 
      price: 250000, 
      imageUrl: serum, 
      category: "Serums", 
      brand: "SkinLite", 
      inStock: true,
      size: "30ml",
      description: "A lightweight, fast-absorbing serum that delivers intense hydration to your skin. Formulated with hyaluronic acid and vitamin B5 to plump and refresh.",
      ingredients: "Water, Hyaluronic Acid, Vitamin B5, Glycerin, Niacinamide, Aloe Vera Extract",
      usage: "Apply 2-3 drops to clean, dry skin. Gently pat into face and neck. Use morning and evening before moisturizer.",
      benefits: ["Deep hydration", "Plumps fine lines", "Improves skin texture", "Non-greasy formula"]
    },
    { 
      id: "2", 
      name: "Daily Moisturizer", 
      price: 180000, 
      imageUrl: cream, 
      category: "Moisturizers", 
      brand: "GlowLab", 
      inStock: true,
      size: "50ml",
      description: "A rich, nourishing daily moisturizer that keeps your skin soft and supple throughout the day. Perfect for all skin types.",
      ingredients: "Shea Butter, Ceramides, Squalane, Vitamin E, Green Tea Extract",
      usage: "Apply to clean face and neck twice daily. Massage gently in upward circular motions until fully absorbed.",
      benefits: ["24-hour moisture", "Strengthens skin barrier", "Reduces dryness", "Lightweight feel"]
    },
    { 
      id: "3", 
      name: "Gentle Cleanser", 
      price: 150000, 
      imageUrl: cleanser, 
      category: "Cleansers", 
      brand: "PureEssence", 
      inStock: true,
      size: "150ml",
      description: "A gentle, pH-balanced cleanser that removes impurities without stripping your skin's natural oils. Suitable for sensitive skin.",
      ingredients: "Glycerin, Chamomile Extract, Aloe Vera, Panthenol, Cucumber Extract",
      usage: "Wet face, pump 2-3 times into hands. Massage onto skin in circular motions. Rinse thoroughly with lukewarm water.",
      benefits: ["Removes makeup", "Soothes skin", "Maintains pH balance", "No harsh sulfates"]
    },
    { 
      id: "4", 
      name: "Night Cream", 
      price: 220000, 
      imageUrl: tube, 
      category: "Treatments", 
      brand: "SkinLite", 
      inStock: false,
      size: "40ml",
      description: "An intensive overnight treatment that repairs and rejuvenates your skin while you sleep. Wake up to radiant, refreshed skin.",
      ingredients: "Retinol, Peptides, Vitamin C, Jojoba Oil, Lavender Extract",
      usage: "Apply to clean face before bed. Gently massage into skin, focusing on areas of concern. Use sunscreen during the day.",
      benefits: ["Anti-aging", "Firms skin", "Reduces dark spots", "Overnight repair"]
    },
    { 
      id: "5", 
      name: "Vitamin C Serum", 
      price: 280000, 
      imageUrl: serum, 
      category: "Serums", 
      brand: "GlowLab", 
      inStock: true,
      size: "30ml",
      description: "A powerful antioxidant serum that brightens and evens skin tone. Formulated with stable vitamin C for maximum effectiveness.",
      ingredients: "Ascorbic Acid, Ferulic Acid, Vitamin E, Hyaluronic Acid, Aloe Vera",
      usage: "Apply 3-4 drops to clean skin in the morning. Follow with sunscreen. May cause slight tingling initially.",
      benefits: ["Brightens complexion", "Fades dark spots", "Boosts collagen", "Protects from free radicals"]
    },
    { 
      id: "6", 
      name: "Eye Cream", 
      price: 190000, 
      imageUrl: cream, 
      category: "Treatments", 
      brand: "PureEssence", 
      inStock: true,
      size: "15ml",
      description: "A gentle yet effective eye cream that targets dark circles, puffiness, and fine lines around the delicate eye area.",
      ingredients: "Caffeine, Peptides, Hyaluronic Acid, Vitamin K, Cucumber Extract",
      usage: "Gently tap a small amount around the orbital bone using your ring finger. Use morning and evening.",
      benefits: ["Reduces puffiness", "Diminishes dark circles", "Hydrates delicate skin", "Smooths fine lines"]
    },
    { 
      id: "7", 
      name: "Face Wash", 
      price: 120000, 
      imageUrl: cleanser, 
      category: "Cleansers", 
      brand: "SkinLite", 
      inStock: true,
      size: "120ml",
      description: "A refreshing daily face wash that cleanses deeply while maintaining your skin's natural moisture balance. Perfect for daily use.",
      ingredients: "Salicylic Acid, Tea Tree Oil, Glycerin, Aloe Vera, Chamomile",
      usage: "Use twice daily. Wet face, apply small amount, massage gently for 30 seconds. Rinse with lukewarm water.",
      benefits: ["Deep cleansing", "Controls oil", "Prevents breakouts", "Refreshing formula"]
    },
    { 
      id: "8", 
      name: "Sunscreen SPF 50", 
      price: 160000, 
      imageUrl: tube, 
      category: "Sunscreen", 
      brand: "GlowLab", 
      inStock: false,
      size: "50ml",
      description: "Broad-spectrum protection against UVA and UVB rays. Lightweight, non-greasy formula that works under makeup.",
      ingredients: "Zinc Oxide, Titanium Dioxide, Vitamin E, Green Tea Extract, Aloe Vera",
      usage: "Apply generously 15 minutes before sun exposure. Reapply every 2 hours or after swimming/sweating.",
      benefits: ["SPF 50 protection", "Water-resistant", "No white cast", "Antioxidant-rich"]
    },
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

  const handleProductClick = (product: Product) => {
    sessionStorage.setItem('productsScrollPosition', window.scrollY.toString());
    setLocation(`/products/${product.id}`);
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
          
          <ProductGrid products={sortedProducts} onAddToCart={handleAddToCart} onProductClick={handleProductClick} />
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
        onLogin={() => {
          setCartOpen(false);
          setLocation("/login");
        }}
      />
    </div>
  );
}
