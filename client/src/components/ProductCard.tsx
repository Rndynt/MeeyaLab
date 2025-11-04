import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  description?: string;
  ingredients?: string;
  usage?: string;
  benefits?: string[];
  size?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const isOutOfStock = product.inStock === false;

  return (
    <div
      className={`border border-slate-200 rounded-lg overflow-hidden bg-white transition-all duration-300 flex flex-col ${
        isOutOfStock ? 'opacity-90' : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'
      }`} 
      data-testid={`card-product-${product.id}`}
      onClick={() => onClick?.(product)}
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
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <div className="flex-grow mb-4">
          {product.brand && (
            <p className="text-[10px] md:text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2" data-testid={`text-brand-${product.id}`}>
              {product.brand}
            </p>
          )}
          <h3 className="text-sm md:text-base font-normal text-slate-900 line-clamp-2 mb-3 leading-relaxed" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className={`text-xs md:text-sm font-medium ${
            isOutOfStock ? 'text-slate-300' : 'text-slate-600'
          }`} data-testid={`text-price-${product.id}`}>
            {formatPrice(product.price)}
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            className={`h-9 w-9 rounded-md transition-all duration-300 ${
              isOutOfStock 
                ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed hover:bg-slate-50 hover:text-slate-300' 
                : 'border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              !isOutOfStock && onAddToCart?.(product);
            }}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
            title={isOutOfStock ? "Out of stock" : "Add to cart"}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
}
