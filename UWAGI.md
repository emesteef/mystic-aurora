# Uwagi na później

## Przegląd końcowy

- Blokery wdrożenia, wyniki testów i konfiguracja poza kodem: **`KONCOWY-PRZEGLAD.md`** (20.10.2026).
- **`public/materialy/` (~305 MB PDF-ów)** – publicznie dostępne po wdrożeniu, w tym PROGNOZA PRO. Przenieść poza `public` i nie zatwierdzać w gicie.

## SEO / dane strukturalne

- ~~Opis marki w Schema.org brzmiał jak świadczenie usług~~ – **zmienione 20.10.2026** (na prośbę w przeglądzie końcowym) na: „Refleksje, inspiracje i materiały, które łączą rozwój osobisty z duchowością.”

## Prywatność i sprzedaż

- Pełna lista braków w dokumentach prawnych, danych do uzupełnienia i konfiguracji WooCommerce: **`PRZEGLAD-PRAWNY.md`** (20.10.2026).
- Dane przedsiębiorcy i adres regulaminu wpisać w `src/config/business.ts` (`company`, `termsUrl`) – stopka pokaże je automatycznie.
- Polityka prywatności (pkt 7 o cookies) jest nieaktualna od czasu wdrożenia GA4 z banerem – do aktualizacji po zatwierdzeniu treści.

## Inne otwarte sprawy

- **⚠ Formularz na `/7-dni-powrotu-do-siebie` NIE jest podłączony** – `submitFreeMaterial` w `src/components/FreeMaterialForm.tsx` tylko symuluje wysyłkę i pokazuje „Dziękujemy!”. Nie wdrażać na produkcję przed podłączeniem (np. `/.netlify/functions/subscribe` + grupa MailerLite z automatycznym mailem z PDF-em; zgoda na newsletter jest osobna i opcjonalna – zapisywać do newslettera tylko gdy zaznaczona).
- **Grafiki programu „7 dni”** – prawdziwe obrazy w `src/assets/products/7-dni/` (21.10.2026): `cover.webp` (karta na stronie głównej, hero landingu i sekcja 39 zł), `day-1-cover.webp` (podgląd – z przodu), `day-1-content.webp` (podgląd – z tyłu). Nazwa ujednolicona na „7 dni, żeby wrócić do siebie” (jak na okładce); adres strony `/7-dni-powrotu-do-siebie` zostaje bez zmian.
- **Pełny program 39 zł** – brak przycisku zakupu; dodać, gdy będzie prawdziwy adres produktu.
- **Sekcja Produkty** – 3 karty (Rytuał Miotły, 7 dni, żeby wrócić do siebie, Krąg Ognia), wszystkie „W przygotowaniu”. Dane w `src/config/products.ts`: gdy produkt trafi do sprzedaży, ustawić `status: "available"` i `productUrl`. Placeholder ma już tylko Krąg Ognia (`src/assets/products/krag-ognia.webp`) – podmienić plik (ta sama nazwa); karta pokazuje całą grafikę bez przycinania, dowolne proporcje. Cena 39 zł nie jest pokazywana na karcie – tylko na landingu.
- **Newsletter na stronie głównej** – formularz zastąpiony sekcją z przyciskiem do landingu (21.10.2026). `src/components/Newsletter.tsx` i `netlify/functions/subscribe.js` zostały w projekcie, ale nie są nigdzie używane. Zapis na newsletter jest teraz możliwy tylko jako opcjonalna zgoda w formularzu na `/7-dni-powrotu-do-siebie` (jeszcze niepodłączonym), więc zdarzenie GA4 `sign_up` przestało się wysyłać ze strony głównej.
- **Blog** – nie ma go w menu, dopóki nie będzie działającego adresu.
- **Numerologia** – do ustalenia, które etapy redukcji mają być brane pod uwagę (np. pełne sumy jak 31, etapy pośrednie jak 10) i która liczba ma przechodzić do kolejnych pól (np. w polu 4: 30 czy 12).
- **`public/export.zip`** (zrzuty ekranu dla ChatGPT, 10 MB) – jak każdy plik w `public` trafi na serwer przy wdrożeniu. Usunąć przed wdrożeniem.
- **`public/podsumowanie.txt`** – plik trafi na serwer przy wdrożeniu (publicznie dostępny). Usunąć lub przenieść poza `public`, jeśli nie ma być publiczny.
