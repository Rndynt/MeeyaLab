import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import ShoppingBagMinimal from "@/components/icons/ShoppingBagMinimal";
import UserMinimal from "@/components/icons/UserMinimal";
import heroImage1 from "@assets/generated_images/Woman_applying_skincare_cream_ccee0fd7.png";
import heroImage2 from "@assets/generated_images/Woman_holding_serum_bottle_b4288e5a.png";
import heroImage3 from "@assets/generated_images/Woman_relaxing_spa_treatment_c40739d2.png";
import heroImage4 from "@assets/generated_images/Model_touching_face_skincare_fa43c996.png";

interface HeroHeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onShopClick?: () => void;
}

const slides = [
  {
    id: 1,
    title: "Radiant Skin",
    subtitle: "Starts with Clean Beauty",
    description: "Experience the power of natural ingredients combined with science. Our formulas are designed to nourish, protect, and reveal your skin's natural glow.",
    cta: "Discover Now",
    image: heroImage1,
    bgColor: "bg-[#F5F1ED]",
  },
  {
    id: 2,
    title: "Luxury Skincare",
    subtitle: "For Every Day",
    description: "Premium ingredients at accessible prices. Transform your daily routine with products that deliver visible results you can feel and see.",
    cta: "Shop Collection",
    image: heroImage2,
    bgColor: "bg-[#F9E4D4]",
  },
  {
    id: 3,
    title: "Gentle Care",
    subtitle: "Powerful Results",
    description: "Pure, effective formulas for all skin types. From cleansing to moisturizing, every product is crafted with care for your skin's health.",
    cta: "Explore Products",
    image: heroImage3,
    bgColor: "bg-[#EDE8E3]",
  },
  {
    id: 4,
    title: "Your Beauty",
    subtitle: "Naturally Enhanced",
    description: "Scientifically proven, naturally inspired. Our skincare line brings out the best in your skin without harsh chemicals or artificial additives.",
    cta: "Shop Now",
    image: heroImage4,
    bgColor: "bg-[#F8F4F0]",
  },
];

export default function HeroHeader({
  cartItemCount = 0,
  onCartClick,
  onProfileClick,
  onShopClick,
}: HeroHeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 20 },
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentSlide = slides[selectedIndex];

  return (
    <div className="relative w-full" data-testid="hero-header-section">
      {/* Header */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-md' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <header className="relative w-full" data-testid="header-main">
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
              <button
                className="p-2 hover:bg-slate-900/5 rounded-lg transition-colors"
                onClick={onProfileClick}
                data-testid="button-profile"
              >
                <UserMinimal className="text-slate-900" size={20} />
              </button>

              <button
                className="relative p-2 hover:bg-slate-900/5 rounded-lg transition-colors"
                onClick={onCartClick}
                data-testid="button-cart"
              >
                <ShoppingBagMinimal className="text-slate-900" size={20} />
                {cartItemCount > 0 && (
                  <span
                    className="absolute top-0 right-0 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-semibold leading-none"
                    data-testid="badge-cart-count"
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>

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
        </div>
      </div>

      {/* Full-width Hero Section with background */}
      <section className={`relative w-full transition-colors duration-700 ${currentSlide.bgColor}`} data-testid="section-hero">
        <div className="relative pt-20 md:pt-24 pb-8 md:pb-12 lg:pb-16 overflow-hidden">
          <div className="w-full">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex transition-opacity">
                {slides.map((slide) => (
                  <div key={slide.id} className="flex-[0_0_100%] min-w-0">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                      <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center min-h-[500px] md:min-h-[600px]">
                        <div className="space-y-6 md:space-y-8 py-8 md:py-12">
                          <div className="inline-block">
                            <span className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-widest">
                              Premium Skincare
                            </span>
                          </div>
                          
                          <div className="space-y-3 md:space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                              {slide.title}
                            </h1>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                              {slide.subtitle}
                            </h2>
                          </div>
                          
                          <p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed">
                            {slide.description}
                          </p>
                          
                          <div className="pt-2">
                            <Button
                              size="lg"
                              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 md:px-10 md:py-7 text-base md:text-lg rounded-full group transition-all duration-300 shadow-lg hover:shadow-xl"
                              onClick={onShopClick}
                              data-testid="button-shop-now"
                            >
                              {slide.cta}
                              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>

                        <div className="relative order-first md:order-last">
                          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                            <img
                              src={slide.image}
                              alt={`${slide.title} - Skincare`}
                              className="w-full h-full object-cover"
                              data-testid={`img-hero-slide-${slide.id}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Fixed Position */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center">
                  <button
                    onClick={scrollPrev}
                    className="pointer-events-auto p-3 md:p-4 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-300 group"
                    aria-label="Previous slide"
                    data-testid="button-prev-slide"
                  >
                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="pointer-events-auto p-3 md:p-4 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-300 group"
                    aria-label="Next slide"
                    data-testid="button-next-slide"
                  >
                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
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
          </div>
        </div>
      </section>
    </div>
  );
}
