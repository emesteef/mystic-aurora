// Produkty wyświetlane w sekcji „Odkryj nasze produkty” na stronie głównej.
// Aby podmienić grafikę, wystarczy zastąpić plik w src/assets/products/ (ta sama nazwa; karta pokazuje całą grafikę).
// Gdy produkt będzie w sprzedaży: ustaw status "available" i productUrl na prawdziwy adres produktu.

import rytualMiotly from "@/assets/products/rytual-miotly.webp";
import siedemDniCover from "@/assets/products/7-dni/cover.webp";
import kragOgnia from "@/assets/products/krag-ognia.webp";

export type ProductStatus = "available" | "comingSoon";

export interface Product {
  id: string;
  title: string;
  description: string;
  format: string;
  price?: number; // w złotych, brutto
  image: string;
  imageAlt?: string;
  productUrl?: string;
  status: ProductStatus;
  freeSampleUrl?: string; // np. darmowy pierwszy dzień programu
}

export const PRODUCTS: Product[] = [
  {
    id: "rytual-miotly",
    title: "Rytuał Miotły",
    format: "PDF, 6 stron",
    description:
      "Symboliczny rytuał oczyszczania przestrzeni, który przeprowadzisz krok po kroku. Zawiera przygotowanie miejsca, formułę intencji i zakończenie rytuału.",
    image: rytualMiotly,
    imageAlt: "Okładka materiału „Rytuał Miotły”",
    status: "comingSoon",
  },
  {
    id: "7-dni-powrotu-do-siebie",
    title: "7 dni powrotu do siebie",
    format: "Program PDF",
    price: 39,
    description:
      "Siedem dni pytań i ćwiczeń, które zachęcają do zatrzymania się, przyjrzenia emocjom i lepszego poznania własnych potrzeb.",
    image: siedemDniCover,
    imageAlt: "Okładka pełnego programu „7 dni powrotu do siebie”",
    status: "comingSoon",
    freeSampleUrl: "/7-dni-powrotu-do-siebie",
  },
  {
    id: "krag-ognia",
    title: "Krąg Ognia",
    format: "Materiał audio",
    description:
      "Prowadzona praktyka inspirowana symboliką ognia. Chwila na skupienie, refleksję i świadome określenie własnej intencji.",
    image: kragOgnia,
    imageAlt: "Grafika materiału audio „Krąg Ognia”",
    status: "comingSoon",
  },
];
