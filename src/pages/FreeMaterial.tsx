import { useEffect, useRef } from "react";
import { ArrowRight, CalendarDays, Clock, FileText, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FreeMaterialForm from "@/components/FreeMaterialForm";
import PdfPreviewGallery from "@/components/PdfPreviewGallery";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollToSection } from "@/lib/scroll";
import { trackFreeMaterialCta, trackProductClick, trackShopClick } from "@/lib/analytics";
import { PRODUCTS } from "@/config/products";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";
import dayOneCover from "@/assets/products/7-dni/day-1-cover.webp";
import dayOneContent from "@/assets/products/7-dni/day-1-content.webp";

const situations = [
  "Masz czas dla wszystkich, tylko nie dla siebie.",
  "Dzień mija, a Ty nawet nie wiesz, kiedy.",
  "Odkładasz własne potrzeby na później.",
];

// Grafiki programu (strony A4, 1414 × 2000 px): darmowy pierwszy dzień vs pełny program (okładka z products.ts)
const DAY_ONE_COVER_ALT = "Okładka bezpłatnego pierwszego dnia programu – „Dzień 1. Zatrzymaj się”";
const DAY_ONE_CONTENT_ALT =
  "Strona z pierwszego dnia programu: pytanie do refleksji, miejsce na odpowiedź i „mały krok na dziś”";

const previewPages = [
  { src: dayOneCover, alt: DAY_ONE_COVER_ALT, width: 1414, height: 2000 },
  { src: dayOneContent, alt: DAY_ONE_CONTENT_ALT, width: 1414, height: 2000 },
];

// Pełny program – dane z src/config/products.ts (cena, status, productUrl). Przycisk zakupu pokaże się dopiero,
// gdy produkt będzie miał status "available" i prawdziwy productUrl.
const fullProgram = PRODUCTS.find((product) => product.id === "7-dni-powrotu-do-siebie")!;
const programAvailable = fullProgram.status === "available" && !!fullProgram.productUrl;
const programFacts = [
  { icon: CalendarDays, label: "7 dni" },
  { icon: FileText, label: "Program PDF" },
  { icon: PenLine, label: "Samodzielna praca" },
];
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

