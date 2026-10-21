# Mystic Aurora – przegląd techniczny: prywatność, cookies, sprzedaż online

Data przeglądu: 20.10.2026

> To jest przegląd **techniczny**, a nie opinia prawna. Nie oznacza, że strona jest zgodna z prawem.
> Treści dokumentów prawnych (polityka prywatności, regulaminy) wymagają danych przedsiębiorcy
> i powinny zostać zweryfikowane przez prawnika przed publikacją.

---

## 1. Co zostało wdrożone technicznie

| Zmiana | Plik |
|---|---|
| Pełna stopka: logo i nazwa, e-mail, Instagram, Facebook, Polityka Prywatności, „Ustawienia cookies”, © bieżący rok. Regulamin i dane przedsiębiorcy pokazują się automatycznie, gdy zostaną uzupełnione w konfiguracji. | `src/components/Footer.tsx` |
| Dane marki i przedsiębiorcy w jednym miejscu (`termsUrl` i `company` = `null`, czyli ukryte) | `src/config/business.ts` |
| GA4 usunięte z `index.html` – wcześniej ładowało się **przed jakąkolwiek zgodą** | `index.html` |
| GA4 ładuje się dopiero po kliknięciu „Akceptuję”; Consent Mode v2 domyślnie `denied`; po wycofaniu zgody GA jest wyłączane, a cookies `_ga*` usuwane | `src/lib/consent.ts` |
| Baner cookies: „Odrzucam” i „Akceptuję” równorzędne, bez blokowania strony, dostępny z klawiatury; ponowne otwarcie przez „Ustawienia cookies” w stopce | `src/components/CookieBanner.tsx`, `src/App.tsx` |
| Funkcja zapisu do newslettera odrzuca zapis bez poprawnego e-maila i daty zgody | `netlify/functions/subscribe.js` |

### Wyniki testów (Chrome, serwer lokalny)

1. Pierwsza wizyta: baner widoczny, **0 zapytań do Google Analytics, brak cookies `_ga`**.
2. „Odrzucam” + przeładowanie: baner nie wraca, GA się nie ładuje.
3. „Ustawienia cookies” w stopce otwiera baner i przenosi na niego fokus.
4. „Akceptuję”: ładuje się `gtag.js`, wysyłany jest `page_view`, powstają `_ga` i `_ga_FWB0VV9QW5`.
5. Wycofanie zgody: cookies `_ga*` są usuwane, nowe zdarzenia nie są wysyłane. Uwaga: zdarzenia zarejestrowane jeszcze **przed** wycofaniem (np. przewinięcie strony) GA może dosłać z opóźnieniem, z oznaczeniem zgody z chwili zdarzenia.
6. Linki w stopce: `mailto:`, Instagram i Facebook (nowa karta), Polityka Prywatności, link do strony głównej – działają. Menu „Kontakt” z podstrony prowadzi do stopki na stronie głównej.
7. `npm run build` – OK, brak błędów w konsoli.

---

## 2. Polityka prywatności – braki i niezgodności ze stanem faktycznym

Plik: `src/pages/PrivacyPolicy.tsx`. **Nie zmieniałem treści** – wymaga danych przedsiębiorcy i zatwierdzenia.

1. **Administrator nie jest zidentyfikowany.** „Mystic Aurora” to nazwa marki, nie podmiot prawny. Brakuje imienia i nazwiska lub nazwy firmy oraz adresu (art. 13 ust. 1 lit. a RODO). Markę tworzą dwie osoby – trzeba ustalić, kto jest administratorem (jedna osoba, współadministratorzy z art. 26 RODO czy spółka).
2. **Pkt 7 „Pliki cookies” jest nieprawdziwy.** Strona używa cookies Google Analytics (`_ga`, `_ga_FWB0VV9QW5`, ważne do 2 lat) – teraz po zgodzie. Strona zapisuje też wybór dotyczący cookies w pamięci przeglądarki (`ma-cookie-consent`, localStorage). Polityka powinna wymieniać cookies, cel, czas przechowywania i sposób zmiany wyboru.
3. **Pkt 2 „zbieramy wyłącznie adres e-mail” jest niepełny.** Przetwarzane są też: dane analityczne GA (identyfikatory online, informacje o urządzeniu i zachowaniu na stronie), logi serwera z adresami IP (Netlify – wspomniane w pkt 5, więc pkt 2 jest z nim sprzeczny), treść korespondencji e-mail, a w przyszłości dane zamówień.
4. **Brak Google jako odbiorcy danych** (Google Analytics).
5. **Brak informacji o przekazywaniu danych poza EOG** (Netlify, Google – USA) i podstawie przekazania, np. EU-US Data Privacy Framework lub standardowe klauzule umowne (art. 13 ust. 1 lit. f RODO).
6. **Brak części celów i podstaw prawnych:**
   - analityka – zgoda (art. 6 ust. 1 lit. a),
   - odpowiedzi na e-maile – prawnie uzasadniony interes (lit. f),
   - wysyłka darmowego materiału – do ustalenia (zgoda lub świadczenie usługi, lit. b),
   - sprzedaż – wykonanie umowy (lit. b) i obowiązki księgowe/podatkowe (lit. c),
   - ewentualne roszczenia – lit. f.
