import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag } from "lucide-react";
import Newsletter from "@/components/Newsletter";
import ServicesSection from "@/components/ServicesSection";
import heroBg from "@/assets/hero-bg.jpg";
import mysticLogo from "@/assets/mystic-aurora-logo-v2.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
        <main className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center">
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
          
          {/* Brand name */}
          <h1 className="mt-8 text-4xl md:text-6xl lg:text-7xl font-heading font-light text-foreground tracking-wide animate-fade-in-up opacity-0 animation-delay-200">
            Mystic Aurora
          </h1>
          
          {/* Tagline */}
          <p className="mt-6 text-lg md:text-xl text-muted-foreground font-light text-center max-w-lg animate-fade-in-up opacity-0 animation-delay-400">
            Znajdź wewnętrzny spokój, harmonię i transformację
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 animation-delay-400">
            <Button variant="hero" size="xl">
              <BookOpen className="w-5 h-5 mr-2" />
              Blog Duchowy
            </Button>
            <Button variant="heroOutline" size="xl">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Sklep Energetyczny
            </Button>
          </div>
          
          {/* Motivational quote */}
          <blockquote className="mt-12 text-center max-w-xl animate-fade-in-up opacity-0 animation-delay-600">
            <p className="text-base md:text-lg font-heading italic text-foreground/70 leading-relaxed">
              „Każdy oddech jest krokiem ku wewnętrznej ciszy."
            </p>
          </blockquote>
        </main>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-foreground/50" />
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Newsletter Section */}
      <Newsletter />
      
      {/* Footer spacer */}
      <div className="h-20 bg-gradient-to-t from-card/30 to-transparent" />
    </div>
  );
};

export default Index;
