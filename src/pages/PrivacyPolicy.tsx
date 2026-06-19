import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do strony głównej
        </Link>

        <h1 className="text-4xl md:text-5xl font-heading font-light mb-3">
          Polityka Prywatności
        </h1>
        <p className="text-muted-foreground text-sm mb-12">
          Ostatnia aktualizacja: czerwiec 2025
        </p>

        <div className="space-y-10 text-foreground/80 leading-relaxed">

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">1. Administrator danych osobowych</h2>
            <p>
              Administratorem Twoich danych osobowych jest Mystic Aurora, prowadząca działalność pod adresem
              strony internetowej <span className="text-accent">mysticaurora.pl</span>, kontakt:{" "}
              <a href="mailto:kontakt@mysticaurora.pl" className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
                kontakt@mysticaurora.pl
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">2. Jakie dane zbieramy</h2>
            <p>
              Zbieramy wyłącznie adres e-mail podany dobrowolnie przez użytkownika w formularzu zapisu do newslettera.
              Nie zbieramy żadnych innych danych osobowych, takich jak imię, nazwisko, adres zamieszkania ani numer telefonu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">3. Cel i podstawa prawna przetwarzania</h2>
            <p>
              Twój adres e-mail przetwarzamy w celu wysyłania newslettera Mystic Aurora — inspiracji, wskazówek
              i materiałów dotyczących rozwoju osobistego.
            </p>
            <p className="mt-3">
              Podstawą prawną przetwarzania jest Twoja dobrowolna zgoda (art. 6 ust. 1 lit. a RODO),
              wyrażona poprzez zaznaczenie checkboxa w formularzu zapisu. Masz prawo wycofać zgodę w dowolnym momencie,
              co nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej wycofaniem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">4. Jak długo przechowujemy dane</h2>
            <p>
              Przechowujemy Twój adres e-mail do momentu wypisania się z newslettera lub wycofania zgody.
              Po wypisaniu się dane są usuwane z naszej bazy w ciągu 30 dni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">5. Przekazywanie danych podmiotom trzecim</h2>
            <p>
              Korzystamy z następujących podmiotów zewnętrznych, które mogą mieć dostęp do Twojego adresu e-mail:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              <li className="flex gap-3">
                <span className="text-accent mt-1">—</span>
                <span>
                  <strong className="text-foreground">MailerLite</strong> (UAB "MailerLite", Wilno, Litwa) — platforma do
                  wysyłki newslettera. MailerLite przetwarza dane zgodnie z RODO i posiada standardowe klauzule umowne.
                  Więcej informacji:{" "}
                  <a href="https://www.mailerlite.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
                    mailerlite.com/legal/privacy-policy
                  </a>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-1">—</span>
                <span>
                  <strong className="text-foreground">Netlify</strong> (Netlify, Inc., San Francisco, USA) — hosting strony
                  internetowej. Netlify może przetwarzać logi dostępu zawierające adresy IP. Więcej informacji:{" "}
                  <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
                    netlify.com/privacy
                  </a>.
                </span>
              </li>
            </ul>
            <p className="mt-3">
              Nie sprzedajemy ani nie udostępniamy Twoich danych żadnym innym podmiotom trzecim w celach marketingowych.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">6. Twoje prawa</h2>
            <p>Na podstawie RODO przysługują Ci następujące prawa:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Prawo dostępu do swoich danych oraz otrzymania ich kopii",
                "Prawo do sprostowania (poprawienia) danych",
                "Prawo do usunięcia danych (prawo do bycia zapomnianym)",
                "Prawo do ograniczenia przetwarzania danych",
                "Prawo do przenoszenia danych",
                "Prawo do wycofania zgody w dowolnym momencie (bez wpływu na legalność wcześniejszego przetwarzania)",
                "Prawo do wniesienia skargi do organu nadzorczego — Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa",
              ].map((right) => (
                <li key={right} className="flex gap-3">
                  <span className="text-accent mt-1 shrink-0">—</span>
                  <span>{right}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Aby skorzystać ze swoich praw, napisz na adres:{" "}
              <a href="mailto:kontakt@mysticaurora.pl" className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
                kontakt@mysticaurora.pl
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">7. Pliki cookies</h2>
            <p>
              Strona mysticaurora.pl nie używa własnych plików cookies w celach śledzenia ani marketingu.
              Pliki cookies mogą być ustawiane przez zewnętrznych dostawców (Netlify) wyłącznie w celach technicznych,
              niezbędnych do prawidłowego działania strony.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">8. Bezpieczeństwo danych</h2>
            <p>
              Stosujemy odpowiednie środki techniczne i organizacyjne, aby chronić Twoje dane przed nieuprawnionym
              dostępem, utratą lub zniszczeniem. Transmisja danych odbywa się przez szyfrowane połączenie HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">9. Wypisanie z newslettera</h2>
            <p>
              Możesz wypisać się z newslettera w dowolnym momencie, klikając link "Wypisz się" znajdujący się
              w każdej wiadomości e-mail lub kontaktując się z nami bezpośrednio na adres{" "}
              <a href="mailto:kontakt@mysticaurora.pl" className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
                kontakt@mysticaurora.pl
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-light text-foreground mb-3">10. Zmiany polityki prywatności</h2>
            <p>
              Zastrzegamy sobie prawo do zmiany niniejszej polityki prywatności. O wszelkich istotnych zmianach
              poinformujemy poprzez aktualizację daty na górze tej strony. Zachęcamy do jej regularnego przeglądania.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mystic Aurora. Wszelkie prawa zastrzeżone.
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