7. ~~**Google Fonts ładowane z serwerów Google**~~ – **rozwiązane 20.10.2026**: fonty (Cormorant Garamond, Outfit; latin + latin-ext) są hostowane lokalnie w `src/assets/fonts/`. Strona nie łączy się już z Google przed zgodą.
8. **Brak prawa sprzeciwu** (art. 21 RODO) – potrzebne, gdy podstawą jest uzasadniony interes.
9. **MailerLite mierzy otwarcia i kliknięcia w e-mailach** – warto o tym poinformować (śledzenie aktywności subskrybenta).
10. **Pkt 4 „usuwamy w ciągu 30 dni”** – sprawdzić, czy MailerLite rzeczywiście usuwa wypisane osoby (domyślnie przechowuje je jako „unsubscribed”). Albo zmienić praktykę, albo tekst.
11. **Data aktualizacji „czerwiec 2025”** – do zmiany przy aktualizacji.
12. **Brak linku do „Ustawień cookies” na stronie polityki** – strona polityki nie ma stopki. Do decyzji: dodać stopkę albo przycisk w pkt 7 po aktualizacji treści.
13. Numerologia: data urodzenia jest liczona **wyłącznie w przeglądarce** i nigdzie nie jest wysyłana – warto to napisać, bo użytkownicy mogą o to pytać.

---

## 3. Zgody newsletterowe – stan techniczny

**Działa dobrze:**
- Checkbox zgody nie jest domyślnie zaznaczony; bez niego przycisk jest nieaktywny.
- Data zgody jest zapisywana w MailerLite (pole `data_zgody_rodo`).
- Funkcja Netlify odrzuca teraz zapis bez daty zgody.

**Do poprawy lub decyzji:**
1. **Rozliczalność zgody** (art. 7 ust. 1 RODO): zapisywana jest tylko data. Warto zapisywać też źródło (który formularz) i wersję treści zgody, np. dodatkowe pola w MailerLite.
2. **Double opt-in** – sprawdzić w ustawieniach MailerLite, czy jest włączone (rekomendowane).
3. **Treść zgody łączy dwie rzeczy:** zgodę na newsletter i „akceptuję Politykę Prywatności”. Politykę można przyjąć do wiadomości, nie trzeba jej „akceptować”. Do przeformułowania z prawnikiem.
4. Komunikat o błędzie to systemowe okienko `alert()` – do zastąpienia komunikatem w formularzu.
5. **Formularz `/7-dni-powrotu-do-siebie` nie jest podłączony** (patrz `UWAGI.md`). Zgoda na newsletter jest tam osobna i opcjonalna – przy podłączaniu zapisywać do newslettera **tylko**, gdy jest zaznaczona.
6. Wysyłka newslettera to informacja handlowa – zgoda musi spełniać wymogi Prawa komunikacji elektronicznej (zgoda na marketing drogą elektroniczną). Do potwierdzenia z prawnikiem, czy obecna treść wystarcza.

---

## 4. GA4 – zalecenia konfiguracyjne (panel Google Analytics)

- Zaakceptować warunki przetwarzania danych (Data Processing Terms) w Administracja → Ustawienia konta.
- Wyłączyć Google Signals (personalizacja reklam), jeśli nie jest potrzebne.
- Ustawić krótszy okres przechowywania danych (np. 2 lub 14 miesięcy) i podać go w polityce.
- Opcjonalnie: przełączyć na Consent Mode „advanced”, jeśli chcesz modelowanych danych bez zgody – **wymaga to zmiany kodu i opisu w polityce**. Obecnie jest wariant „basic”: bez zgody nic nie jest wysyłane.

---

## 5. Brakujące dokumenty i informacje

| Dokument / element | Status | Kiedy potrzebny |
|---|---|---|
| Polityka prywatności – aktualizacja (pkt 2) | nieaktualna | teraz |
| Informacja o cookies (w polityce lub osobno) | brak | teraz |
| **Regulamin świadczenia usług drogą elektroniczną** (newsletter, darmowy materiał) | brak | teraz – newsletter i darmowy PDF to usługi drogą elektroniczną; regulamin jest wymagany niezależnie od sklepu |
| Dane przedsiębiorcy na stronie (nazwa, adres, NIP, e-mail) | brak | teraz / najpóźniej przed sprzedażą |
| Regulamin sklepu (zawieranie umowy, płatności, dostarczenie treści cyfrowej, reklamacje, odstąpienie) | brak | przed sprzedażą |
| Informacja o utracie prawa odstąpienia od umowy dla treści cyfrowych (PDF) + mechanizm zgody w zamówieniu | brak | przed sprzedażą |
| Procedura reklamacji (zgodność treści cyfrowej z umową) | brak | przed sprzedażą |
| Potwierdzenie zawarcia umowy na trwałym nośniku (e-mail z regulaminem) | brak | przed sprzedażą |
| Zastrzeżenie, że treści nie są poradą psychologiczną, medyczną ani terapeutyczną | brak | rekomendowane – pasuje do charakteru strony |

