# Mystic Aurora – końcowy przegląd przed wdrożeniem

Data: 20.10.2026 · Środowisko testów: build produkcyjny (`vite build` + `vite preview`), Chrome (Playwright), axe-core 4.
**Nic nie zostało wdrożone na produkcję.**

---

## 1. Blokery uruchomienia produkcyjnego

| # | Problem | Dlaczego blokuje | Co zrobić |
|---|---|---|---|
| 1 | **Formularz na `/7-dni-powrotu-do-siebie` nie wysyła danych** – pokazuje „Dziękujemy!”, ale nikt nie dostanie maila. | Odwiedzająca dostaje fałszywe potwierdzenie. | Podłączyć wysyłkę (MailerLite + automatyzacja z PDF) w `submitFreeMaterial` w `src/components/FreeMaterialForm.tsx`. |
| 2 | **`public/materialy/` = ok. 305 MB PDF-ów** (PROGNOZA, PROGNOZA PRO + kopie w `compressed/`). `dist` po buildzie waży 306 MB. | Każdy plik z `public` jest publicznie dostępny pod adresem URL – płatny PDF można pobrać bez zakupu. Ogromny deploy. Pliki są też dodane do gita (`git add`). | Przenieść PDF-y poza `public` (i poza repozytorium); udostępniać przez MailerLite / sklep. |
| 3 | **Polityka prywatności nieaktualna** – pkt 7 twierdzi, że strona nie używa cookies śledzących; brak Google, administratora, transferu do USA. | Niezgodność dokumentu ze stanem faktycznym (GA4). | Zaktualizować wg `PRZEGLAD-PRAWNY.md` po zatwierdzeniu treści (prawnik). |
| 4 | **Brak regulaminu świadczenia usług drogą elektroniczną** (newsletter, darmowy materiał). | Wymagany dla usług świadczonych drogą elektroniczną. | Przygotować z prawnikiem. |
| 5 | **`public/podsumowanie.txt`** trafi na serwer jako publiczny plik. | Wewnętrzny dokument stałby się publiczny. | Usunąć lub przenieść poza `public`. |

Przed sprzedażą programu za 39 zł dodatkowo: dane przedsiębiorcy, regulamin sklepu, mechanizm zgody na dostarczenie treści cyfrowej – szczegóły w `PRZEGLAD-PRAWNY.md`.

---

## 2. Co zostało wdrożone w tym etapie

### SEO
- **Strona główna:** nowy title (52 znaki) i meta description (119 znaków), zgodne z obecnymi tekstami strony.
- **Unikalne metadane dla każdej podstrony** (`/7-dni-powrotu-do-siebie`, `/numerologia`, `/polityka-prywatnosci`) w jednym pliku `src/config/seo.ts`:
  - w aplikacji ustawiane przez `usePageMeta` (title, description, canonical, og:*, twitter:*),
  - **przy buildzie generowane osobne pliki** `dist/<podstrona>.html` z tymi metadanymi – Facebook, X i inne roboty bez JavaScriptu widzą właściwy tytuł, opis i adres.
- **Strona 404:** po polsku, `noindex`, w stylu strony.
- **Open Graph / Twitter:** dodane wymiary obrazka (1920×1080) i tekst alternatywny; `summary_large_image` bez zmian.
- **Schema.org Organization:** usunięty opis usług, których marka nie świadczy („medytacje prowadzone, czyszczenie energetyczne, uzdrawianie serca, rytuały księżycowe”). Nowy opis zgodny ze stroną, logo zamiast zdjęcia OG, dodany e-mail, usunięta niepoprawna dla Organization właściwość `inLanguage`.
- **sitemap.xml:** 4 adresy z aktualną datą (dodana polityka prywatności).
- **robots.txt:** bez zmian – poprawny (wszystko dozwolone + link do sitemapy).
- **site.webmanifest:** naprawione ścieżki ikon (wskazywały na nieistniejące pliki), dodana nazwa, ciemny kolor motywu; `theme-color` w `index.html`.
- **Hierarchia nagłówków:** na każdej stronie jeden H1, bez przeskoków poziomów (H1 → H2 → H3).

### Analityka (GA4)
- Jedna instalacja GA4 (`G-FWB0VV9QW5`), ładowana wyłącznie po zgodzie – bez zmian w mechanizmie zgód, bez drugiej instalacji.
- Nowe zdarzenia (`src/lib/analytics.ts`), wysyłane tylko po zgodzie, parametry wyłącznie stałe etykiety:

