import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Hero_skincare_product_arrangement_07dd6bc4.png";

interface HeroProps {
  onShopClick?: () => void;
  onCheckOrderClick?: () => void;
}

export default function Hero({ onShopClick, onCheckOrderClick }: HeroProps) {
  return (
    <section className="w-full bg-white py-16 md:py-24" data-testid="section-hero">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
              Daily skincare, delivered.
            </h1>
            <p className="text-lg text-slate-600 max-w-xl">
              Clean, effective skincare for your daily routine. Simple formulas, real results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-base"
                onClick={onShopClick}
                data-testid="button-shop-products"
              >
                Shop products
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base"
                onClick={onCheckOrderClick}
                data-testid="button-check-order"
              >
                Check your order
              </Button>
            </div>
          </div>
          <div className="order-first md:order-last">
            <img
              src={heroImage}
              alt="Skincare products"
              className="w-full h-auto rounded-lg"
              data-testid="img-hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
