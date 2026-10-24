# Mystic Aurora – plan uruchomienia lejka „7 dni, żeby wrócić do siebie”

Stan na 23.10.2026. Dokument planistyczny – **kod nie był zmieniany, nic nie zostało wdrożone.**
Lejek: strona główna → landing `/7-dni-powrotu-do-siebie` (darmowy dzień 1) → `/dziekujemy` → e-maile → `/program-7-dni` → WooCommerce (`sklep.mysticaurora.pl`, 39 zł).

Powiązane dokumenty: `UWAGI.md` (otwarte sprawy), `PRZEGLAD-PRAWNY.md` (braki prawne, WooCommerce), `KONCOWY-PRZEGLAD.md`.

---

## 1. Gotowość – obszar po obszarze

| # | Obszar | Stan | Co jest | Czego brakuje |
|---|---|---|---|---|
| 1 | Formularz → backend → MailerLite | 🔴 | Formularz (walidacja, zgody, blokada podwójnego wysłania, przejście na `/dziekujemy` po `accepted: true`). Funkcja `netlify/functions/subscribe.js` (sprawdza e-mail i datę zgody, zapisuje do grupy MailerLite). | Formularz wywołuje tylko symulację (`submitFreeMaterial` w `FreeMaterialForm.tsx`) i pokazuje „Dziękujemy!” bez wysyłki. Funkcja zna tylko grupy `FREE_MEDITATION` i `NEWSLETTER` – brak grupy „7 dni”. Nie wiadomo, czy w Netlify są ustawione `MAILERLITE_API_KEY` i `MAILERLITE_GROUP_*`. |
| 2 | Dostarczenie darmowego PDF | 🔴 | Grafiki dnia 1 na stronie. | Brak pliku PDF w projekcie (usunięty z `public/`). Brak automatyzacji w MailerLite („dołączenie do grupy → e-mail z linkiem do PDF”). Nie ustalono, gdzie leży plik (MailerLite File Manager, prywatny link, Netlify). |
| 3 | Double opt-in | 🟡 | Strona `/dziekujemy` ma oba warianty tekstu – przełącznik `FREE_MATERIAL_REQUIRES_CONFIRMATION` w `src/config/free-material.ts` (teraz `false`). | Sprawdzić ustawienie DOI dla API w MailerLite i ustawić przełącznik zgodnie z nim. Przy DOI: PDF dopiero po potwierdzeniu (automatyzacja startuje od potwierdzenia). |
| 4 | Oddzielenie odbiorców PDF od newslettera | 🟡 | Formularz ma osobną, opcjonalną zgodę na newsletter. | Funkcja zapisuje do jednej grupy. Potrzebne: grupa „7 dni – darmowy dzień” zawsze + grupa „Newsletter” **tylko przy zaznaczonej zgodzie**; pola: data zgody, źródło, wersja treści zgody. |
| 5 | Sekwencja e-mail | 🔴 | – | Brak automatyzacji. Sekwencja marketingowa (np. o pełnym programie) **tylko dla grupy „Newsletter”**. Osoby bez zgody dostają wyłącznie wiadomość z PDF (ew. przypomnienie o pobraniu – do decyzji z prawnikiem, czy to jeszcze realizacja żądania). |
| 6 | WooCommerce i produkt 39 zł | 🔴 | Na stronie: konfiguracja produktu (`src/config/products.ts`, status „W przygotowaniu”), strona `/program-7-dni`, przycisk zakupu pojawia się automatycznie po wpisaniu `productUrl` i `status: "available"`. | Sklep na `sklep.mysticaurora.pl` nie jest potwierdzony; brak adresu produktu. Konfiguracja wg `PRZEGLAD-PRAWNY.md` pkt 7 (produkt wirtualny + do pobrania, VAT, checkbox utraty prawa odstąpienia). |
| 7 | Płatność i dostarczenie pełnego PDF | 🔴 | – | Bramka płatności, plik w chronionym katalogu WooCommerce, limit pobrań i ważność linku, e-mail z potwierdzeniem i regulaminem (trwały nośnik), test płatności testowej i zwrotu. |
| 8 | Polityka prywatności, cookies, zgody | 🔴 | Baner cookies, GA dopiero po zgodzie, „Ustawienia cookies” w stopce, fonty lokalne. | Polityka nieaktualna (brak administratora, GA4, cookies, MailerLite dla darmowego PDF, sklepu, transferu poza EOG). Brak regulaminu usług elektronicznych i regulaminu sklepu. Decyzja o obowiązkowym checkboxie „akceptuję Politykę Prywatności”. Baner zgód potrzebny też w sklepie (zgoda z `mysticaurora.pl` nie przenosi się na subdomenę – inne pochodzenie, osobny localStorage). |
| 9 | GA4 i pomiar | 🟡 | GA4 `G-FWB0VV9QW5` po zgodzie (Consent Mode basic). Zdarzenia: `free_material_cta_click`, `select_item`, `shop_click` (przygotowane), `sign_up` (niepodłączone). | Nowe nazwy zdarzeń (sekcja 2), zdarzenie sukcesu zapisu jako kluczowe (konwersja), `purchase` w WooCommerce, ten sam identyfikator GA4 w sklepie. |
| 10 | Testy całej ścieżki | 🟡 | Testy UI lejka (Playwright, 6 szerokości, axe 0 naruszeń, scenariusze formularza i linków). | Test na prawdziwym backendzie: zapis → MailerLite → e-mail → PDF; zakup testowy; zdarzenia w GA4 DebugView. Brak testów Playwright w repozytorium (skrypty są tymczasowe). |