| Zdarzenie | Kiedy | Parametry | Status |
|---|---|---|---|
| `free_material_cta_click` | klik w CTA darmowego materiału | `cta_location`: `home_hero`, `nav_desktop`, `nav_mobile`, `landing_hero` | **działa** |
| `sign_up` (rekomendowane GA4) | poprawny zapis do newslettera (odpowiedź 200 serwera) | `method: newsletter`, `form_location: home_newsletter` | **działa** |
| `select_item` (rekomendowane GA4) | klik w produkt | `items[{item_id, item_name, price}]`, `currency: PLN` | gotowa funkcja – **brak produktów do podpięcia** |
| `shop_click` | przejście do sklepu | `link_url` | gotowa funkcja – **brak adresu sklepu** |

- Formularz `/7-dni-powrotu-do-siebie`: zdarzenie celowo **nie jest wysyłane**, bo formularz jeszcze nie działa (w kodzie jest komentarz, gdzie je dodać po podłączeniu).

### Dostępność, kontrast, formularze
- Cała treść stron w znaczniku `<main>` (wcześniej na stronie głównej tylko hero, a numerologia i polityka nie miały go wcale).
- Linki w stopce mają większy obszar kliknięcia (min. 24 px wysokości).
- Kontrast podniesiony w dwóch drobnych tekstach (4,1:1 i 4,3:1 → ≥4,5:1).
- Newsletter: systemowe okienko `alert()` zastąpione komunikatem w formularzu (odczytywanym przez czytniki ekranu), dodany stan „Zapisywanie…” i blokada podwójnego wysłania.

---

## 3. Zmienione pliki

**Nowe:** `src/config/seo.ts`, `src/lib/analytics.ts`, `KONCOWY-PRZEGLAD.md`

**Zmienione:**
- `index.html` – metadane, OG, Schema.org, theme-color
- `vite.config.ts` – generowanie plików HTML podstron przy buildzie
- `public/sitemap.xml`, `public/favicon/site.webmanifest`
- `src/hooks/use-page-meta.ts` – metadane z `seo.ts`, obsługa `noindex`
- `src/pages/Index.tsx`, `FreeMaterial.tsx`, `Numerology.tsx`, `PrivacyPolicy.tsx`, `NotFound.tsx` – metadane, `<main>`, zdarzenia GA4
- `src/components/Navbar.tsx` – zdarzenie GA4 dla „Darmowy materiał”
- `src/components/Newsletter.tsx` – obsługa błędów, stan wysyłania, zdarzenie `sign_up`, kontrast
- `src/components/FreeMaterialForm.tsx` – kontrast, komentarz o zdarzeniu GA4
- `src/components/Footer.tsx` – większe obszary kliknięcia
- `UWAGI.md` – zaktualizowany

---

## 4. Wykonane testy

