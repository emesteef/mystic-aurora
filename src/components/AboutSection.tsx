import { Sparkles } from "lucide-react";

// Skrócona wersja opisu marki (sens bez zmian). Pełna wersja z 3 akapitami jest w historii gita.
const paragraphs = [
  "Mystic Aurora powstała z potrzeby spojrzenia na życie trochę inaczej – z większą uważnością na siebie, swoje emocje i intuicję.",
  "Łączymy rozwój osobisty z duchowością. Dzielimy się refleksjami i przygotowujemy materiały, które zachęcają do samodzielnego odkrywania siebie.",
];

const AboutSection = () => {
  return (
    <section id="o-nas" className="py-14 md:py-24 px-6 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-radial from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none opacity-60" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" aria-hidden="true" />

      {/* układ redakcyjny bez karty: nagłówek po lewej, krótki tekst i cytat po prawej */}
      <div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 md:gap-16 items-start">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">O nas</span>
          </div>

          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground leading-tight">
            Poznaj Mystic Aurora
          </h2>

          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent/60" />
            <div className="w-1.5 h-1.5 rotate-45 bg-accent/70" />
          </div>
        </div>

        <div className="max-w-xl md:pt-12">
          <div className="space-y-5 text-[1.0625rem] leading-[1.75] md:text-lg md:leading-relaxed text-foreground/85">
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>

          <blockquote className="mt-8 border-l-2 border-accent/60 pl-5 md:pl-6">
            <p className="text-xl md:text-2xl font-heading italic text-foreground leading-relaxed text-balance">
              Nie chcemy mówić Ci, jak masz żyć ani podawać gotowych odpowiedzi.{" "}
              <span className="text-accent">Chcemy zachęcać Cię do szukania własnych.</span>
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