Legenda: 🔴 blokuje uruchomienie, 🟡 częściowo gotowe / wymaga decyzji, 🟢 gotowe.

---

## 2. Zdarzenia GA4 – propozycja

Zasady wspólne:
- wysyłane **tylko po zgodzie** na cookies analityczne (jak obecnie w `src/lib/analytics.ts`),
- parametry to **wyłącznie stałe etykiety i dane produktu** – nigdy e-mail, imię, treść pól ani adres URL z danymi osobowymi (adres `/dziekujemy` nie zawiera e-maila – stan przekazywany jest w pamięci przeglądarki),
- kliknięcie przycisku zakupu **nie jest** zakupem ani rozpoczęciem płatności.

| Zdarzenie | Gdzie i kiedy | Parametry | Uwagi |
|---|---|---|---|
| `landing_view` | landing `/7-dni-powrotu-do-siebie`, po wyświetleniu | `landing_id: "7_dni_free_day"` | Dubluje `page_view` – przydatne jako prosty licznik w lejku. Alternatywa: tylko `page_view` z filtrem ścieżki. |
| `free_pdf_cta_click` | klik w przycisk prowadzący do formularza / na landing | `cta_location` (`home_hero`, `home_cta_section`, `products_section`, `landing_hero`, `landing_preview`, `landing_full_program`, `nav_desktop`, `nav_mobile`) | Zastępuje obecne `free_material_cta_click` (zmiana nazwy = nowa seria w raportach). |
| `free_pdf_form_submit` | poprawnie wypełniony formularz, **przed** odpowiedzią backendu | `form_location: "landing_free_material"` | Mierzy próby; różnica do `…_success` = błędy backendu. Nie wysyłać przy błędach walidacji. |
| `free_pdf_signup_success` | **po** odpowiedzi 200 z backendu (przejście na `/dziekujemy`) | `form_location`, `double_opt_in: true/false` | Oznaczyć jako **zdarzenie kluczowe** (konwersja). Opcjonalnie równolegle rekomendowane `generate_lead`. Przy DOI to „zgłoszenie”, nie „potwierdzony kontakt”. |
| `newsletter_consent` | razem z `free_pdf_signup_success`, tylko gdy zgoda zaznaczona | `form_location` | Bez wartości zgody „false” – brak zdarzenia = brak zgody. Zastępuje `sign_up` z `method: "newsletter"`. |
| `product_view` | `/program-7-dni`, po wyświetleniu | `item_id: "7-dni-powrotu-do-siebie"`, `price: 39`, `currency: "PLN"` | Rekomendowany odpowiednik GA4: `view_item` – warto wysyłać ten (raporty e-commerce). |
| `select_item` + `shop_click` (istniejące) | klik w przycisk zakupu na stronie | `item_id`, `price`, `currency`, `cta_location`, `link_url` | Wyjście do sklepu. **Nie** `begin_checkout`. |
| `begin_checkout` | **WooCommerce**: wejście na stronę zamówienia (checkout) | `items`, `value`, `currency` | Po stronie sklepu (wtyczka GA4 dla WooCommerce lub kod w motywie), nie w React. |
| `purchase` | **WooCommerce**: zamówienie opłacone (status „W trakcie realizacji”/„Zrealizowane” po potwierdzeniu bramki) | `transaction_id` (nr zamówienia), `value`, `currency`, `items` | **Nigdy przy kliknięciu ani przy samym złożeniu zamówienia.** Najpewniej po stronie serwera (hook płatności → Measurement Protocol) albo na stronie podziękowania tylko dla opłaconych zamówień; `transaction_id` chroni przed podwójnym liczeniem. Bez e-maila i danych klienta. |

