import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PdfPreviewGallery from "@/components/PdfPreviewGallery";
import { usePageMeta } from "@/hooks/use-page-meta";
import { trackProductClick, trackShopClick } from "@/lib/analytics";
import { PRODUCTS } from "@/config/products";
import { PROGRAM_DAYS } from "@/config/program-7-dni";
import { SALES_PAGE_PREVIEW_PAGES } from "@/config/program-preview";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";

// Strona programu „7 dni, żeby wrócić do siebie” (/program-7-dni). Sprzedaż odbywa się poza tą stroną (WooCommerce):
// przycisk zakupu pokaże się dopiero, gdy produkt w src/config/products.ts ma status "available" i prawdziwy productUrl.
const program = PRODUCTS.find((product) => product.id === "7-dni-powrotu-do-siebie")!;
const programAvailable = program.status === "available" && !!program.productUrl;
const price = program.price !== undefined ? program.price.toLocaleString("pl-PL") + " zł" : "";

// zawartość PDF (fakty o produkcie, bez obietnic efektów)
const contents = [
  "26 stron PDF",
  "7 dni pracy własnej",
  "7 tematów",
  "Pytania i ćwiczenia do refleksji",
  "Miejsce na odpowiedzi",
  "Podsumowanie i plan na kolejny tydzień",
];

// Odpowiedzi wynikają z zawartości PDF. Sposób dostarczenia pliku po zakupie (e-mail / konto w sklepie)
// do uzupełnienia, gdy WooCommerce będzie skonfigurowany – patrz UWAGI.md.
const faq = [
  {
    q: "Co otrzymam po zakupie?",
    a: "Plik PDF z całym programem – 26 stron: siedem dni z tematami, pytaniami i ćwiczeniami do refleksji, miejscem na odpowiedzi oraz podsumowaniem z planem na kolejny tydzień.",
  },
  {
    q: "Czy muszę wykonywać program codziennie?",
    a: "Program jest podzielony na siedem dni – jeden temat na dzień. Możesz jednak pracować we własnym tempie i wrócić do kolejnego dnia wtedy, gdy znajdziesz na to chwilę.",
  },
  {
    q: "Czy mogę korzystać z PDF na telefonie?",
    a: "Tak, plik otworzysz na telefonie, tablecie i komputerze. Odpowiedzi wygodniej będzie zapisywać na wydrukowanych stronach albo w notesie.",
  },
  {
    q: "Czy potrzebuję dodatkowych materiałów?",
    a: "Nie. Wystarczy plik PDF i coś do pisania.",
  },
];

const PLUM = "#221427";
const VIOLET = "#2a2038";
const GRAPHITE = "#1f1a20";
const DEEP_VIOLET = "#1b1428";
const BG = "#130f1a";

const Ornament = ({ onLight = false, className }: { onLight?: boolean; className?: string }) => (
  <div className={cn("flex items-center gap-2", className)} aria-hidden="true">
    <span className={cn("w-10 h-px bg-gradient-to-r from-transparent", onLight ? "to-[#9a7420]" : "to-accent/70")} />
    <span className={cn("w-1.5 h-1.5 rotate-45", onLight ? "bg-[#9a7420]" : "bg-accent/80")} />
  </div>
);

// zakup: aktywny przycisk tylko przy prawdziwym adresie produktu, w przeciwnym razie dyskretne „W przygotowaniu”
const PurchaseAction = ({ className }: { className?: string }) =>
  programAvailable ? (
    <Button
      asChild
      size="xl"
      className={cn(
        "w-full sm:w-auto px-8 rounded-xl bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground font-medium shadow-lg shadow-accent/30",
        className,
      )}
    >
      <a
        href={program.productUrl}
        onClick={() => {
          trackProductClick({ id: program.id, name: program.title, price: program.price });
          trackShopClick(program.productUrl!);
        }}
      >
        Zobacz produkt
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </a>
    </Button>
  ) : (
    <p className={cn("inline-flex items-center gap-2 text-sm font-medium text-accent/90", className)}>
      <Clock className="w-4 h-4" aria-hidden="true" />
      W przygotowaniu
    </p>
  );

const FreeDayLink = ({ className }: { className?: string }) => (
  <p className={cn("text-base text-foreground/80", className)}>
    Chcesz najpierw spróbować?{" "}
    <Link
      to="/7-dni-powrotu-do-siebie"
      className="font-medium text-accent underline underline-offset-4 decoration-accent/40 hover:text-amber-300 hover:decoration-amber-300 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      Odbierz pierwszy dzień za&nbsp;darmo.
    </Link>
  </p>
);

