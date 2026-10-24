// Podgląd stron PEŁNEGO programu „7 dni, żeby wrócić do siebie”.
//
// FULL_PROGRAM_PREVIEW_PAGES – landing darmowego dnia (sekcja „Jeden dzień to dopiero początek”).
// Dopóki lista jest pusta, na landingu nic się nie wyświetla (żadnych pustych miejsc ani zastępczych grafik).
//
// Jak dodać 2–3 strony:
// 1. Zapisz prawdziwe strony PDF jako obrazy w src/assets/products/7-dni/, np. full-day-3.webp
//    (najlepiej 1414 × 2000 px – te same proporcje co pozostałe strony).
// 2. Zaimportuj je tutaj i dopisz do listy z opisem (alt) tego, co faktycznie widać na stronie, np.:
//
//    import fullDay3 from "@/assets/products/7-dni/full-day-3.webp";
//    export const FULL_PROGRAM_PREVIEW_PAGES: PdfPage[] = [
//      { src: fullDay3, alt: "Strona z trzeciego dnia programu – …", width: 1414, height: 2000 },
//    ];

import type { PdfPage } from "@/components/PdfPreviewGallery";
import dayOneContent from "@/assets/products/7-dni/day-1-content.webp";
// ⚠ GRAFIKI ZASTĘPCZE – podmień pliki na prawdziwe strony z PDF (ta sama nazwa, 1414 × 2000 px)
// i popraw opisy alt poniżej. Nie wdrażać z grafikami zastępczymi.
import fullDay4 from "@/assets/products/7-dni/full-day-4.webp";
import fullDay6 from "@/assets/products/7-dni/full-day-6.webp";

export const FULL_PROGRAM_PREVIEW_PAGES: PdfPage[] = [];

// Strona programu (/program-7-dni): strony z dni 1, 4 i 6.
export const SALES_PAGE_PREVIEW_PAGES: PdfPage[] = [
  {
    src: dayOneContent,
    alt: "Strona z pierwszego dnia programu: pytanie do refleksji, miejsce na odpowiedź i „mały krok na dziś”",
    width: 1414,
    height: 2000,
  },
  { src: fullDay4, alt: "Strona z czwartego dnia programu – „Wybierz siebie” (grafika zastępcza)", width: 1414, height: 2000 },
  { src: fullDay6, alt: "Strona z szóstego dnia programu – „Wspieraj siebie” (grafika zastępcza)", width: 1414, height: 2000 },
];