Ciągłość sesji: GA4 domyślnie zapisuje cookie dla `.mysticaurora.pl`, więc przy **tym samym identyfikatorze GA4** w sklepie i zgodzie na obu stronach sesja przechodzi na `sklep.mysticaurora.pl` bez konfiguracji cross-domain. Dodać `sklep.mysticaurora.pl` do wykluczeń odesłań (unwanted referrals), jeśli raporty pokażą go jako źródło ruchu.

---

## 3. Co już działa

- Landing: hero z okładką dnia 1, formularz zaraz po hero, podgląd PDF z powiększaniem, sekcja pełnego programu, wszystkie CTA przewijają do formularza z fokusem w polu e-mail.
- Formularz (UI): walidacja przy polach, zachowanie wpisanego adresu, blokada podwójnego wysłania, osobna opcjonalna zgoda na newsletter, dostępność (axe 0 naruszeń).
- `/dziekujemy`: tylko po przyjęciu zgłoszenia (bez tego przekierowuje na landing), noindex, wariant z double opt-in.
- `/program-7-dni`: opis, 7 tematów, podgląd, cena „planowana”, FAQ, link do darmowego dnia; linki do niej z landingu, `/dziekujemy` i karty na stronie głównej.
- Strona główna: CTA „Odbierz darmowy dzień” na pierwszym ekranie telefonu, jedna sekcja darmowego materiału, karty produktów „W przygotowaniu”.
- Przyciski zakupu: pojawią się same po wpisaniu adresu produktu (bez fikcyjnych linków).
- GA4 po zgodzie, baner cookies, ustawienia cookies w stopce.
- Responsywność 360–1920 px, brak poziomego przewijania, fokus klawiatury.

## 4. Czego brakuje

1. Podłączenie formularza do `subscribe` (z nową grupą „7 dni” i warunkowym zapisem do newslettera).
2. PDF dnia 1 + automatyzacja e-mail w MailerLite (i decyzja o DOI).
3. Sekwencja e-mail dla grupy „Newsletter”.
4. Sklep WooCommerce: produkt, płatności, dostarczenie pliku, e-maile, regulamin w checkout.
5. Polityka prywatności, regulamin usług elektronicznych, regulamin sklepu, dane przedsiębiorcy (`src/config/business.ts`).
6. Zdarzenia GA4 wg sekcji 2 (strona) i `begin_checkout`/`purchase` (sklep).
7. Prawdziwe strony PDF dni 4 i 6 w miejsce grafik zastępczych na `/program-7-dni`.
8. Porządki przed wdrożeniem: usunąć `public/export.zip` i `public/podsumowanie.txt`; dodać `/program-7-dni` do `sitemap.xml`.
9. Testy Playwright w repozytorium (ścieżka formularza i linków) – opcjonalnie, ale ułatwią kolejne zmiany.

## 5. Co wymaga decyzji

1. **Double opt-in** – tak/nie (rekomendacja: tak dla newslettera; dla samego PDF do decyzji).
2. **Obowiązkowy checkbox** „Chcę otrzymać… i akceptuję Politykę Prywatności” – zostawić czy zastąpić informacją (weryfikacja prawna).
3. **Gdzie leży darmowy PDF** i czy link ma wygasać.
4. **Struktura MailerLite**: nazwy grup, pola (data zgody, źródło, wersja zgody), czy osoby bez zgody na newsletter dostają cokolwiek poza PDF.
5. **Administrator danych i forma działalności** (jedna osoba / dwie / spółka), status VAT.
6. **Sklep**: potwierdzenie WooCommerce na `sklep.mysticaurora.pl`, bramka płatności, data startu sprzedaży.
7. **Nazwy zdarzeń** – przejście z `free_material_cta_click`/`sign_up` na nowe (utrata ciągłości historycznych raportów – dane są świeże, więc koszt niski).
8. **Platformy reklamowe** (Meta, Google Ads) – każdy piksel/tag to nowe narzędzie: wymaga zgody marketingowej w banerze (`ad_storage`), wpisu w polityce i Twojej zgody na wdrożenie.
9. Adres strony programu (`/program-7-dni`) i ewentualne przekierowania.

## 6. Co blokuje uruchomienie reklam

Reklam kierujących na landing **nie uruchamiać**, dopóki:

