import { Link, useLocation, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";
import { BUSINESS } from "@/config/business";
import { openCookieSettings } from "@/lib/consent";
import { scrollToSection } from "@/lib/scroll";

// Tło stopki: ciemna śliwka, minimalnie jaśniejsza od tła strony – stopka oddziela się bez poświat i kart
const FOOTER_BG = "#18111e";

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-[#18111e]";
// telefon: 14 px i py-1.5 (wygodny obszar dotyku bez zwiększania odstępów); od md: 15 px
const navLinkClass = `inline-block py-1.5 md:py-0 text-sm md:text-[0.9375rem] text-foreground/85 hover:text-accent transition-colors duration-200 ${focusRing}`;
const legalLinkClass = `inline-block py-1 text-sm text-foreground/70 hover:text-accent transition-colors duration-200 ${focusRing}`;
// telefon: 44 px (cel dotyku), od md: 40 px; jaśniejsza ramka i ikona dla lepszego kontrastu
const socialClass =
  "inline-flex items-center justify-center w-11 h-11 md:w-10 md:h-10 rounded-full border border-white/30 bg-white/[0.04] text-foreground/90 hover:text-accent hover:border-accent/60 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#18111e]";

const GoldLine = () => (
  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" aria-hidden="true" />
);

const Copyright = () => {
  const { company } = BUSINESS;
  return (
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
  );
};

// Polityka prywatności, regulamin (gdy jest adres) i ustawienia cookies; opcjonalnie e-mail kontaktowy
const LegalLinks = ({ withContact = false }: { withContact?: boolean }) => (
  <nav aria-label="Informacje prawne">
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
      {withContact && BUSINESS.email && (
        <li>
          <a href={`mailto:${BUSINESS.email}`} className={legalLinkClass}>
            <span className="sr-only">Kontakt: </span>
            {BUSINESS.email}
          </a>
        </li>
      )}
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
);

// variant="minimal" – landing: tylko copyright, kontakt i linki prawne (bez hasła, nawigacji i social mediów)
const Footer = ({ variant = "full" }: { variant?: "full" | "minimal" }) => {
  const location = useLocation();
  const navigate = useNavigate();

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

  if (variant === "minimal") {
    return (
      <footer id="kontakt" className="relative px-6 scroll-mt-20" style={{ backgroundColor: FOOTER_BG }}>
        <GoldLine />
        <div className="max-w-6xl mx-auto py-6 md:py-7 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
          <Copyright />
          <LegalLinks withContact />
        </div>
      </footer>
    );
  }

  return (
    // id="kontakt" – do stopki prowadzi pozycja „Kontakt” w menu
    <footer id="kontakt" className="relative px-6 scroll-mt-20" style={{ backgroundColor: FOOTER_BG }}>
      <GoldLine />

      <div className="max-w-6xl mx-auto pt-8 pb-5 md:pt-14 md:pb-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] md:gap-12 md:items-start">
          <div>
            <p className="font-heading text-xl md:text-2xl text-foreground leading-snug">Odkrywaj we własnym tempie.</p>
            <p className="mt-1.5 md:mt-2 max-w-sm text-[0.9375rem] text-foreground/70 leading-relaxed">
              Przestrzeń na refleksję, intuicję i&nbsp;świadome&nbsp;wybory.
            </p>
          </div>

          <nav aria-label="Stopka">
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-0.5 md:gap-y-2.5">
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

        <div className="mt-6 md:mt-12 pt-4 md:pt-5 border-t border-white/10 flex flex-col-reverse gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Copyright />
          <LegalLinks />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
