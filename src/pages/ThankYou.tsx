import { useEffect, useRef } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowRight, Clock, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { trackProductClick, trackShopClick } from "@/lib/analytics";
import { PRODUCTS } from "@/config/products";
import { FREE_MATERIAL_REQUIRES_CONFIRMATION, type ThankYouState } from "@/config/free-material";
import dayOneCover from "@/assets/products/7-dni/day-1-cover.webp";

// Pełny program – te same dane co na landingu (src/config/products.ts). Przycisk zakupu tylko przy aktywnej ofercie.
const fullProgram = PRODUCTS.find((product) => product.id === "7-dni-powrotu-do-siebie")!;
const programAvailable = fullProgram.status === "available" && !!fullProgram.productUrl;
const formatPrice = (price?: number) => (price !== undefined ? price.toLocaleString("pl-PL") + " zł" : "");
const programFacts = [
  { label: "Czas trwania", value: "7 dni" },
  { label: "Format", value: "PDF, 26 stron" },
  { label: programAvailable ? "Cena" : "Cena planowana", value: formatPrice(fullProgram.price) },
];

const ThankYouContent = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // po przejściu z formularza czytnik ekranu zaczyna od nagłówka strony
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main
        className="relative flex-1 overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #221427, #1b1428 60%, #130f1a)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 55% 45% at 30% 25%, rgba(139,92,246,0.18), transparent 70%)" }}
        />

        {/* potwierdzenie: okładka pierwszego dnia + komunikat (telefon: okładka nad tekstem) */}
        <section aria-labelledby="thanks-heading" className="relative max-w-4xl mx-auto px-5 sm:px-6 pt-24 pb-10 md:pt-36 md:pb-14">
          <div className="grid md:grid-cols-[220px_minmax(0,1fr)] items-center gap-7 md:gap-14">
            <div className="flex justify-center">
              <img
                src={dayOneCover}
                alt="Okładka bezpłatnego pierwszego dnia programu – „Dzień 1. Zatrzymaj się”"
                width={1414}
                height={2000}
                decoding="async"
                className="w-28 sm:w-36 md:w-full h-auto rounded-md ring-1 ring-accent/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] md:-rotate-[2deg]"
              />
            </div>

            <div className="text-center md:text-left">
              <h1
                id="thanks-heading"
                ref={headingRef}
                tabIndex={-1}
                className="text-[2.25rem] md:text-5xl lg:text-[3.5rem] font-heading font-light text-foreground leading-[1.1] text-balance outline-none"
              >
                Twój pierwszy krok już za Tobą
              </h1>
              {FREE_MATERIAL_REQUIRES_CONFIRMATION ? (
                <p className="mt-4 md:mt-5 max-w-xl mx-auto md:mx-0 text-[1.0625rem] md:text-xl text-foreground/90 leading-relaxed text-pretty">
                  Sprawdź swoją skrzynkę e-mail i&nbsp;potwierdź adres, klikając link w&nbsp;wiadomości od nas. Po
                  potwierdzeniu wyślemy Ci pierwszy dzień programu.
                </p>
              ) : (
                <p className="mt-4 md:mt-5 max-w-xl mx-auto md:mx-0 text-[1.0625rem] md:text-xl text-foreground/90 leading-relaxed text-pretty">
                  Sprawdź swoją skrzynkę e-mail. Znajdziesz tam wiadomość dotyczącą odbioru pierwszego dnia programu.
                </p>
              )}
              <p className="mt-4 md:mt-5 inline-flex items-start gap-2.5 text-left text-base text-foreground/80 leading-snug">
                <Inbox className="w-5 h-5 mt-px shrink-0 text-accent" aria-hidden="true" />
                Nie widzisz wiadomości? Sprawdź folder „Oferty” lub „Spam”.
              </p>
            </div>
          </div>
        </section>

        {/* pełny program – spokojna informacja; zakup dopiero przy aktywnej ofercie */}
        <section aria-labelledby="program-heading" className="relative max-w-4xl mx-auto px-5 sm:px-6 pb-14 md:pb-20">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 md:px-10 md:py-9 text-center md:text-left">
            <h2 id="program-heading" className="text-2xl md:text-[2rem] font-heading font-light text-foreground leading-tight">
              Chcesz poznać cały program?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto md:mx-0 text-base md:text-lg text-foreground/85 leading-relaxed text-pretty">
              Pierwszy dzień to początek programu „7&nbsp;dni, żeby wrócić do siebie”. Pełna wersja prowadzi przez siedem
              tematów – z&nbsp;pytaniami do refleksji, ćwiczeniami i&nbsp;podsumowaniem na koniec.
            </p>

            <dl className="mt-5 md:mt-6 max-w-sm md:max-w-none mx-auto md:mx-0 md:inline-grid md:grid-cols-[repeat(3,auto)] border-y border-white/15 divide-y md:divide-y-0 md:divide-x divide-white/15 text-left">
              {programFacts.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-3 md:block md:py-4 md:px-6 first:md:pl-0 last:md:pr-0">
                  <dt className="text-xs uppercase tracking-[0.14em] text-foreground/70 whitespace-nowrap">{label}</dt>
                  <dd className="md:mt-2 text-xl md:text-2xl font-heading text-foreground leading-tight whitespace-nowrap">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 md:mt-6 flex flex-col items-center md:items-start gap-3">
              {programAvailable ? (
                <Button
                  asChild
                  size="xl"
                  className="w-full sm:w-auto px-8 rounded-xl bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground font-medium shadow-lg shadow-accent/30"
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
              <Link to="/program-7-dni" className="inline-flex items-center gap-1.5 rounded-sm py-1 text-[0.9375rem] font-medium text-foreground/85 underline underline-offset-4 decoration-white/30 hover:text-accent hover:decoration-accent/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Zobacz szczegóły pełnego programu
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center">
            <Link to="/" className="inline-block py-2 text-base text-accent underline underline-offset-4 decoration-accent/40 hover:text-amber-300 transition-colors">
              Wróć na stronę główną
            </Link>
          </p>
        </section>
      </main>

      <Footer variant="minimal" />
    </div>
  );
};

// Strona pokazywana wyłącznie po przyjęciu zgłoszenia z formularza (stan przekazany przez nawigację).
// Wejście bezpośrednio na /dziekujemy przekierowuje na landing.
const ThankYou = () => {
  const location = useLocation();
  usePageMeta("/dziekujemy");

  if ((location.state as ThankYouState | null)?.submitted !== true) {
    return <Navigate to="/7-dni-powrotu-do-siebie" replace />;
  }
  return <ThankYouContent />;
};

export default ThankYou;
