import { Sparkles } from "lucide-react";

const paragraphs = [
  "Mystic Aurora powstała z potrzeby spojrzenia na życie trochę inaczej. Z większą uważnością na siebie, swoje emocje, intuicję i to, co dzieje się w nas każdego dnia.",
  "Wierzymy, że lepsze poznawanie siebie zaczyna się od prostych rzeczy – zatrzymania się na chwilę, zadania sobie właściwego pytania czy zauważenia własnych reakcji.",
  "Tworzymy przestrzeń, w której łączymy rozwój osobisty z duchowością. Dzielimy się refleksjami, inspiracjami i przygotowujemy materiały, które zachęcają do samodzielnego odkrywania siebie.",
];

const AboutSection = () => {
  return (
    <section id="o-nas" className="py-16 md:py-24 px-6 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-radial from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="absolute top-24 right-[12%] w-2 h-2 rounded-full bg-accent/40 animate-float shadow-lg shadow-accent/20" />
      <div className="absolute bottom-24 left-[10%] w-2 h-2 rounded-full bg-purple-400/40 animate-float animation-delay-400 shadow-lg shadow-purple-400/20" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">O nas</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground">
            Poznaj Mystic Aurora
          </h2>

          <div className="mt-6 md:mt-8 flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <div className="w-2 h-2 rounded-full bg-accent/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </div>

        <div className="relative px-5 py-8 sm:p-8 md:p-12 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-accent/60 to-transparent" />

          <div className="relative max-w-[36rem] mx-auto space-y-5 md:space-y-6 text-[1.0625rem] leading-[1.75] md:text-lg md:leading-relaxed text-foreground/85">
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>

          <p className="relative max-w-[36rem] mx-auto mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/10 text-center text-xl md:text-2xl font-heading italic text-foreground leading-relaxed text-balance">
            Nie chcemy mówić Ci, jak masz żyć ani podawać gotowych odpowiedzi.{" "}
            <span className="text-accent">Chcemy zachęcać Cię do szukania własnych.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
