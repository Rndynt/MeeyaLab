import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const isOutOfStock = product.inStock === false;

  return (
    <div
      className={`border border-slate-200 rounded-lg overflow-hidden bg-white transition-all duration-300 flex flex-col ${
        isOutOfStock ? 'opacity-90' : 'hover:shadow-lg hover:-translate-y-1'
      }`} 
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity ${
            isOutOfStock ? 'opacity-40' : 'hover:opacity-90'
          }`}
          data-testid={`img-product-${product.id}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
            <span className="bg-white/95 text-slate-900 px-4 py-2 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex-grow space-y-1 md:space-y-2 mb-3 md:mb-4">
          {product.brand && (
            <p className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider" data-testid={`text-brand-${product.id}`}>
              {product.brand}
            </p>
          )}
          <h3 className="text-sm md:text-base font-medium text-slate-900 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className={`text-base md:text-lg font-semibold ${
            isOutOfStock ? 'text-slate-400' : 'text-slate-900'
          }`} data-testid={`text-price-${product.id}`}>
            {formatPrice(product.price)}
          </p>
        </div>
        <Button
          variant="outline"
          className={`w-full transition-all duration-300 ${
            isOutOfStock 
              ? 'border-slate-300 text-slate-400 bg-slate-50 cursor-not-allowed hover:bg-slate-50 hover:text-slate-400' 
              : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
          }`}
          onClick={() => !isOutOfStock && onAddToCart?.(product)}
          disabled={isOutOfStock}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
}
