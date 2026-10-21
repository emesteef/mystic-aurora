import { Link, useLocation, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";
import { BUSINESS } from "@/config/business";
import { openCookieSettings } from "@/lib/consent";
import { scrollToSection } from "@/lib/scroll";

// Tło stopki: ciemna śliwka, minimalnie jaśniejsza od tła strony – stopka oddziela się bez poświat i kart
const FOOTER_BG = "#18111e";

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-[#18111e]";
const navLinkClass = `text-[0.9375rem] text-foreground/85 hover:text-accent transition-colors duration-200 ${focusRing}`;
const legalLinkClass = `text-sm text-foreground/70 hover:text-accent transition-colors duration-200 ${focusRing}`;
const socialClass =
  "inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-foreground/80 hover:text-accent hover:border-accent/60 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#18111e]";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { company } = BUSINESS;

  // jak w nawigacji: na stronie głównej płynne przewinięcie, z innych podstron przejście do /#sekcja
  const goToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToSection(id);
      window.history.replaceState(null, "", `#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  };

  const goHome = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
    }
  };

  return (
    // id="kontakt" – do stopki prowadzi pozycja „Kontakt” w menu
    <footer id="kontakt" className="relative px-6 scroll-mt-20" style={{ backgroundColor: FOOTER_BG }}>
      {/* subtelna linia w kolorze przygaszonego złota */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto pt-10 pb-6 md:pt-14 md:pb-8">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] md:gap-12 md:items-start">
          <div>
            <p className="font-heading text-xl md:text-2xl text-foreground leading-snug">Odkrywaj we własnym tempie.</p>
            <p className="mt-2 max-w-sm text-[0.9375rem] text-foreground/70 leading-relaxed">
              Przestrzeń na refleksję, intuicję i&nbsp;świadome&nbsp;wybory.
            </p>
          </div>

          <nav aria-label="Stopka">
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2.5">
              <li>
                <Link to="/" onClick={goHome} className={navLinkClass}>
                  Strona główna
                </Link>
              </li>
              <li>
                <a href="/#produkty" onClick={(e) => goToSection(e, "produkty")} className={navLinkClass}>
                  Produkty
                </a>
              </li>
              <li>
                <Link to="/7-dni-powrotu-do-siebie" className={navLinkClass}>
                  Darmowy materiał
                </Link>
              </li>
              {BUSINESS.email && (
                <li>
                  <a href={`mailto:${BUSINESS.email}`} className={navLinkClass}>
                    Kontakt
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <ul className="flex items-center gap-3" aria-label="Media społecznościowe i e-mail">
            <li>
              <a href={BUSINESS.instagram.url} target="_blank" rel="noopener noreferrer" className={socialClass}>
                <Instagram className="w-[18px] h-[18px]" aria-hidden="true" />
                <span className="sr-only">Instagram {BUSINESS.instagram.label} (otwiera się w nowej karcie)</span>
              </a>
            </li>
            <li>
              <a href={BUSINESS.facebook.url} target="_blank" rel="noopener noreferrer" className={socialClass}>
                <Facebook className="w-[18px] h-[18px]" aria-hidden="true" />
                <span className="sr-only">Facebook (otwiera się w nowej karcie)</span>
              </a>
            </li>
            {BUSINESS.email && (
              <li>
                <a href={`mailto:${BUSINESS.email}`} className={socialClass}>
                  <Mail className="w-[18px] h-[18px]" aria-hidden="true" />
                  <span className="sr-only">Napisz e-mail: {BUSINESS.email}</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="mt-8 md:mt-12 pt-5 border-t border-white/10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-foreground/65">
            <p>
              © {new Date().getFullYear()} {BUSINESS.brandName}
            </p>
            {company && (
              <address className="mt-1 not-italic text-xs text-foreground/60 leading-relaxed">
                {company.legalName}, {company.address}, NIP: {company.nip}
                {company.regon && <>, REGON: {company.regon}</>}
              </address>
            )}
          </div>

          <nav aria-label="Informacje prawne">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <li>
                <Link to={BUSINESS.privacyPolicyPath} className={legalLinkClass}>
                  Polityka prywatności
                </Link>
              </li>
              {BUSINESS.termsUrl && (
                <li>
                  <a href={BUSINESS.termsUrl} className={legalLinkClass}>
                    Regulamin sklepu
                  </a>
                </li>
              )}
              <li>
                <button type="button" onClick={openCookieSettings} className={legalLinkClass}>
                  Ustawienia cookies
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
