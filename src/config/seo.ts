// Metadane SEO podstron. Używane w aplikacji (usePageMeta) i przy buildzie (vite.config.ts),
// który generuje osobne pliki HTML z tymi metadanymi dla robotów bez JavaScriptu (Facebook, X itp.).
// Bez aliasu "@" – plik jest importowany także przez vite.config.ts.

export const SITE_URL = "https://mysticaurora.pl";

export interface PageSeo {
  title: string;
  description: string;
  noindex?: boolean;
}

export const PAGE_SEO = {
  "/": {
    title: "Mystic Aurora – rozwój osobisty, intuicja i uważność",
    description:
      "Zatrzymaj się na chwilę i wróć do siebie. Refleksje, inspiracje i materiały, które łączą rozwój osobisty z duchowością.",
  },
  "/7-dni-powrotu-do-siebie": {
    title: "7 dni powrotu do siebie – darmowy materiał | Mystic Aurora",
    description:
      "Pobierz bezpłatnie pierwszy dzień programu „7 dni powrotu do siebie”: krótkie wprowadzenie i pytania do samodzielnej refleksji nad własnymi potrzebami.",
  },
  "/numerologia": {
    title: "Kalkulator numerologiczny | Mystic Aurora",
    description:
      "Wybierz datę urodzenia i sprawdź swoje liczby numerologiczne. Obliczenia wykonywane są w Twojej przeglądarce.",
  },
  "/polityka-prywatnosci": {
    title: "Polityka Prywatności | Mystic Aurora",
    description: "Informacje o przetwarzaniu danych osobowych i plikach cookies na stronie mysticaurora.pl.",
  },
} satisfies Record<string, PageSeo>;

export type SeoPath = keyof typeof PAGE_SEO;

export const NOT_FOUND_SEO: PageSeo = {
  title: "Nie znaleziono strony | Mystic Aurora",
  description: "Ta strona nie istnieje.",
  noindex: true,
};
