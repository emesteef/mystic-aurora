import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OPEN_COOKIE_SETTINGS_EVENT, applyStoredConsent, getConsent, saveConsent } from "@/lib/consent";
import { BUSINESS } from "@/config/business";

const CookieBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<boolean | null>(null);
  const [focusRequested, setFocusRequested] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    applyStoredConsent();
    const stored = getConsent();
    setCurrent(stored ? stored.analytics : null);
    if (!stored) setIsOpen(true);

    const open = () => {
      setCurrent(getConsent()?.analytics ?? null);
      setIsOpen(true);
      setFocusRequested(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
  }, []);

  // po otwarciu ze stopki przenosimy fokus do banera (obsługa klawiaturą)
  useEffect(() => {
    if (isOpen && focusRequested) {
      headingRef.current?.focus();
      setFocusRequested(false);
    }
  }, [isOpen, focusRequested]);

  if (!isOpen) return null;

  const choose = (analytics: boolean) => {
    saveConsent(analytics);
    setCurrent(analytics);
    setIsOpen(false);
  };

  const buttonClass = "h-11 px-6 rounded-xl font-body whitespace-normal";

  return (
    <div
      role="region"
      aria-labelledby="cookie-banner-heading"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-card/95 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/40">
        <h2
          id="cookie-banner-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-heading text-foreground mb-2 outline-none"
        >
          Pliki cookies
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Za Twoją zgodą używamy Google Analytics, żeby zobaczyć, jak korzystasz ze strony. Bez zgody nie włączamy
          żadnych analitycznych plików cookies. Wybór możesz zmienić w każdej chwili w stopce strony („Ustawienia
          cookies”). Więcej w{" "}
          <Link to={BUSINESS.privacyPolicyPath} className="underline underline-offset-2 hover:text-accent">
            Polityce Prywatności
          </Link>
          .
        </p>
        {current !== null && (
          <p className="mt-2 text-sm text-foreground/80">
            Obecny wybór: {current ? "analityka włączona" : "analityka wyłączona"}.
          </p>
        )}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button variant="hero" onClick={() => choose(false)} className={buttonClass}>
            Odrzucam
          </Button>
          <Button variant="hero" onClick={() => choose(true)} className={buttonClass}>
            Akceptuję
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
