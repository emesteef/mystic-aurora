import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FreeMaterialForm from "@/components/FreeMaterialForm";
import PdfPreviewGallery from "@/components/PdfPreviewGallery";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollToSection } from "@/lib/scroll";
import { trackFreeMaterialCta, trackProductClick, trackShopClick } from "@/lib/analytics";
import { PRODUCTS } from "@/config/products";
import { FULL_PROGRAM_PREVIEW_PAGES } from "@/config/program-preview";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";
import dayOneCover from "@/assets/products/7-dni/day-1-cover.webp";
import dayOneContent from "@/assets/products/7-dni/day-1-content.webp";

// \u00a0 = twarda spacja: „a” nie zostaje samo na końcu wiersza
const situations = [
  "Masz czas dla wszystkich, tylko nie dla siebie.",
  "Dzień mija, a\u00a0Ty nawet nie wiesz, kiedy.",
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
const formatPrice = (price?: number) => (price !== undefined ? price.toLocaleString("pl-PL") + "\u00a0zł" : "");
const programFacts = [
  { label: "Czas trwania", value: "7 dni" },
  { label: "Format", value: "PDF, 26 stron" },
  { label: programAvailable ? "Cena" : "Cena planowana", value: formatPrice(fullProgram.price) },
];
// porównanie: bezpłatny pierwszy dzień vs pełny program (rzeczywista zawartość PDF)
const freeVersionItems = ["Wprowadzenie do pracy własnej", "Pytania o aktualne emocje i potrzeby", "Miejsce na odpowiedzi"];
const fullVersionItems = ["26 stron PDF", "7 tematów", "Ćwiczenia i pytania do refleksji", "Podsumowanie i plan na kolejny tydzień"];
// tematy kolejnych dni programu (zgodne z PDF)
const programDays = [
  { title: "Zatrzymaj się", question: "Jak się dziś czujesz?" },
  { title: "Zauważ", question: "Co zabiera Ci najwięcej energii?" },
  { title: "Posłuchaj siebie", question: "Kiedy potrzebujesz zwolnić?" },
  { title: "Wybierz siebie", question: "Jak często stawiasz siebie na końcu?" },
  { title: "Doceniaj", question: "Co masz, a\u00a0czego już nie zauważasz?" },
  { title: "Wspieraj siebie", question: "Czy powiedziałabyś to samo komuś, kogo kochasz?" },
  { title: "Idź dalej", question: "Co chcesz zabrać ze sobą?" },
];

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
          {/* telefon: tekst → CTA → okładka; desktop: tekst + CTA po lewej, okładka po prawej */}
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pt-24 pb-12 md:pt-32 md:pb-24 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-10 lg:gap-12">
            <div className="text-center lg:text-left max-w-[34rem] mx-auto lg:mx-0">
              <h1
                id="hero-heading"
                className="text-[2.5rem] md:text-6xl xl:text-7xl font-heading font-light text-foreground leading-[1.1] text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0"
              >
                7 dni, żeby wrócić do siebie
              </h1>

              <p className="mt-3 md:mt-4 text-[1.375rem] md:text-2xl xl:text-[1.75rem] font-heading text-accent leading-snug drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] animate-fade-in-up opacity-0 animation-delay-200">
                Zacznij od jednego dnia. <br className="lg:hidden" />
                Tylko dla siebie.
              </p>

              <div className="mt-5 md:mt-7 max-w-[31rem] mx-auto lg:mx-0 space-y-3 md:space-y-4 text-[1.0625rem] md:text-lg leading-relaxed md:leading-relaxed text-foreground/90 text-pretty drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] animate-fade-in-up opacity-0 animation-delay-200">
                <p>
                  Praca, dom, obowiązki, potrzeby innych. A&nbsp;kiedy ostatnio znalazłaś chwilę, żeby pomyśleć o&nbsp;sobie?
                </p>
                <p>
                  Pobierz bezpłatnie pierwszy dzień programu. Znajdziesz w&nbsp;nim pytania i&nbsp;ćwiczenia, które pomogą Ci
                  przyjrzeć się własnym potrzebom.
                </p>
              </div>

              <div className="mt-6 md:mt-8 flex flex-col items-center lg:items-start gap-3 animate-fade-in-up opacity-0 animation-delay-400">
                <FormCta onClick={goToForm} location="landing_hero" />
                <p className="text-[0.9375rem] md:text-base text-foreground/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
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

        {/* SEKCJA 2 – BRZMI ZNAJOMO? (jak krótki wiersz: trzy zdania jedno pod drugim, złote romby, zakończenie) */}
        <section
          aria-labelledby="familiar-heading"
          className="relative overflow-hidden px-6 pt-4 pb-8 md:pt-10 md:pb-16"
          style={{ background: `linear-gradient(to bottom, ${PLUM}, ${VIOLET})` }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-full h-[420px] rounded-full bg-primary/15 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 id="familiar-heading" className="text-[2rem] md:text-5xl lg:text-[3.5rem] font-heading font-light text-foreground leading-tight">
              Brzmi znajomo?
            </h2>

            <ul className="mt-4 md:mt-9">
              {situations.map((text, index) => (
                <li key={text}>
                  {index > 0 && (
                    <span className="flex justify-center my-2 md:my-5" aria-hidden="true">
                      <span className="w-1.5 h-1.5 rotate-45 bg-accent/70" />
                    </span>
                  )}
                  <p className="text-[1.375rem] md:text-[2.5rem] font-heading italic font-light text-foreground/95 leading-snug text-pretty">
                    {text}
                  </p>
                </li>
              ))}
            </ul>

            {/* zakończenie: krótka złota linia, potem łagodne „wyjście” z sytuacji */}
            <div className="mt-5 md:mt-11 flex justify-center" aria-hidden="true">
              <span className="w-16 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
            </div>
            <p className="mt-3 md:mt-6 max-w-2xl mx-auto text-[1.0625rem] md:text-2xl text-foreground/85 leading-relaxed text-balance">
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
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle at 92% 6%, rgba(231,214,245,0.75), transparent 34%), radial-gradient(circle at 6% 96%, rgba(243,223,185,0.6), transparent 38%)",
              }}
            />

            {/* nagłówek i opis → dwie strony obok siebie → CTA pod podglądem */}
            <div className="relative px-5 pt-10 pb-10 sm:px-10 md:px-12 md:pt-14 md:pb-14 text-center">
              <Ornament onLight className="justify-center" />
              <h2 id="inside-heading" className="mt-3 md:mt-4 text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-light text-[#2a1b3a] leading-tight">
                Zajrzyj do środka
              </h2>
              <p className="mt-3 md:mt-4 max-w-xl mx-auto text-[1.0625rem] md:text-lg text-[#3d2f4a] leading-relaxed text-pretty">
                Zobacz fragment pierwszego dnia. Znajdziesz w&nbsp;nim krótkie wprowadzenie, pytania do refleksji
                i&nbsp;miejsce na własne odpowiedzi.
              </p>

              <div className="mt-7 md:mt-10">
                <PdfPreviewGallery pages={previewPages} />
                <p className="md:hidden mt-3 text-sm text-[#5a4a66]">Dotknij strony, aby ją powiększyć</p>
              </div>

              <div className="mt-7 md:mt-10 flex justify-center">
                <FormCta onClick={goToForm} location="landing_preview" label="Chcę otrzymać pierwszy dzień" />
              </div>
            </div>
          </div>
        </section>

        {/* SEKCJA 4 – FORMULARZ (najważniejszy punkt strony: jasna, wyraźna karta, bez ozdobników) */}
        <section
          id="formularz"
          aria-labelledby="form-heading"
          // scroll-mt = wysokość stałego nagłówka (h-16 / md:h-20), żeby po przewinięciu tytuł nie chował się pod nim
          className="relative overflow-hidden px-4 sm:px-6 pt-8 pb-10 md:pt-16 md:pb-20 scroll-mt-16 md:scroll-mt-20"
          style={{ background: `linear-gradient(to bottom, ${GRAPHITE}, ${DEEP_VIOLET})` }}
        >
          {/* delikatne rozjaśnienie tła pod kartą – formularz jest punktem skupienia sekcji (gradient, bez filtra blur) */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: "radial-gradient(ellipse 60% 55% at 68% 52%, rgba(139,92,246,0.16), transparent 70%)" }}
          />

          {/* telefon: nagłówek tuż nad kartą (po przewinięciu widać tytuł i pole e-mail);
              desktop: tekst po lewej, karta formularza (maks. 580 px) po prawej */}
          <div className="relative max-w-xl lg:max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_560px] items-center gap-6 lg:gap-14">
            <div className="px-2 sm:px-0 text-center lg:text-left">
              <h2 id="form-heading" className="text-[2rem] md:text-5xl lg:text-[3.5rem] font-heading font-light text-foreground leading-tight text-balance">
                Twój pierwszy dzień zaczyna się tutaj
              </h2>
              <p className="mt-3 md:mt-5 max-w-md lg:max-w-[27rem] mx-auto lg:mx-0 text-[1.0625rem] md:text-xl text-foreground/90 leading-relaxed text-balance lg:text-pretty">
                Podaj swój adres e-mail, a&nbsp;otrzymasz bezpłatnie pierwszy dzień programu „7 dni, żeby wrócić do siebie”.
              </p>
            </div>

            <div className="relative px-5 py-6 sm:px-9 sm:py-8 md:px-10 md:py-9 rounded-3xl bg-gradient-to-b from-[#40324f] to-[#2d2439] border border-accent/30 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.8),0_0_90px_-20px_rgba(233,185,73,0.32)]">
              {/* cienka złota linia u góry karty */}
              <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" aria-hidden="true" />
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

          <div className="relative max-w-5xl mx-auto grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-x-12 lg:gap-x-20 gap-y-8 items-center">
            <div className="text-center md:text-left md:order-2">
              <Ornament className="justify-center md:justify-start" />
              <h2 id="full-heading" className="mt-4 text-[2.25rem] md:text-5xl lg:text-[3.5rem] font-heading font-light text-foreground leading-[1.1] text-balance">
                Jeden dzień to dopiero początek
              </h2>
              <p className="mt-5 max-w-xl mx-auto md:mx-0 text-[1.0625rem] md:text-lg text-foreground/90 leading-relaxed text-pretty">
                Pierwszy dzień pozwoli Ci zatrzymać się i&nbsp;przyjrzeć własnym potrzebom. Jeśli zechcesz kontynuować,
                pełny program poprowadzi Cię przez kolejne sześć dni z&nbsp;nowymi tematami i&nbsp;pytaniami do refleksji.
              </p>
              <p className="mt-3 max-w-xl mx-auto md:mx-0 text-[1.0625rem] md:text-lg text-foreground/80 leading-relaxed text-pretty">
                Przez siedem dni przyjrzysz się temu, co czujesz, czego potrzebujesz i&nbsp;jak traktujesz samą siebie. Każdy
                dzień to kolejny temat, pytania do refleksji i&nbsp;mały krok, który możesz wykonać we własnym tempie. Na koniec
                wrócisz do swoich pierwszych odpowiedzi i&nbsp;zastanowisz się, co chcesz zmienić w&nbsp;kolejnym tygodniu.
              </p>

              {/* najważniejsze informacje jako spokojna lista: czas, format, cena – bez presji sprzedażowej */}
              {/* telefon: wiersze „etykieta – wartość”; od tabletu: trzy kolumny bez zawijania */}
              <dl className="mt-7 md:mt-9 max-w-sm md:max-w-none mx-auto md:mx-0 md:inline-grid md:grid-cols-[repeat(3,auto)] border-y border-white/15 divide-y md:divide-y-0 md:divide-x divide-white/15 text-left">
                {programFacts.map(({ label, value }) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-3 md:block md:py-4 md:px-6 first:md:pl-0 last:md:pr-0">
                    <dt className="text-xs uppercase tracking-[0.14em] text-foreground/70 whitespace-nowrap">{label}</dt>
                    <dd className="md:mt-2 text-2xl font-heading text-foreground leading-tight whitespace-nowrap">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 md:mt-7 flex justify-center md:justify-start">
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
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-accent/90">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    W przygotowaniu
                  </p>
                )}
              </div>
            </div>

            <div className="md:order-1 flex justify-center">
              <ProgramCover
                src={fullProgram.image}
                alt={fullProgram.imageAlt ?? fullProgram.title}
                className="w-48 sm:w-64 md:w-full md:max-w-[440px] md:-rotate-[1.5deg]"
              />
            </div>
          </div>

          {/* SIEDEM DNI: zwarta oś z numerami w złotych kółkach; desktop: dni 1–4 i 5–7 w dwóch kolumnach */}
          <div className="relative max-w-4xl mx-auto mt-10 md:mt-16 pt-8 md:pt-12 border-t border-white/10">
            <h3 className="text-center text-2xl md:text-[2rem] font-heading font-light text-foreground">
              Siedem dni, siedem tematów
            </h3>

            <ol className="mt-6 md:mt-9 max-w-md md:max-w-none mx-auto grid md:grid-flow-col md:grid-rows-4 md:grid-cols-2 md:gap-x-16">
              {programDays.map(({ title, question }, index) => (
                <li
                  key={title}
                  className={cn(
                    "relative flex gap-3.5 md:gap-4 pb-4 md:pb-5",
                    // cienka linia łącząca kolejne dni (bez linii po ostatnim dniu w kolumnie)
                    "before:absolute before:left-[15px] md:before:left-[17px] before:top-9 md:before:top-10 before:bottom-1 before:w-px before:bg-accent/25",
                    index === programDays.length - 1 && "before:hidden",
                    index === 3 && "md:before:hidden",
                  )}
                >
                  <span
                    className="relative z-10 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-full border border-accent/50 bg-[#24182b] font-heading text-base md:text-lg text-accent"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div className="pt-0.5 md:pt-1 min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="font-heading text-lg md:text-xl text-foreground leading-tight">
                        <span className="sr-only">Dzień {index + 1}: </span>
                        {title}
                      </span>
                      {index === 0 && (
                        <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          bezpłatny
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 md:mt-1 text-[0.9375rem] text-foreground/75 leading-snug">{question}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* PORÓWNANIE WERSJI: jeden lekki blok z dwiema kolumnami (telefon: jedna pod drugą), bez osobnych dużych kart */}
            <div className="mt-6 md:mt-10 grid md:grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.03] divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="px-5 py-5 md:px-8 md:py-7">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">Bezpłatnie</p>
                <h4 className="mt-1.5 font-heading text-xl md:text-2xl text-foreground">Pierwszy dzień programu</h4>
                <ul className="mt-3 space-y-1.5">
                  {freeVersionItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] md:text-base text-foreground/85 leading-snug">
                      <span className="mt-[0.45em] w-1.5 h-1.5 shrink-0 rotate-45 bg-accent/80" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-5 py-5 md:px-8 md:py-7">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/70">
                  Pełny program – {formatPrice(fullProgram.price)}
                  {!programAvailable && <span className="normal-case tracking-normal text-foreground/60"> (cena planowana)</span>}
                </p>
                <h4 className="mt-1.5 font-heading text-xl md:text-2xl text-foreground">Wszystkie 7 dni</h4>
                <ul className="mt-3 space-y-1.5">
                  {fullVersionItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] md:text-base text-foreground/85 leading-snug">
                      <span className="mt-[0.45em] w-1.5 h-1.5 shrink-0 rotate-45 bg-foreground/50" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* podgląd stron pełnego programu – pokazuje się dopiero, gdy w src/config/program-preview.ts są prawdziwe pliki */}
            {FULL_PROGRAM_PREVIEW_PAGES.length > 0 && (
              <div className="mt-8 md:mt-10">
                <h4 className="text-center font-heading text-xl md:text-2xl text-foreground">Fragmenty pełnego programu</h4>
                <div className="mt-5 md:mt-6">
                  <PdfPreviewGallery pages={FULL_PROGRAM_PREVIEW_PAGES} />
                </div>
              </div>
            )}

            {/* powrót do głównego celu strony – zapisu po bezpłatny pierwszy dzień */}
            <p className="mt-6 md:mt-8 text-center">
              <a
                href="#formularz"
                onClick={(e) => {
                  e.preventDefault();
                  goToForm();
                }}
                className="inline-flex items-center gap-2 rounded-sm text-base font-medium text-accent underline underline-offset-4 decoration-accent/40 hover:text-amber-300 hover:decoration-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                Zacznij od bezpłatnego pierwszego dnia
                <ArrowUp className="w-4 h-4" aria-hidden="true" />
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer variant="minimal" />
    </div>
  );
};

export default FreeMaterial;
