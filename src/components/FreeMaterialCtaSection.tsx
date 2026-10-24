import { Link } from "react-router-dom";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackFreeMaterialCta } from "@/lib/analytics";

// Sekcja na stronie głównej prowadząca do landingu darmowego materiału.
// Zastąpiła formularz newslettera (komponent Newsletter.tsx i funkcja Netlify zostają na później).
const FreeMaterialCtaSection = () => {
  return (
    <section id="darmowy-material" className="py-16 md:py-20 px-6 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-accent/[0.05] to-primary/[0.08] pointer-events-none" />
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-10 left-[15%] w-2 h-2 rounded-full bg-accent/50 animate-float shadow-lg shadow-accent/30" />
      <div className="absolute top-16 right-[20%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-float animation-delay-400" />
      <div className="absolute bottom-12 left-[25%] w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse" />
      <div className="absolute bottom-8 right-[15%] w-2 h-2 rounded-full bg-primary/30 animate-float animation-delay-200" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="relative px-6 py-10 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden text-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/10 via-transparent to-primary/10 pointer-events-none" />
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-accent/60 to-transparent" />
          <div className="absolute right-0 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-primary/40 to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/15 border border-accent/30 mb-6 shadow-lg shadow-accent/10">
              <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
              <span className="text-sm text-foreground/90 font-medium">Bezpłatny materiał</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-heading font-light text-foreground mb-5 text-balance">
              Zacznij od jednego dnia <span className="text-accent">dla siebie</span>
            </h2>

            <p className="text-muted-foreground text-base md:text-lg mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed">
              Pobierz bezpłatnie pierwszy dzień programu „7 dni, żeby wrócić do siebie” i znajdź chwilę, żeby przyjrzeć się
              własnym potrzebom.
            </p>

            <Button
              asChild
              size="xl"
              className="w-full sm:w-auto px-8 rounded-xl bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground font-medium shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link to="/7-dni-powrotu-do-siebie" onClick={() => trackFreeMaterialCta("home_cta_section")}>
                <Gift className="w-5 h-5 mr-2" aria-hidden="true" />
                Odbierz pierwszy dzień
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeMaterialCtaSection;
