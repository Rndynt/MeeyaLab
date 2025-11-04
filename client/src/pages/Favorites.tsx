import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import ShoppingBagMinimal from "@/components/icons/ShoppingBagMinimal";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

export default function Favorites() {
  const [location, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  
  const cartItems: CartItem[] = [];
  const cartItemCount = 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  const favoriteProducts: FavoriteProduct[] = [
    {
      id: "1",
      name: "Hydrating Face Serum",
      price: 250000,
      imageUrl: serum,
      inStock: true,
    },
    {
      id: "2",
      name: "Nourishing Night Cream",
      price: 320000,
      imageUrl: cream,
      inStock: true,
    },
  ];

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const handleRemoveFavorite = (id: string) => {
    console.log("Remove from favorites:", id);
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    console.log("Add to cart:", product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header cartItemCount={cartItemCount} onCartClick={() => setCartOpen(true)} onProfileClick={() => setLocation("/profile")} />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-24 md:pt-28">
          <button
            onClick={() => setLocation("/profile")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
            data-testid="button-back-to-profile"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Profile</span>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2" data-testid="text-page-title">
              My Favorites
            </h1>
            <p className="text-slate-600">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Heart className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No favorites yet</h2>
              <p className="text-slate-600 mb-6">
                Start adding products you love to your favorites
              </p>
              <Button
                onClick={() => setLocation("/products")}
                className="bg-slate-900 hover:bg-slate-800 text-white"
                data-testid="button-browse-products"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-slate-200/60 overflow-hidden group hover:shadow-md transition-shadow duration-300"
                  data-testid={`card-favorite-${product.id}`}
                >
                  <div
                    className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer"
                    onClick={() => setLocation(`/products/${product.id}`)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(product.id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                      data-testid={`button-remove-favorite-${product.id}`}
                      aria-label="Remove from favorites"
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h3
                        className="font-semibold text-slate-900 mb-1 cursor-pointer hover:text-slate-700 transition-colors"
                        onClick={() => setLocation(`/products/${product.id}`)}
                        data-testid={`text-product-name-${product.id}`}
                      >
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-slate-900" data-testid={`text-price-${product.id}`}>
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10"
                      data-testid={`button-add-to-cart-${product.id}`}
                    >
                      <ShoppingBagMinimal className="mr-2" size={16} />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
