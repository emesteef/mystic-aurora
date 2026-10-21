import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";
import mysticLogo from "@/assets/mystic-aurora-logo-v2.png";
import { BUSINESS } from "@/config/business";
import { openCookieSettings } from "@/lib/consent";

const Footer = () => {
  const linkClass = "hover:text-accent transition-colors";
  const contactClass = "inline-flex items-center gap-2 text-foreground/80 hover:text-accent transition-colors";
  const { company } = BUSINESS;

  return (
    <footer id="kontakt" className="relative px-6 pt-16 pb-10 bg-gradient-to-t from-card/30 to-transparent scroll-mt-20">
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-8 group" aria-label="Mystic Aurora – strona główna">
          <img src={mysticLogo} alt="" className="w-12 h-12 rounded-full object-contain" />
          <span className="text-2xl font-heading font-light text-foreground group-hover:text-accent transition-colors">
            {BUSINESS.brandName}
          </span>
        </Link>

        <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground mb-4">Kontakt</h2>
        <p className="text-muted-foreground mb-8">Masz pytanie? Napisz do nas.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12">
          <a href={`mailto:${BUSINESS.email}`} className={contactClass}>
            <Mail className="w-5 h-5 text-accent" aria-hidden="true" />
            {BUSINESS.email}
          </a>
          <a href={BUSINESS.instagram.url} target="_blank" rel="noopener noreferrer" className={contactClass}>
            <Instagram className="w-5 h-5 text-accent" aria-hidden="true" />
            <span>
              {BUSINESS.instagram.label}
              <span className="sr-only"> (Instagram, otwiera się w nowej karcie)</span>
            </span>
          </a>
          <a href={BUSINESS.facebook.url} target="_blank" rel="noopener noreferrer" className={contactClass}>
            <Facebook className="w-5 h-5 text-accent" aria-hidden="true" />
            <span>
              {BUSINESS.facebook.label}
              <span className="sr-only"> (Facebook, otwiera się w nowej karcie)</span>
            </span>
          </a>
        </div>

        <nav aria-label="Informacje prawne" className="mb-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground [&_a]:inline-block [&_a]:py-1 [&_button]:py-1">
            <li>
              <Link to={BUSINESS.privacyPolicyPath} className={linkClass}>
                Polityka Prywatności
              </Link>
            </li>
            {BUSINESS.termsUrl && (
              <li>
                <a href={BUSINESS.termsUrl} className={linkClass}>
                  Regulamin sklepu
                </a>
              </li>
            )}
            <li>
              <button type="button" onClick={openCookieSettings} className={linkClass}>
                Ustawienia cookies
              </button>
            </li>
          </ul>
        </nav>

        {company && (
          <address className="not-italic text-xs text-muted-foreground/70 leading-relaxed mb-4">
            {company.legalName}, {company.address}
            <br />
            NIP: {company.nip}
            {company.regon && <>, REGON: {company.regon}</>}
          </address>
        )}

        <p className="text-sm text-muted-foreground/70">
          © {new Date().getFullYear()} {BUSINESS.brandName}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