Uwaga do ODR: unijna platforma ODR została wyłączona w 2025 r. – do potwierdzenia z prawnikiem, jakie informacje o pozasądowym rozwiązywaniu sporów podać w regulaminie.

---

## 6. Dane potrzebne do uzupełnienia dokumentów

**Przedsiębiorca:**
- [ ] Forma prowadzenia sprzedaży: jednoosobowa działalność, spółka cywilna, działalność nierejestrowana?
- [ ] Pełna nazwa (imię i nazwisko / firma)
- [ ] Adres prowadzenia działalności (adres do korespondencji i reklamacji)
- [ ] NIP, REGON (jeśli są)
- [ ] Status VAT (czynny / zwolniony – wpływa na faktury i ceny)
- [ ] Telefon (opcjonalnie)
- [ ] Kto z dwóch osób jest administratorem danych / jak dzielicie odpowiedzialność

**Usługi i dane:**
- [ ] Czy darmowy materiał wysyła MailerLite (automatyzacja) i czy wymaga zapisu na listę?
- [ ] Rzeczywisty czas przechowywania danych subskrybentów po wypisaniu
- [ ] Okres przechowywania danych w GA4
- [ ] Narzędzia, które dojdą przy sklepie: bramka płatności, fakturowanie, hosting sklepu

**Sprzedaż (program 39 zł):**
- [ ] Cena brutto i czy obejmuje VAT
- [ ] Sposób dostarczenia (link do pobrania, e-mail), limit pobrań, ważność linku
- [ ] Metody płatności
- [ ] Adres produktu / sklepu

Pola w kodzie do wypełnienia po zatwierdzeniu: `src/config/business.ts` → `company`, `termsUrl`.

---

## 7. WooCommerce – elementy do późniejszej konfiguracji

> Obecna strona to aplikacja React na Netlify, **nie WordPress**. WooCommerce wymaga osobnej instalacji
> WordPressa (np. `sklep.mysticaurora.pl`) albo innego rozwiązania sprzedażowego. Do decyzji.

1. **Ustawienia sklepu:** adres przedsiębiorcy, kraj Polska, waluta PLN, ceny brutto.
2. **Podatki:** VAT lub zwolnienie, zgodnie ze statusem przedsiębiorcy.
3. **Produkt:** „wirtualny” + „do pobrania” (PDF), limit pobrań i czas ważności linku; plik w katalogu chronionym przed bezpośrednim dostępem.
4. **Checkout:**
   - obowiązkowy checkbox akceptacji regulaminu;
   - **obowiązkowy checkbox zgody na dostarczenie treści cyfrowej przed upływem terminu odstąpienia, z przyjęciem do wiadomości utraty prawa odstąpienia**;
   - przycisk „Zamawiam z obowiązkiem zapłaty” (lub równoważny, jednoznaczny);
   - osobny, **opcjonalny** checkbox newslettera.
5. **Strony WooCommerce:** Regulamin (Ustawienia → Zaawansowane → Strona regulaminu), Polityka prywatności (Ustawienia → Prywatność).
6. **E-maile transakcyjne:** potwierdzenie zamówienia z regulaminem i informacją o odstąpieniu/zgodzie (trwały nośnik), link do pobrania.
7. **Płatności:** bramka (np. Przelewy24, PayU, Stripe, BLIK) z umową powierzenia danych.
8. **Faktury / rachunki:** wtyczka do faktur, zgodna ze statusem VAT.
9. **Prywatność w WooCommerce:** retencja danych zamówień, zakup bez konta, eksport i usuwanie danych.
10. **Cookies na domenie sklepu:** osobny baner zgód (WordPress nie korzysta z banera tej strony), GA4 e-commerce z Consent Mode.
11. **Promocje:** przy obniżkach informacja o najniższej cenie z 30 dni (dyrektywa Omnibus).
12. **SSL, kopie zapasowe, aktualizacje** WordPressa i wtyczek.
13. Po uruchomieniu: dodać przycisk zakupu w sekcji „A jeśli zechcesz pójść dalej?” na `/7-dni-powrotu-do-siebie` i ustawić `termsUrl` w `src/config/business.ts`.
