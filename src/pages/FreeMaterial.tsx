import { useEffect, useRef } from "react";
import { ArrowRight, Clock, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FreeMaterialForm from "@/components/FreeMaterialForm";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollToSection } from "@/lib/scroll";
import { trackFreeMaterialCta, trackProductClick, trackShopClick } from "@/lib/analytics";
import { PRODUCTS } from "@/config/products";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";
import programCover from "@/assets/products/7-dni-powrotu-do-siebie.webp";

const situations = [
  "Masz czas dla wszystkich, tylko nie dla siebie.",
  "Dzień mija, a Ty nawet nie wiesz, kiedy.",
  "Odkładasz własne potrzeby na później.",
];

// Podgląd prawdziwych stron PDF: wystarczy wrzucić pliki .webp do src/assets/pdf-podglad/
// (np. dzien-1-strona-1.webp). Gdy folder jest pusty, pokazujemy neutralne placeholdery.
const pdfPages = Object.entries(
  import.meta.glob<string>("@/assets/pdf-podglad/*.webp", { eager: true, import: "default" }),
)
  .sort(([a], [b]) => a.localeCompare(b, "pl", { numeric: true }))
  .map(([path, src], index) => ({ src, alt: `Podgląd strony ${index + 1} materiału`, key: path }));

const PLACEHOLDER_PAGES = 2;

// Pełny program – dane z src/config/products.ts (cena, status, productUrl). Przycisk zakupu pokaże się dopiero,
// gdy produkt będzie miał status "available" i prawdziwy productUrl.
const fullProgram = PRODUCTS.find((product) => product.id === "7-dni-powrotu-do-siebie")!;
const programAvailable = fullProgram.status === "available" && !!fullProgram.productUrl;
const formatPrice = (price?: number) => (price !== undefined ? price.toLocaleString("pl-PL") + " zł" : "");

// Paleta landingu (tylko na tej stronie): śliwka, przygaszony fiolet, ciepły grafit + jasna sekcja w beżu/lawendzie.
// Kolejne sekcje zaczynają się kolorem, na którym kończy się poprzednia – przejścia są płynne.
const PLUM = "#221427";
const VIOLET = "#2a2038";
const GRAPHITE = "#1f1a20";
const DEEP_VIOLET = "#1b1428";
const BG = "#130f1a"; // = --background (stopka)

// Drobny złoty akcent przed nagłówkami sekcji
const Ornament = ({ className, onLight = false }: { className?: string; onLight?: boolean }) => (
  <div className={cn("flex items-center gap-2", className)} aria-hidden="true">
    <span className={cn("w-10 h-px bg-gradient-to-r from-transparent", onLight ? "to-[#9a7420]" : "to-accent/70")} />
    <span className={cn("w-1.5 h-1.5 rotate-45", onLight ? "bg-[#9a7420]" : "bg-accent/80")} />
  </div>
);

const ProgramCover = ({ className, priority = false }: { className?: string; priority?: boolean }) => (
  <div className={`relative ${className ?? ""}`}>
    <div className="absolute -inset-6 rounded-full bg-accent/20 blur-3xl pointer-events-none" aria-hidden="true" />
    <img
      src={programCover}
      alt="Okładka programu „7 dni powrotu do siebie”"
      width={900}
      height={1200}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="relative w-full h-auto aspect-[3/4] rounded-xl border border-accent/30 shadow-2xl shadow-black/50"
    />
  </div>
);

const FormCta = ({ onClick, location }: { onClick: () => void; location: "landing_hero" | "landing_preview" }) => (
  <Button
    asChild
    size="xl"
    className="w-full sm:w-auto px-8 whitespace-normal h-auto min-h-14 py-3 rounded-xl bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground font-medium shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] motion-reduce:hover:scale-100"
  >
    <a
      href="#formularz"
      onClick={(e) => {
        e.preventDefault();
        trackFreeMaterialCta(location);
        onClick();
      }}
    >
      Odbierz pierwszy dzień za darmo
    </a>
  </Button>
);

