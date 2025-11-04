import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Plus, Check, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import type { Product } from "@/components/ProductCard";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";
import cleanser from "@assets/generated_images/White_pump_bottle_cleanser_5f9a5b07.png";
import tube from "@assets/generated_images/White_skincare_tube_product_f0b2ba56.png";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.id]);

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

  const product = allProducts.find(p => p.id === params?.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => setLocation("/products")} data-testid="button-back-to-products">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const isOutOfStock = product.inStock === false;

  const handleAddToCart = () => {
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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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

  const handleBack = () => {
    const scrollPos = sessionStorage.getItem('productsScrollPosition');
    setLocation("/products");
    if (scrollPos) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPos));
      }, 100);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log("Toggle favorite:", product.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartItemCount={cartItemCount} onCartClick={() => setCartOpen(true)} />
      
      <main className="flex-1 pt-16 md:pt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Products</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-detail"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                  <span className="bg-white/95 text-slate-900 px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wide">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              {product.brand && (
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2" data-testid="text-brand">
                  {product.brand}
                </p>
              )}
              
              <h1 className="text-2xl md:text-3xl font-light text-slate-900 mb-4" data-testid="text-product-name">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-2xl font-medium text-slate-900" data-testid="text-price">
                  {formatPrice(product.price)}
                </p>
                {product.size && (
                  <p className="text-sm text-slate-500" data-testid="text-size">
                    {product.size}
                  </p>
                )}
              </div>

              {product.description && (
                <div className="mb-8">
                  <p className="text-slate-600 leading-relaxed" data-testid="text-description">
                    {product.description}
                  </p>
                </div>
              )}

              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    Key Benefits
                  </h2>
                  <ul className="space-y-2" data-testid="list-benefits">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 font-medium transition-all duration-300 ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : addedToCart
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                  data-testid="button-add-to-cart"
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" strokeWidth={2.5} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleToggleFavorite}
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 rounded-md transition-all duration-300 ${
                    isFavorite
                      ? 'border-red-500 bg-red-50 hover:bg-red-100'
                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  data-testid="button-favorite"
                >
                  <Heart 
                    className={`h-5 w-5 transition-all duration-300 ${
                      isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-600'
                    }`}
                  />
                </Button>
              </div>

              {product.ingredients && (
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    Ingredients
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed" data-testid="text-ingredients">
                    {product.ingredients}
                  </p>
                </div>
              )}

              {product.usage && (
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    How to Use
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed" data-testid="text-usage">
                    {product.usage}
                  </p>
                </div>
              )}
            </div>
          </div>
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
        onLogin={() => {
          setCartOpen(false);
          setLocation("/login");
        }}
      />
    </div>
  );
}
