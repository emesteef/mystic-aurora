import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { scrollToSection } from "@/lib/scroll";
import { trackFreeMaterialCta } from "@/lib/analytics";
import Newsletter from "@/components/Newsletter";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";
import mysticLogo from "@/assets/mystic-aurora-logo-v2.png";
import { usePageMeta } from "@/hooks/use-page-meta";

const Index = () => {
  const location = useLocation();
  usePageMeta("/");

  // Przewinięcie do sekcji po wejściu z innej podstrony, np. /#kontakt
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => scrollToSection(id));
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
      {/* Hero Section with Background */}
      <section 
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 gradient-hero" />
        
        {/* Ambient glow effects */}
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-accent/40 animate-float" />
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-primary/30 animate-float animation-delay-200" />
        <div className="absolute bottom-40 left-20 w-2 h-2 rounded-full bg-accent/30 animate-float animation-delay-400" />
        <div className="absolute bottom-20 right-10 w-3 h-3 rounded-full bg-primary/30 animate-float animation-delay-600" />
        
        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-28 pb-24 md:pt-32 text-center">
          {/* Logo */}
          <div className="animate-fade-in-up opacity-0">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-accent/30 rounded-full animate-breathe scale-150" />
              <img 
                src={mysticLogo} 
                alt="Mystic Aurora Logo" 
                className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10 rounded-full mystic-aurora-logo"
              />
            </div>
          </div>
          
          {/* Headline */}
          <h1 className="mt-8 max-w-4xl text-4xl md:text-6xl lg:text-7xl font-heading font-light text-foreground tracking-wide leading-tight text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0 animation-delay-200">
            Zatrzymaj się na chwilę. Wróć do siebie.
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-lg md:text-xl text-foreground/80 font-light text-center max-w-2xl leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0 animation-delay-400">
            Odkrywaj siebie, swoje emocje i intuicję. Znajdź przestrzeń na refleksję, spokój i świadome wybory.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 animation-delay-400">
            <Button asChild variant="hero" size="xl" className="px-8">
              <a
                href="/#produkty"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("produkty");
                }}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Odkryj nasze produkty
              </a>
            </Button>
            <Button asChild variant="heroOutline" size="xl" className="px-8">
              <Link to="/7-dni-powrotu-do-siebie" onClick={() => trackFreeMaterialCta("home_hero")}>
                <Gift className="w-5 h-5 mr-2" />
                Odbierz darmowy materiał
              </Link>
            </Button>
          </div>
          
          {/* Motivational quote */}
          <blockquote className="mt-12 text-center max-w-xl animate-fade-in-up opacity-0 animation-delay-600">
            <p className="text-base md:text-lg font-heading italic text-foreground/70 leading-relaxed">
              „Każdy oddech jest krokiem ku wewnętrznej ciszy."
            </p>
          </blockquote>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-foreground/50" />
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <AboutSection />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Products Section */}
      <ProductsSection />

      {/* Newsletter Section */}
      <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