const FreeMaterial = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  usePageMeta("/7-dni-powrotu-do-siebie");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goToForm = () => {
    scrollToSection("formularz");
    // fokus po zakończeniu przewijania, żeby użytkownik klawiatury od razu trafił do pola e-mail
    window.setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* SEKCJA 1 – HERO */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 gradient-glow pointer-events-none" />
          {/* mocniejsze przyciemnienie pod tekstem: na desktopie z lewej, na telefonie pod całą treścią */}
          <div className="absolute inset-0 bg-background/35 lg:bg-transparent lg:bg-gradient-to-r lg:from-background/80 lg:via-background/40 lg:to-transparent pointer-events-none" />
          {/* płynne przejście w kolejną sekcję */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 md:h-40 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${PLUM})` }}
          />
          <div className="absolute top-28 left-[8%] w-2 h-2 rounded-full bg-accent/40 animate-float" />
          <div className="absolute bottom-24 right-[10%] w-3 h-3 rounded-full bg-primary/30 animate-float animation-delay-400" />

          {/* telefon: tekst → okładka → CTA; desktop: tekst + CTA po lewej, okładka po prawej */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-36 md:pb-28 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center gap-10 lg:gap-16">
            <div className="text-center lg:text-left">
              <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/30 text-xs md:text-sm tracking-[0.2em] text-foreground font-medium animate-fade-in-up opacity-0">
                <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
                BEZPŁATNY MATERIAŁ
              </p>

              <h1
                id="hero-heading"
                className="mt-6 text-4xl md:text-6xl xl:text-7xl font-heading font-light text-foreground leading-tight text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0 animation-delay-200"
              >
                7 dni powrotu do siebie
              </h1>

              <p className="mt-4 text-xl md:text-2xl font-heading text-accent drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0 animation-delay-200">
                Zacznij od jednego dnia. Tylko dla siebie.
              </p>

              <p className="mt-6 md:mt-8 max-w-xl mx-auto lg:mx-0 text-lg md:text-xl font-heading italic text-foreground leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0 animation-delay-400">
                Przez cały dzień masz coś do zrobienia. Praca, dom, obowiązki, potrzeby innych. A kiedy przychodzi
                chwila spokoju, trudno Ci nawet powiedzieć, czego sama potrzebujesz?
              </p>

              <p className="mt-4 text-base md:text-lg text-foreground/90 font-light leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] animate-fade-in-up opacity-0 animation-delay-400">
                Przygotowaliśmy pierwszy dzień programu, który pomoże Ci zatrzymać się i przyjrzeć temu, co na co dzień
                odkładasz na później.
              </p>

              <div className="hidden lg:block mt-10 animate-fade-in-up opacity-0 animation-delay-600">
                <FormCta onClick={goToForm} location="landing_hero" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 lg:gap-10 animate-fade-in-up opacity-0 animation-delay-400">
              <ProgramCover className="w-40 sm:w-48 lg:w-[300px] xl:w-[340px] lg:rotate-[2deg]" priority />
              <div className="w-full sm:w-auto lg:hidden">
                <FormCta onClick={goToForm} location="landing_hero" />
              </div>
            </div>
          </div>
        </section>

        {/* SEKCJA 2 – BRZMI ZNAJOMO? (śliwka → przygaszony fiolet, układ redakcyjny) */}
        <section
          aria-labelledby="familiar-heading"
          className="relative overflow-hidden px-6 pt-6 pb-14 md:pt-10 md:pb-24"
          style={{ background: `linear-gradient(to bottom, ${PLUM}, ${VIOLET})` }}
        >
          <div className="absolute -left-40 top-1/3 w-[480px] h-[480px] rounded-full bg-primary/15 blur-3xl pointer-events-none" aria-hidden="true" />
          <svg
            className="hidden md:block absolute -right-24 -bottom-32 w-[420px] h-[420px] text-accent/15 pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 4" />
          </svg>

          <div className="relative max-w-5xl mx-auto grid md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] gap-8 md:gap-16">
            <div className="md:pt-2">
              <Ornament />
              <h2 id="familiar-heading" className="mt-4 text-4xl md:text-6xl font-heading font-light text-foreground leading-tight">
                Brzmi znajomo?
              </h2>
            </div>

            <div>
              <ul className="space-y-6 md:space-y-8">
                {situations.map((text) => (
                  <li key={text} className="relative pl-6 md:pl-8">
                    <span className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-accent/80 to-accent/10" aria-hidden="true" />
                    <p className="text-2xl md:text-3xl font-heading italic text-foreground leading-snug">{text}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-10 md:mt-12 pt-8 border-t border-white/10 max-w-xl text-lg md:text-xl text-foreground/90 leading-relaxed">
                Nie musisz zmieniać wszystkiego od razu.{" "}
                <span className="text-accent">Zacznij od chwili, w której naprawdę skupisz się na sobie.</span>
              </p>
            </div>
          </div>
        </section>

        {/* SEKCJA 3 – ZAJRZYJ DO ŚRODKA (jasny panel z podglądem stron PDF) */}
        <section
          aria-labelledby="inside-heading"
          className="relative px-3 sm:px-6 pb-12 md:pb-20"
          style={{ background: `linear-gradient(to bottom, ${VIOLET}, ${GRAPHITE})` }}
        >
          <div className="relative max-w-6xl mx-auto rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#fbf6ee] via-[#f4ece2] to-[#ece4f3] shadow-2xl shadow-black/40">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#e7d6f5] blur-3xl opacity-70 pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#f3dfb9] blur-3xl opacity-60 pointer-events-none" aria-hidden="true" />

            <div className="relative grid md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-8 md:gap-12 px-6 py-10 sm:px-10 md:px-14 md:py-16 items-center">
              <div>
                <Ornament onLight />
                <h2 id="inside-heading" className="mt-4 text-3xl md:text-5xl font-heading font-light text-[#2a1b3a] leading-tight">
                  Zajrzyj do środka
                </h2>
              </div>

              <div>
                <div className="flex justify-center gap-4 sm:gap-6 md:gap-8">
                  {pdfPages.length > 0
                    ? pdfPages.map((page, index) => (
                        <img
                          key={page.key}
                          src={page.src}
                          alt={page.alt}
                          width={1000}
                          height={1414}
                          loading="lazy"
                          decoding="async"
                          className={cn(
                            "w-[46%] max-w-[260px] h-auto aspect-[1/1.414] object-cover rounded-md bg-white shadow-xl shadow-[#2a1b3a]/20 border border-[#e6dccd]",
                            index % 2 ? "md:rotate-[1.5deg] md:translate-y-4" : "md:-rotate-[1.5deg]",
                          )}
                        />
                      ))
                    : Array.from({ length: PLACEHOLDER_PAGES }, (_, index) => (
                        <div
                          key={index}
                          className={cn(
                            "w-[46%] max-w-[260px] aspect-[1/1.414] rounded-md bg-[#fffdf9] shadow-xl shadow-[#2a1b3a]/15 border border-dashed border-[#cdbfa9] flex flex-col items-center justify-center gap-3 p-4 text-center",
                            index % 2 ? "md:rotate-[1.5deg] md:translate-y-4" : "md:-rotate-[1.5deg]",
                          )}
                        >
                          <FileText className="w-8 h-8 text-[#8a6418]" aria-hidden="true" />
                          <span className="text-sm text-[#5a4a66]">Podgląd materiału</span>
                        </div>
                      ))}
                </div>

                <p className="mt-8 md:mt-12 max-w-xl mx-auto text-center text-base md:text-lg text-[#3d2f4a] leading-relaxed">
                  Krótki materiał, pytania do refleksji i miejsce na Twoje odpowiedzi. Możesz wrócić do niego wtedy, kiedy
                  znajdziesz chwilę dla siebie.
                </p>

                <div className="mt-8 flex justify-center">
                  <FormCta onClick={goToForm} location="landing_preview" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEKCJA 4 – FORMULARZ (najważniejszy punkt strony: jasna, wyraźna karta, bez ozdobników) */}
        <section
          id="formularz"
          aria-labelledby="form-heading"
          className="relative overflow-hidden px-4 sm:px-6 py-12 md:py-20 scroll-mt-20"
          style={{ background: `linear-gradient(to bottom, ${GRAPHITE}, ${DEEP_VIOLET})` }}
        >
          <div className="absolute left-1/2 lg:left-auto lg:right-[8%] top-1/2 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 w-[620px] h-[560px] bg-gradient-radial from-accent/20 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-8 lg:gap-16 items-center">
            <div className="px-2 sm:px-0 text-center lg:text-left">
              <h2 id="form-heading" className="text-3xl md:text-5xl lg:text-6xl font-heading font-light text-foreground leading-tight text-balance">
                Zacznij od jednego dnia
              </h2>
              <p className="mt-4 text-lg md:text-xl text-foreground/90 leading-relaxed max-w-md mx-auto lg:mx-0 text-balance">
                Podaj swój adres e-mail, a wyślemy Ci bezpłatnie pierwszy dzień programu „7 dni powrotu do siebie”.
              </p>
            </div>

            <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:justify-self-end px-5 py-7 sm:p-8 md:p-10 rounded-3xl bg-[#2a2134]/95 border border-white/20 ring-1 ring-accent/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),0_0_60px_-10px_hsl(42_85%_55%/0.25)]">
              <FreeMaterialForm ref={emailRef} />
            </div>
          </div>
        </section>

        {/* SEKCJA 5 – PEŁNY PROGRAM (duża okładka + fakty o programie; zakup dopiero przy aktywnej ofercie) */}
        <section
          aria-labelledby="full-heading"
          className="relative overflow-hidden px-6 py-12 md:py-20"
          style={{ background: `linear-gradient(to bottom, ${DEEP_VIOLET}, #2b1a33 45%, ${BG})` }}
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true" />

          <div className="relative max-w-5xl mx-auto grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-x-16 gap-y-7 md:gap-y-8">
            <ProgramCover className="w-32 sm:w-44 md:w-full md:max-w-[340px] mx-auto md:-rotate-[3deg] order-2 md:order-1 md:row-span-2 md:self-center" />

            <div className="order-1 md:order-2 md:self-end">
              <Ornament />
              <h2 id="full-heading" className="mt-4 text-3xl md:text-5xl font-heading font-light text-foreground leading-tight text-balance">
                Jeden dzień to dopiero początek
              </h2>
              <p className="mt-5 max-w-xl text-base md:text-lg text-foreground/90 leading-relaxed">
                Jeśli pierwszy dzień zachęci Cię do dalszej refleksji, możesz kontynuować z pełnym programem. Przez
                siedem dni będziesz poznawać kolejne tematy i pracować z pytaniami, które pomogą Ci lepiej przyjrzeć się
                sobie.
              </p>
            </div>

            <div className="order-3 md:col-start-2 md:self-start">
              <dl className="grid grid-cols-3 max-w-xl divide-x divide-white/10 rounded-2xl border border-white/15 bg-white/[0.04]">
                <div className="px-3 sm:px-5 py-4">
                  <dt className="text-xs sm:text-sm text-foreground/75">Format</dt>
                  <dd className="mt-1 text-lg sm:text-xl font-heading text-foreground">PDF</dd>
                </div>
                <div className="px-3 sm:px-5 py-4">
                  <dt className="text-xs sm:text-sm text-foreground/75">Czas</dt>
                  <dd className="mt-1 text-lg sm:text-xl font-heading text-foreground leading-tight">7 dni pracy własnej</dd>
                </div>
                <div className="px-3 sm:px-5 py-4">
                  <dt className="text-xs sm:text-sm text-foreground/75">{programAvailable ? "Cena" : "Cena planowana"}</dt>
                  <dd className="mt-1 text-2xl sm:text-3xl font-heading text-accent">{formatPrice(fullProgram.price)}</dd>
                </div>
              </dl>

              {programAvailable ? (
                <Button
                  asChild
                  size="xl"
                  className="mt-6 w-full sm:w-auto px-8 rounded-xl bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground font-medium shadow-lg shadow-accent/30"
                >
                  <a
                    href={fullProgram.productUrl}
                    onClick={() => {
                      trackProductClick({ id: fullProgram.id, name: fullProgram.title, price: fullProgram.price });
                      trackShopClick(fullProgram.productUrl!);
                    }}
                  >
                    Zobacz produkt
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </a>
                </Button>
              ) : (
                <p className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/40 bg-accent/10 text-sm font-medium text-accent">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  W przygotowaniu
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreeMaterial;
