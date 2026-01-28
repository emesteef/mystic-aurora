import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          group: "FREE_MEDITATION"
        })
      });

      if (!res.ok) throw new Error("Błąd zapisu");

      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Coś poszło nie tak 😕");
    }
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Strong background separation */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-accent/[0.05] to-primary/[0.08] pointer-events-none" />
      
      {/* Top and bottom glowing lines */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Floating particles */}
      <div className="absolute top-10 left-[15%] w-2 h-2 rounded-full bg-accent/50 animate-float shadow-lg shadow-accent/30" />
      <div className="absolute top-16 right-[20%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-float animation-delay-400" />
      <div className="absolute bottom-12 left-[25%] w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse" />
      <div className="absolute bottom-8 right-[15%] w-2 h-2 rounded-full bg-primary/30 animate-float animation-delay-200" />
      
      {/* Main card with glassmorphism */}
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden">
          
          {/* Inner glassmorphism glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/10 via-transparent to-primary/10 pointer-events-none" />
          
          {/* Vertical accent lines */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-accent/60 to-transparent" />
          <div className="absolute right-0 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
          
          {/* Corner symbols */}
          <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-accent/70 shadow-lg shadow-accent/50 animate-pulse" />
            <div className="absolute w-5 h-5 rounded-full border border-accent/30" />
          </div>
          <div className="absolute bottom-4 left-4 w-6 h-6 flex items-center justify-center opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="absolute w-4 h-4 rounded-full border border-primary/30" />
          </div>
          
          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/15 border border-accent/30 mb-6 shadow-lg shadow-accent/10">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-sm text-foreground/90 font-medium">Dołącz do duchowej społeczności</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-heading font-light text-foreground mb-5">
              Zapisz się do <span className="text-accent">Newslettera</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Otrzymuj cotygodniowe inspiracje, medytacje i wskazówki do duchowego rozwoju prosto na swoją skrzynkę.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1 group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
                <Input
                  type="email"
                  placeholder="Twój adres email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 bg-white/[0.05] border-white/20 focus:border-accent focus:bg-white/[0.08] h-14 text-base rounded-xl shadow-inner shadow-black/20 transition-all duration-300"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-14 px-8 bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground font-medium rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {isSubmitted ? "Dziękujemy! ✨" : "Zapisz się"}
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground/70 mt-6">
              ✨ Szanujemy Twoją prywatność. Możesz wypisać się w każdej chwili.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
