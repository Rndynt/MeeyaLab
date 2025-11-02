import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import heroImage from "@assets/generated_images/Hero_skincare_product_arrangement_07dd6bc4.png";
import serum from "@assets/generated_images/White_serum_bottle_product_aa8e546e.png";
import cream from "@assets/generated_images/White_cream_jar_product_ad76191c.png";
import cleanser from "@assets/generated_images/White_pump_bottle_cleanser_5f9a5b07.png";

interface HeroHeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onShopClick?: () => void;
}

const slides = [
  {
    id: 1,
    title: "Stay Glowing",
    subtitle: "With Naturally Fresh Skin",
    description: "Clean, effective skincare for your daily routine. Simple formulas, real results.",
    cta: "Shop Now",
    image: heroImage,
    bgColor: "bg-[#F5F1ED]",
  },
  {
    id: 2,
    title: "Reveal Your",
    subtitle: "Best Glow",
    description: "Discover visible results with our premium skincare collection designed to delight.",
    cta: "Explore Collection",
    image: serum,
    bgColor: "bg-[#F9E4D4]",
  },
  {
    id: 3,
    title: "Pure Skincare",
    subtitle: "Daily Rituals",
    description: "Transform your skin with pure, gentle daily care made from natural ingredients.",
    cta: "Learn More",
    image: cream,
    bgColor: "bg-[#EDE8E3]",
  },
  {
    id: 4,
    title: "Healthy Skin",
    subtitle: "Starts with Natural Care",
    description: "Experience the difference of scientifically-backed, naturally-derived formulas.",
    cta: "Shop Products",
    image: cleanser,
    bgColor: "bg-[#F8F4F0]",
  },
];

export default function HeroHeader({
  cartItemCount = 0,
  onCartClick,
  onShopClick,
}: HeroHeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/check-order", label: "Check Order" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const currentSlide = slides[selectedIndex];

  return (
    <div className={`relative w-full transition-colors duration-700 ${currentSlide.bgColor}`} data-testid="hero-header-section">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="relative z-50 w-full" data-testid="header-main">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" data-testid="link-home">
              <span className="text-xl md:text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer">
                MeeyaLab.
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase().replace(" ", "-")}`}>
                  <span
                    className={`text-sm font-medium transition-colors cursor-pointer ${
                      isActive(link.href)
                        ? "text-slate-900 font-semibold"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-slate-900/5"
                onClick={onCartClick}
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5 text-slate-900" />
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full flex items-center justify-center px-1.5 bg-slate-900 text-white text-xs font-semibold"
                    data-testid="badge-cart-count"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="hover:bg-slate-900/5" data-testid="button-menu-toggle">
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <span
                          className={`block text-base font-medium py-2 cursor-pointer ${
                            isActive(link.href)
                              ? "text-slate-900 font-semibold"
                              : "text-slate-700 hover:text-slate-900"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <section className="relative py-12 md:py-16 lg:py-20" data-testid="section-hero">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide) => (
                <div key={slide.id} className="flex-[0_0_100%] min-w-0">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                    <div className="space-y-6 md:space-y-8">
                      <div className="space-y-3 md:space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
                          {slide.title}
                        </h1>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
                          {slide.subtitle}
                        </h2>
                      </div>
                      <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex flex-wrap gap-4 items-center">
                        <Button
                          size="lg"
                          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-base rounded-full group transition-all duration-300"
                          onClick={onShopClick}
                          data-testid="button-shop-now"
                        >
                          {slide.cta}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                          <button
                            onClick={scrollPrev}
                            className="p-2 rounded-full border-2 border-slate-900/10 hover:border-slate-900/30 hover:bg-slate-900/5 transition-all"
                            aria-label="Previous slide"
                            data-testid="button-prev-slide"
                          >
                            <ChevronLeft className="h-5 w-5 text-slate-900" />
                          </button>
                          <button
                            onClick={scrollNext}
                            className="p-2 rounded-full border-2 border-slate-900/10 hover:border-slate-900/30 hover:bg-slate-900/5 transition-all"
                            aria-label="Next slide"
                            data-testid="button-next-slide"
                          >
                            <ChevronRight className="h-5 w-5 text-slate-900" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <span className="text-2xl font-bold text-slate-900">
                          {String(selectedIndex + 1).padStart(2, "0")}
                        </span>
                        <div className="h-px flex-1 max-w-[80px] bg-slate-900/20"></div>
                        <span className="text-sm text-slate-500">
                          {String(slides.length).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="relative order-first md:order-last">
                      <div className="relative aspect-square md:aspect-auto md:h-[500px] lg:h-[600px]">
                        <img
                          src={slide.image}
                          alt={`${slide.title} - Skincare products`}
                          className="w-full h-full object-contain drop-shadow-2xl"
                          data-testid={`img-hero-slide-${slide.id}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8 md:mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "w-8 bg-slate-900"
                    : "w-2 bg-slate-900/20 hover:bg-slate-900/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`button-slide-indicator-${index}`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