const ProgramPage = () => {
  usePageMeta("/program-7-dni");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO – tekst + okładka pełnego programu */}
        <section
          aria-labelledby="program-hero-heading"
          className="relative overflow-hidden"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 bg-background/35 lg:bg-transparent lg:bg-gradient-to-r lg:from-background/80 lg:via-background/40 lg:to-transparent pointer-events-none" />
          <div
            className="absolute inset-x-0 bottom-0 h-24 md:h-40 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${PLUM})` }}
          />
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pt-[5.25rem] pb-10 md:pt-32 md:pb-20 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-8 lg:gap-12">
            <div className="text-center lg:text-left max-w-[34rem] mx-auto lg:mx-0">
              <p className="inline-flex items-center rounded-full border border-accent/40 bg-background/40 px-3.5 py-1 text-sm font-medium text-foreground/90 backdrop-blur-sm">
                26 stron PDF <span aria-hidden="true" className="mx-2 text-accent">•</span> 7 dni
                <span aria-hidden="true" className="mx-2 text-accent">•</span> {price}
              </p>
              <h1
                id="program-hero-heading"
                className="mt-4 md:mt-6 text-[2.5rem] md:text-6xl xl:text-7xl font-heading font-light text-foreground leading-[1.1] text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
              >
                7 dni, żeby wrócić do siebie
              </h1>
              <p className="mt-3 md:mt-5 text-[1.375rem] md:text-2xl xl:text-[1.75rem] font-heading text-accent leading-snug text-pretty drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                Siedem dni, żeby zatrzymać się i&nbsp;przyjrzeć temu, co naprawdę jest dla Ciebie ważne.
              </p>

              <div className="mt-6 md:mt-8 flex flex-col items-center lg:items-start gap-4">
                <PurchaseAction />
                <FreeDayLink />
              </div>
            </div>

            <div className="flex justify-center lg:justify-end lg:pr-6">
              <div className="relative w-44 sm:w-56 lg:w-[310px] xl:w-[340px] lg:rotate-[2deg]">
                <div className="absolute -inset-6 rounded-full bg-accent/25 blur-3xl pointer-events-none" aria-hidden="true" />
                <img
                  src={program.image}
                  alt={program.imageAlt ?? program.title}
                  width={1414}
                  height={2000}
                  decoding="async"
                  className="relative w-full h-auto rounded-md ring-1 ring-accent/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* OPIS WARTOŚCI + ZAWARTOŚĆ */}
        <section
          aria-labelledby="program-about-heading"
          className="relative px-5 sm:px-6 pt-6 pb-12 md:pt-10 md:pb-20"
          style={{ background: `linear-gradient(to bottom, ${PLUM}, ${VIOLET})` }}
        >
          <div className="max-w-5xl mx-auto grid md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 md:gap-14 items-start">
            <div className="text-center md:text-left">
              <Ornament className="justify-center md:justify-start" />
              <h2 id="program-about-heading" className="mt-3 text-[2rem] md:text-5xl font-heading font-light text-foreground leading-tight">
                Jak wygląda program
              </h2>
              <p className="mt-4 md:mt-6 text-[1.0625rem] md:text-lg text-foreground/90 leading-relaxed text-pretty">
                Zaczynasz od przyjrzenia się temu, jak czujesz się dzisiaj i&nbsp;czego potrzebujesz. W&nbsp;kolejnych dniach
                zauważasz, co odbiera Ci energię, kiedy odkładasz siebie na później i&nbsp;jak traktujesz samą siebie. Na
                koniec wracasz do pierwszych odpowiedzi i&nbsp;wybierasz mały krok, który chcesz zrobić w&nbsp;kolejnym
                tygodniu.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 md:px-7 md:py-7">
              <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-accent">W programie</h3>
              <ul className="mt-3 space-y-2">
                {contents.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] md:text-base text-foreground/90 leading-snug">
                    <span className="mt-[0.45em] w-1.5 h-1.5 shrink-0 rotate-45 bg-accent/80" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* TEMATY DNI – zwarta siatka (telefon: lista, tablet 2 kolumny, desktop 4) */}
        <section
          aria-labelledby="program-days-heading"
          className="relative px-5 sm:px-6 pb-12 md:pb-20"
          style={{ background: VIOLET }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 id="program-days-heading" className="text-center text-[2rem] md:text-5xl font-heading font-light text-foreground leading-tight">
              Siedem dni, siedem tematów
            </h2>
            {/* telefon: jeden blok z wierszami (numer w złotym kółku); od sm: osobne karty w siatce */}
            <ol className="mt-6 md:mt-10 rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/10 sm:rounded-none sm:border-0 sm:bg-transparent sm:divide-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              {PROGRAM_DAYS.map(({ title, question }, index) => (
                <li
                  key={title}
                  className="flex gap-3.5 px-4 py-3 sm:block sm:rounded-xl sm:border sm:border-white/10 sm:bg-white/[0.03] sm:px-5 sm:py-5"
                >
                  <span
                    className="sm:hidden flex items-center justify-center w-8 h-8 shrink-0 rounded-full border border-accent/50 font-heading text-base text-accent"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="sr-only sm:not-sr-only sm:block text-xs font-medium uppercase tracking-[0.16em] text-accent">
                      Dzień {index + 1}
                    </p>
                    <p className="sm:mt-1 font-heading text-xl md:text-2xl text-foreground leading-tight">{title}</p>
                    <p className="mt-0.5 sm:mt-1 text-[0.9375rem] text-foreground/75 leading-snug">{question}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PODGLĄD – jasny panel jak na landingu; strony z dni 1, 4 i 6 (src/config/program-preview.ts) */}
        {SALES_PAGE_PREVIEW_PAGES.length > 0 && (
          <section
            aria-labelledby="program-preview-heading"
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
              <div className="relative px-4 pt-9 pb-9 sm:px-10 md:px-12 md:pt-14 md:pb-14 text-center">
                <Ornament onLight className="justify-center" />
                <h2 id="program-preview-heading" className="mt-3 md:mt-4 text-4xl md:text-5xl font-heading font-light text-[#2a1b3a] leading-tight">
                  Zajrzyj do programu
                </h2>
                <p className="mt-3 md:mt-4 max-w-xl mx-auto text-[1.0625rem] md:text-lg text-[#3d2f4a] leading-relaxed text-pretty">
                  Strony z&nbsp;pierwszego, czwartego i&nbsp;szóstego dnia.
                </p>
                <div className="mt-7 md:mt-10">
                  <PdfPreviewGallery pages={SALES_PAGE_PREVIEW_PAGES} />
                  <p className="md:hidden mt-3 text-sm text-[#5a4a66]">Dotknij strony, aby ją powiększyć</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CENA I ZAKUP */}
        <section
          aria-labelledby="program-price-heading"
          className="relative px-5 sm:px-6 py-12 md:py-20"
          style={{ background: `linear-gradient(to bottom, ${GRAPHITE}, ${DEEP_VIOLET})` }}
        >
          <div className="relative max-w-xl mx-auto text-center rounded-3xl bg-gradient-to-b from-[#40324f] to-[#2d2439] border border-accent/30 px-6 py-8 md:px-12 md:py-11 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.8),0_0_90px_-20px_rgba(233,185,73,0.25)]">
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" aria-hidden="true" />
            <h2 id="program-price-heading" className="text-2xl md:text-[2rem] font-heading font-light text-foreground leading-tight text-balance">
              Pełny program „7&nbsp;dni, żeby wrócić do siebie”
            </h2>
            <p className="mt-3 text-[0.9375rem] md:text-base text-foreground/80">PDF, 26 stron • 7 dni • 7 tematów</p>
            <p className="mt-5 md:mt-6 font-heading text-5xl md:text-6xl text-foreground leading-none">{price}</p>
            {!programAvailable && <p className="mt-2 text-sm text-foreground/70">cena planowana</p>}
            <div className="mt-6 md:mt-7 flex flex-col items-center gap-4">
              <PurchaseAction />
              <FreeDayLink className="text-[0.9375rem] md:text-base" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="program-faq-heading"
          className="relative px-5 sm:px-6 pb-14 md:pb-24"
          style={{ background: `linear-gradient(to bottom, ${DEEP_VIOLET}, ${BG})` }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 id="program-faq-heading" className="text-center text-[2rem] md:text-5xl font-heading font-light text-foreground leading-tight">
              Pytania
            </h2>
            <Accordion type="multiple" className="mt-6 md:mt-10 border-t border-white/10">
              {faq.map(({ q, a }) => (
                <AccordionItem key={q} value={q} className="border-white/10">
                  <AccordionTrigger className="py-4 md:py-5 text-left text-lg md:text-xl font-heading font-normal text-foreground hover:no-underline hover:text-accent [&>svg]:text-accent">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-foreground/85 leading-relaxed pr-6">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer variant="minimal" />
    </div>
  );
};

export default ProgramPage;
