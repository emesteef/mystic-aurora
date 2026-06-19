import ServiceBox from "./ServiceBox";
import { Brain, Sparkles, Heart, Moon } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Energia osobista",
    description: "Naucz się rozpoznawać, gdzie ucieka Twoja energia – i jak świadomie nią zarządzać.",
    accentColor: "purple" as const,
  },
  {
    icon: Sparkles,
    title: "Granice i emocje",
    description: "Praca z emocjami i granicami, które chronią Twój wewnętrzny spokój.",
    accentColor: "gold" as const,
  },
  {
    icon: Heart,
    title: "Intuicja i samoświadomość",
    description: "Rozwijaj umiejętność słuchania siebie – w relacjach, decyzjach i codziennym życiu.",
    accentColor: "rose" as const,
  },
  {
    icon: Moon,
    title: "Przemiany życiowe",
    description: "Wsparcie w momentach przejścia – gdy kończy się jeden rozdział i zaczyna kolejny.",
    accentColor: "teal" as const,
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Main section background - lighter band for separation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Breathing gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-accent/[0.02] to-primary/[0.03] pointer-events-none animate-breathe" />
      
      {/* Central glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none opacity-60" />
      
      {/* Top and bottom edge lines for separation */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      {/* Floating decorative elements - enhanced */}
      <div className="absolute top-20 left-[10%] w-3 h-3 rounded-full bg-purple-400/40 animate-float shadow-lg shadow-purple-400/20" />
      <div className="absolute top-40 right-[15%] w-2 h-2 rounded-full bg-amber-400/50 animate-float animation-delay-200 shadow-lg shadow-amber-400/30" />
      <div className="absolute bottom-32 left-[20%] w-2 h-2 rounded-full bg-teal-400/40 animate-float animation-delay-400 shadow-lg shadow-teal-400/20" />
      <div className="absolute bottom-20 right-[10%] w-3 h-3 rounded-full bg-rose-400/40 animate-float animation-delay-600 shadow-lg shadow-rose-400/20" />
      
      {/* Additional mystical particles */}
      <div className="absolute top-1/3 left-[5%] w-1 h-1 rounded-full bg-white/30 animate-pulse" />
      <div className="absolute top-2/3 right-[8%] w-1 h-1 rounded-full bg-accent/40 animate-pulse animation-delay-400" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Rozwój osobisty</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-5">
            Czym się zajmuję
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pomagam odzyskać spokój, energię i lepiej rozumieć siebie.
          </p>
          
          {/* Decorative line */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <div className="w-2 h-2 rounded-full bg-accent/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceBox
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              accentColor={service.accentColor}
              delay={`${0.2 + index * 0.15}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
