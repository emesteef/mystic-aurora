// Produkty wyświetlane w sekcji „Odkryj nasze produkty” na stronie głównej.
// Aby podmienić grafikę, wystarczy zastąpić plik w src/assets/products/ (ta sama nazwa, proporcje 3:4).
// Gdy produkt będzie w sprzedaży: ustaw status "available" i productUrl na prawdziwy adres produktu.

import rytualMiotly from "@/assets/products/rytual-miotly.webp";
import siedemDni from "@/assets/products/7-dni-powrotu-do-siebie.webp";
import kragOgnia from "@/assets/products/krag-ognia.webp";

export type ProductStatus = "available" | "comingSoon";

export interface Product {
  id: string;
  title: string;
  description: string;
  format: string;
  price?: number; // w złotych, brutto
  image: string;
  productUrl?: string;
  status: ProductStatus;
  details?: string[];
  freeSampleUrl?: string; // np. darmowy pierwszy dzień programu
}

export const PRODUCTS: Product[] = [
  {
    id: "rytual-miotly",
    title: "Rytuał Miotły",
    format: "PDF, 6 stron",
    description:
      "Prosty rytuał symbolicznego oczyszczania przestrzeni. Dowiedz się, jak przygotować miejsce, nadać mu własną intencję i przeprowadzić rytuał krok po kroku.",
    details: [
      "Do wykonania wystarczy naturalna miotła i kilka minut.",
      "Materiał zawiera instrukcję oraz formułę intencji.",
      "Nie wymaga wcześniejszego doświadczenia.",
    ],
    image: rytualMiotly,
    status: "comingSoon",
  },
  {
    id: "7-dni-powrotu-do-siebie",
    title: "7 dni powrotu do siebie",
    format: "Program PDF, 7 dni",
    price: 39,
    description:
      "Siedem dni z pytaniami i ćwiczeniami, które zachęcają do zatrzymania się, przyjrzenia własnym emocjom i lepszego poznania swoich potrzeb.",
    details: [
      "Każdy dzień zawiera osobny temat.",
      "Program przeznaczony do samodzielnej pracy.",
      "Pierwszy dzień można otrzymać bezpłatnie.",
    ],
    image: siedemDni,
    status: "comingSoon",
    freeSampleUrl: "/7-dni-powrotu-do-siebie",
  },
  {
    id: "krag-ognia",
    title: "Krąg Ognia",
    format: "Materiał audio",
    description:
      "Prowadzona praktyka inspirowana symboliką ognia. Chwila zatrzymania, skupienia na własnej intencji i refleksji nad tym, co chcesz pozostawić za sobą.",
    image: kragOgnia,
    status: "comingSoon",
  },
];