const ProgramCover = ({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) => (
  <div className={`relative ${className ?? ""}`}>
    <div className="absolute -inset-6 rounded-full bg-accent/25 blur-3xl pointer-events-none" aria-hidden="true" />
    <img
      src={src}
      alt={alt}
      width={1414}
      height={2000}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="relative w-full h-auto object-contain rounded-md ring-1 ring-accent/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]"
    />
  </div>
);

const FormCta = ({
  onClick,
  location,
  label = "Odbierz pierwszy dzień za darmo",
}: {
  onClick: () => void;
  location: "landing_hero" | "landing_preview";
  label?: string;
}) => (
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
      {label}
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

          {/* telefon: tekst → CTA → okładka; desktop: tekst + CTA po lewej, okładka po prawej */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-12 md:pt-32 md:pb-24 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-8 lg:gap-12">
            <div className="text-center lg:text-left max-w-[36rem] mx-auto lg:mx-0">
              <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/30 text-xs md:text-sm tracking-[0.2em] text-foreground font-medium animate-fade-in-up opacity-0">
                <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
                BEZPŁATNY MATERIAŁ
              </p>

              <h1
                id="hero-heading"
                className="mt-5 md:mt-6 text-4xl md:text-6xl xl:text-7xl font-heading font-light text-foreground leading-tight text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0 animation-delay-200"
              >
                7 dni powrotu do siebie
              </h1>

              <p className="mt-3 md:mt-4 text-xl md:text-2xl font-heading text-accent drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0 animation-delay-200">
                Zacznij od jednego dnia. Tylko dla siebie.
              </p>

              <p className="mt-4 md:mt-6 text-lg md:text-xl text-foreground/90 leading-relaxed md:leading-relaxed text-pretty drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] animate-fade-in-up opacity-0 animation-delay-400">
                Między pracą, domem i codziennymi obowiązkami łatwo zapomnieć o własnych potrzebach. Pobierz bezpłatnie
                pierwszy dzień programu i znajdź chwilę, żeby przyjrzeć się sobie.
              </p>

              <div className="mt-6 md:mt-8 flex flex-col items-center lg:items-start gap-3 animate-fade-in-up opacity-0 animation-delay-400">
                <FormCta onClick={goToForm} location="landing_hero" />
                <p className="text-sm md:text-base text-foreground/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
                  Bezpłatny PDF <span aria-hidden="true" className="mx-1.5 text-accent">•</span> Pierwszy dzień programu
                </p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end lg:pr-6 animate-fade-in-up opacity-0 animation-delay-600">
              <ProgramCover
                src={fullProgram.image}
                alt={fullProgram.imageAlt ?? fullProgram.title}
                className="w-48 sm:w-56 lg:w-[300px] xl:w-[330px] lg:rotate-[2deg]"
                priority
              />
            </div>
          </div>
        </section>

        {/* SEKCJA 2 – BRZMI ZNAJOMO? (redakcyjnie: nagłówek, trzy kolumny z liniami podziału, podsumowanie) */}
        <section
          aria-labelledby="familiar-heading"
          className="relative overflow-hidden px-6 pt-4 pb-12 md:pt-8 md:pb-16"
          style={{ background: `linear-gradient(to bottom, ${PLUM}, ${VIOLET})` }}
        >
          <div className="absolute -left-40 top-1/3 w-[480px] h-[480px] rounded-full bg-primary/15 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center gap-5 md:gap-8">
              <h2 id="familiar-heading" className="shrink-0 text-4xl md:text-6xl font-heading font-light text-foreground leading-tight">
                Brzmi znajomo?
              </h2>
              {/* subtelny akcent: złota linia z rombem prowadząca do treści */}
              <div className="flex-1 flex items-center gap-2" aria-hidden="true">
                <span className="h-px flex-1 bg-gradient-to-r from-accent/60 to-accent/0" />
              </div>
            </div>

            <ul className="mt-8 md:mt-12 grid md:grid-cols-3 border-y border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {situations.map((text, index) => (
                <li key={text} className="flex md:block items-start gap-4 py-5 md:py-8 md:px-8 first:md:pl-0 last:md:pr-0">
                  <span className="font-heading text-2xl md:text-3xl leading-none text-accent/80 w-8 shrink-0 md:mb-4 md:block" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-2xl md:text-[1.75rem] font-heading italic text-foreground leading-snug">{text}</p>
                </li>
              ))}
            </ul>

            <p className="mt-8 md:mt-10 max-w-3xl md:mx-auto md:text-center text-lg md:text-2xl text-foreground/90 leading-relaxed text-balance">
              Nie musisz zmieniać wszystkiego od razu.{" "}
              <span className="text-accent">Zacznij od chwili, którą poświęcisz tylko sobie.</span>
            </p>
          </div>
        </section>

        {/* SEKCJA 3 – ZAJRZYJ DO ŚRODKA (jasny panel z podglądem prawdziwych stron PDF) */}
        <section
          aria-labelledby="inside-heading"
          className="relative px-3 sm:px-6 pb-12 md:pb-20"
          style={{ background: `linear-gradient(to bottom, ${VIOLET}, ${GRAPHITE})` }}
        >
          <div className="relative max-w-6xl mx-auto rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#fbf6ee] via-[#f4ece2] to-[#ece4f3] shadow-2xl shadow-black/40">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#e7d6f5] blur-3xl opacity-70 pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#f3dfb9] blur-3xl opacity-60 pointer-events-none" aria-hidden="true" />

            <div className="relative grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-10 px-6 py-10 sm:px-10 md:px-12 md:py-14 items-center">
              <div className="text-center lg:text-left">
                <Ornament onLight className="justify-center lg:justify-start" />
                <h2 id="inside-heading" className="mt-4 text-3xl md:text-5xl font-heading font-light text-[#2a1b3a] leading-tight">
                  Zajrzyj do środka
                </h2>
                <p className="mt-4 md:mt-5 max-w-md mx-auto lg:mx-0 text-base md:text-lg text-[#3d2f4a] leading-relaxed">
                  Zobacz fragment pierwszego dnia. Znajdziesz w nim krótkie wprowadzenie, pytania do refleksji i miejsce na
                  własne odpowiedzi.
                </p>
                <div className="hidden lg:block mt-8">
                  <FormCta onClick={goToForm} location="landing_preview" label="Chcę otrzymać pierwszy dzień" />
                </div>
              </div>

              <div>
                <PdfPreviewGallery pages={previewPages} />
                <p className="md:hidden -mt-2 mb-2 text-center text-sm text-[#5a4a66]">Przesuń, aby zobaczyć kolejną stronę</p>
                <div className="lg:hidden mt-6 flex justify-center">
                  <FormCta onClick={goToForm} location="landing_preview" label="Chcę otrzymać pierwszy dzień" />
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
          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-8 lg:gap-16 items-center">
            <div className="px-2 sm:px-0 text-center lg:text-left">
              <h2 id="form-heading" className="text-3xl md:text-5xl lg:text-6xl font-heading font-light text-foreground leading-tight text-balance">
                Zacznij od jednego dnia
              </h2>
              <p className="mt-4 md:mt-5 text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-md mx-auto lg:mx-0 text-balance">
                Podaj swój adres e-mail, a wyślemy Ci bezpłatnie pierwszy dzień programu.
              </p>
            </div>

            <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:justify-self-end px-5 py-8 sm:p-9 md:p-10 rounded-3xl bg-gradient-to-b from-[#3a2e49] to-[#271f31] border border-white/15 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.75),0_0_90px_-20px_rgba(233,185,73,0.28)]">
              <FreeMaterialForm ref={emailRef} />
            </div>
          </div>
        </section>

        {/* SEKCJA 5 – PEŁNY PROGRAM (duża okładka + tekst; zakup dopiero przy aktywnej ofercie) */}
        <section
          aria-labelledby="full-heading"
          className="relative overflow-hidden px-6 py-12 md:py-20"
          style={{ background: `linear-gradient(to bottom, ${DEEP_VIOLET}, #2b1a33 50%, ${BG})` }}
        >
          <div className="absolute left-[18%] top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#8b5cf6]/15 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-6xl mx-auto grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 md:gap-16 items-center">
            <ProgramCover
              src={fullProgram.image}
              alt={fullProgram.imageAlt ?? fullProgram.title}
              className="w-44 sm:w-56 md:w-full md:max-w-[400px] mx-auto md:-rotate-[2deg] order-2 md:order-1"
            />

            <div className="order-1 md:order-2 text-center md:text-left">
              <Ornament className="justify-center md:justify-start" />
              <h2 id="full-heading" className="mt-4 text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground leading-tight text-balance">
                Jeden dzień to dopiero początek
              </h2>
              <p className="mt-5 max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-foreground/90 leading-relaxed">
                Jeśli pierwszy dzień zachęci Cię do dalszej refleksji, możesz kontynuować z pełnym programem. Przez
                siedem dni będziesz poznawać kolejne tematy i pracować z pytaniami, które pomogą Ci lepiej przyjrzeć się
                sobie.
              </p>

              <ul className="mt-6 md:mt-7 flex flex-wrap justify-center md:justify-start gap-2.5" aria-label="O programie">
                {programFacts.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-base text-foreground"
                  >
                    <Icon className="w-4 h-4 text-accent" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-3">
                <p className="flex items-baseline gap-3">
                  <span className="text-base text-foreground/80">{programAvailable ? "Cena" : "Cena planowana"}</span>
                  <span className="text-4xl md:text-5xl font-heading text-accent">{formatPrice(fullProgram.price)}</span>
                </p>
                {programAvailable ? (
                  <Button
                    asChild
                    size="xl"
                    className="px-8 rounded-xl bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground font-medium shadow-lg shadow-accent/30"
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
                  <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/40 bg-accent/10 text-sm font-medium text-accent">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    W przygotowaniu
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreeMaterial;
