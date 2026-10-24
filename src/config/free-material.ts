// Ustawienia zapisu po bezpłatny pierwszy dzień programu (formularz na /7-dni-powrotu-do-siebie i strona /dziekujemy).

// Czy nowy kontakt musi najpierw potwierdzić adres e-mail (double opt-in w MailerLite), zanim dostanie PDF.
// Ustaw zgodnie z konfiguracją MailerLite (Ustawienia konta → double opt-in dla API/integracji):
// true  – strona podziękowania prosi o kliknięcie linku potwierdzającego w wiadomości,
// false – strona podziękowania informuje tylko o wiadomości w skrzynce.
export const FREE_MATERIAL_REQUIRES_CONFIRMATION = false;

// Stan przekazywany z formularza do /dziekujemy. Strona podziękowania bez niego przekierowuje na landing,
// więc nie da się na nią trafić bez przyjętego zgłoszenia (np. z wyszukiwarki lub wpisując adres).
export interface ThankYouState {
  submitted: true;
}