| Test | Wynik |
|---|---|
| `npm run build` | ✅ OK (2,6 s). TypeScript bez błędów. ESLint: 0 problemów w zmienianych plikach; 3 błędy + 7 ostrzeżeń w gotowych komponentach `src/components/ui/*` i `tailwind.config.ts` – istniały wcześniej, nie wpływają na build. |
| Routing (`/`, `/7-dni-powrotu-do-siebie`, `/numerologia`, `/polityka-prywatnosci`, nieistniejący adres) | ✅ Każda strona renderuje właściwy H1, title, canonical i og:url. Nieistniejący adres → strona 404 z `noindex`. |
| Pliki HTML podstron (bez JS) | ✅ Właściwe title/canonical/og:url w `dist/*.html`; JSON-LD poprawny składniowo. |
| Linki i przyciski | ✅ Wszystkie linki wewnętrzne działają, kotwice `#o-nas`, `#produkty`, `#kontakt`, `#newsletter`, `#formularz` mają cele. Linki zewnętrzne (Instagram, Facebook, MailerLite, Netlify) otwierają się w nowej karcie. Brak martwych przycisków. |
| Mobile (375 px) | ✅ Brak poziomego przewijania na 4 stronach. Menu mobilne otwiera się, link przewija do sekcji i zamyka menu. Zrzuty ekranu sprawdzone wizualnie. Checkboxy mają 16 px, ale ich etykiety są klikalne. |
| Klawiatura | ✅ Logiczna kolejność Tab (logo → menu → CTA → formularz → stopka), widoczny fokus. Enter na „Kontakt” przewija do stopki. CTA na landingu przenosi fokus do pola e-mail. Spacja zaznacza zgodę. Na telefonie Enter otwiera menu, a Tab przechodzi do linków. Ustawienia cookies ze stopki przenoszą fokus do banera. |
| axe-core (WCAG 2.x A/AA) | ✅ 0 naruszeń na 5 stronach i w banerze cookies (po poprawkach `<main>`). |
| Kontrast (pomiar na wyrenderowanych pikselach tła, w tym zdjęcia i gradienty) | ✅ Wszystkie teksty ≥ 4,5:1 (duże ≥ 3:1) po poprawkach; najsłabsze: „© 2026 Mystic Aurora” 4,57:1. Wyjątek: przycisk „Zapisz się” w stanie wyłączonym (1,6:1) – WCAG nie wymaga kontrastu dla nieaktywnych elementów. |
| Wydajność (symulacja telefonu: 1,6 Mb/s, RTT 150 ms, CPU ×4, bez cache) | ⚠️ Strona główna: FCP 1,8 s, **LCP 2,4 s**, CLS 0,008. Landing: FCP 1,6 s, **LCP 3,9 s**, CLS 0,035. Transfer ok. 560 kB: JS 142 kB, fonty 190 kB, obrazy 210 kB, CSS 14 kB. |
| Formularz `/7-dni-powrotu-do-siebie` | ✅ Puste pola → oba komunikaty i `aria-invalid`. „abc@” → „Sprawdź, czy adres e-mail jest poprawny”. Bez zgody → komunikat o zgodzie. Poprawne dane → „Wysyłanie…” → „Dziękujemy!” (symulacja, patrz bloker 1). |
| Formularz newslettera | ✅ Bez zgody przycisk nieaktywny. „abc” → walidacja przeglądarki. Błąd serwera 500 → komunikat w formularzu. Sukces 200 → „Dziękujemy! Sprawdź swoją skrzynkę e-mail.” |
| GA4 bez zgody | ✅ 0 ładowań `gtag.js`, 0 wysłanych danych. |
| GA4 ze zgodą | ✅ `page_view` na zmianę podstrony (bez dodatkowych odsłon przy kotwicach), `free_material_cta_click` z właściwym `cta_location` (3 miejsca), `sign_up` po zapisie. **Adres e-mail nie trafia do GA** (sprawdzone w treści wszystkich wysłanych danych). W testach dane do Google były przechwytywane – nic nie trafiło do Twojej usługi GA. |

---

## 5. Konfiguracja poza kodem

**Netlify**
- Zmienne: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_NEWSLETTER`, `MAILERLITE_GROUP_FREE_MEDITATION` (lub nowa grupa dla „7 dni”).
- Na podglądzie wdrożenia (Deploy Preview) sprawdzić, że `/7-dni-powrotu-do-siebie` jest serwowane z pliku `7-dni-powrotu-do-siebie.html` (np. „Wyświetl źródło” → właściwy `<title>`) i nie ma przekierowania na adres z ukośnikiem.

**Google Analytics 4 (panel)**
- Oznaczyć `sign_up` jako kluczowe zdarzenie (konwersję).
- Dodać wymiary niestandardowe: `cta_location`, `form_location` (zakres: zdarzenie) – bez tego parametry nie pojawią się w raportach.
- Sprawdzić, czy w Enhanced Measurement włączone jest „Page changes based on browser history events” (odsłony podstron w aplikacji SPA).
- Zaakceptować Data Processing Terms, ustawić okres przechowywania danych, rozważyć wyłączenie Google Signals.

**MailerLite**
- Automatyzacja wysyłająca PDF „7 dni powrotu do siebie”, double opt-in, pola na źródło i wersję zgody.

**Google Search Console**
- Zgłosić `https://mysticaurora.pl/sitemap.xml`, sprawdzić indeksowanie podstron.

**Facebook**
- Po wdrożeniu odświeżyć podgląd linków w Sharing Debuggerze (stare tytuły mogą być w pamięci podręcznej).

---

## 6. Rekomendacje (nie blokują)

- **Wydajność landing page (LCP 3,9 s na wolnym telefonie):** przekonwertować `hero-bg.jpg` (166 kB) do WebP/AVIF i logo PNG (48 kB, wyświetlane w rozmiarze do 144 px) do WebP – realnie −150 kB. Rozważyć usunięcie nieużywanych dostawców (np. React Query, podwójne toastery), aby zmniejszyć JS.
- **Git:** w repozytorium czekają niezatwierdzone zmiany `package.json` / `package-lock.json` i dodane PDF-y (305 MB) – nie zatwierdzać PDF-ów.
- Checkboxy zgód mają 16 px – można powiększyć do 20–24 px dla wygody na telefonie.
- Polityka prywatności nie ma stopki (brak linku „Ustawienia cookies” na tej stronie) – do uwzględnienia przy aktualizacji treści.
