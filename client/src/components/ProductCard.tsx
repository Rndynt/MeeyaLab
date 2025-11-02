import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  return (
    <Card className="border border-slate-200 rounded-lg overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
      <div className="aspect-square overflow-hidden bg-white">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity hover:opacity-90"
          data-testid={`img-product-${product.id}`}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-base font-medium text-slate-900 line-clamp-2 mb-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-slate-900 mb-4" data-testid={`text-price-${product.id}`}>
          {formatPrice(product.price)}
        </p>
        <Button
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          onClick={() => onAddToCart?.(product)}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          Add to cart
        </Button>
      </CardContent>
    </Card>
  );
}