1. 🔴 formularz nie zapisuje do MailerLite (teraz każdy zapis przepada, a użytkownik widzi „Dziękujemy!”),
2. 🔴 darmowy PDF nie dochodzi automatycznie (test na kilku skrzynkach: Gmail, Outlook, Onet/WP – zakładki „Oferty”/spam),
3. 🔴 polityka prywatności nie opisuje zbierania e-maili po PDF, GA4 i administratora danych; brak regulaminu usług elektronicznych,
4. 🔴 nie ma mierzalnej konwersji: `free_pdf_signup_success` jako zdarzenie kluczowe w GA4 (a dla optymalizacji kampanii – tag platformy reklamowej z obsługą zgody, po decyzji z pkt 5.8),
5. 🟡 strona `/program-7-dni` ma grafiki zastępcze (blokuje kampanie kierujące tam; dla kampanii na darmowy dzień – nie, ale strona jest linkowana z lejka),
6. 🟡 kampanie sprzedażowe (39 zł) dodatkowo wymagają działającego sklepu, regulaminu sklepu i `purchase` z potwierdzoną płatnością.

---

## 7. Proponowana kolejność

1. **Decyzje** z sekcji 5 (pkt 1–5).
2. **MailerLite**: grupy, pola, DOI, automatyzacja z PDF dnia 1, test ręczny przez formularz MailerLite.
3. **Podłączenie formularza** (za Twoją zgodą): `submitFreeMaterial` → `/.netlify/functions/subscribe` z grupą „7 dni” (+ „Newsletter” warunkowo), `accepted: true` tylko po 200; ustawienie przełącznika DOI; zmienne środowiskowe w Netlify.
4. **Dokumenty**: polityka prywatności, regulamin usług elektronicznych, dane przedsiębiorcy.
5. **GA4**: zdarzenia ze strony (sekcja 2), zdarzenie kluczowe, DebugView; ustawienia panelu wg `PRZEGLAD-PRAWNY.md` pkt 4.
6. **Test całej ścieżki darmowej** (sekcja 8) na wdrożeniu podglądowym Netlify (deploy preview), nie na produkcji.
7. **Start kampanii na darmowy dzień** (po decyzji o pikselach).
8. **Sklep**: WooCommerce, produkt 39 zł, płatności, dostarczenie, regulamin, `begin_checkout`/`purchase`; wpisanie `productUrl` i `status: "available"` w `src/config/products.ts`; prawdziwe strony dni 4 i 6.
9. **Test zakupu** (płatność testowa, zwrot, e-maile, link do pliku, `purchase` raz na zamówienie).
10. **Start sprzedaży i kampanii sprzedażowych.**

## 8. Testy całej ścieżki (lista kontrolna)

**Darmowy dzień**
- [ ] Zapis z telefonu (Safari iOS, Chrome Android) i komputera; także z przeglądarki w aplikacji Instagram/Facebook.
- [ ] Zapis bez zgody na newsletter → kontakt tylko w grupie „7 dni”; ze zgodą → także „Newsletter”, z datą i źródłem zgody.
- [ ] DOI (jeśli włączone): e-mail potwierdzający → po kliknięciu e-mail z PDF; bez kliknięcia – brak PDF.
- [ ] PDF otwiera się na telefonie i komputerze; link działa po kilku dniach (lub wygasa zgodnie z decyzją).
- [ ] Ponowny zapis tym samym adresem – brak błędu dla użytkownika, brak duplikatu w MailerLite.
- [ ] Błąd backendu (np. wyłączony klucz API na preview) → komunikat „Nie udało się wysłać…”, adres zostaje w polu, brak przejścia na `/dziekujemy`.
- [ ] Wejście bezpośrednio na `/dziekujemy` → przekierowanie na landing.
- [ ] GA4 DebugView: `free_pdf_cta_click` → `free_pdf_form_submit` → `free_pdf_signup_success` (+ `newsletter_consent`); brak zdarzeń przed zgodą na cookies; brak e-maila w parametrach i adresach stron.

**Zakup**
- [ ] `/program-7-dni` → „Kup…” → właściwa karta produktu w sklepie (telefon i komputer).
- [ ] Checkout: regulamin, zgoda na dostarczenie treści cyfrowej, płatność testowa.
- [ ] Po opłaceniu: e-mail z potwierdzeniem i linkiem do pliku, plik pobiera się, limit/ważność działają; plik nie jest dostępny bez zakupu.
- [ ] `begin_checkout` przy wejściu do zamówienia; `purchase` **tylko** po opłaceniu, raz na zamówienie (odświeżenie strony podziękowania nie dubluje); zamówienie nieopłacone/anulowane – brak `purchase`.
- [ ] Zwrot/anulowanie – procedura i ewentualne zdarzenie `refund`.
