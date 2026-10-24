import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, CircleAlert, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ThankYouState } from "@/config/free-material";

type Status = "idle" | "submitting" | "success" | "error";

interface FormData {
  email: string;
  newsletter: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// TODO: podłączyć wysyłkę (np. /.netlify/functions/subscribe). Na razie tylko symulacja.
// Po podłączeniu: przy sukcesie i zaznaczonym newsletterze wywołać trackNewsletterSignup("landing_free_material").
// Zwraca accepted: true dopiero, gdy backend potwierdzi przyjęcie zgłoszenia – wtedy formularz przechodzi na /dziekujemy.
// Błąd wysyłki = wyjątek (formularz pokazuje komunikat i zostawia wpisane dane).
const submitFreeMaterial = async (data: FormData): Promise<{ accepted: boolean }> => {
  void data;
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { accepted: false };
};

const validateEmail = (value: string): string | null => {
  const email = value.trim();
  if (!email) return "Wpisz adres e-mail, na który mamy wysłać materiał.";
  if (!email.includes("@")) return "W adresie e-mail brakuje znaku „@”, np. imie@domena.pl.";
  if (!EMAIL_PATTERN.test(email)) return "Ten adres wygląda na niepełny. Sprawdź, czy ma format imie@domena.pl.";
  return null;
};

// komunikat błędu bezpośrednio pod polem: ikona + tekst, bez tła i ramki
const FieldError = ({ id, children, role }: { id: string; children: React.ReactNode; role?: "alert" }) => (
  <p id={id} role={role} className="mt-2 flex items-start gap-2 text-[0.9375rem] font-medium text-red-200 leading-snug">
    <CircleAlert className="w-[18px] h-[18px] mt-px shrink-0 text-red-300" aria-hidden="true" />
    <span>{children}</span>
  </p>
);

const checkboxClass =
  "mt-[3px] h-6 w-6 shrink-0 rounded-[5px] border-2 border-white/75 bg-white/[0.08] data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-accent-foreground [&_svg]:h-4 [&_svg]:w-4 focus-visible:ring-accent focus-visible:ring-offset-[#2d2439]";

const FreeMaterialForm = forwardRef<HTMLInputElement>((_, ref) => {
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);
  const privacyRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  // blokada wielokrotnego wysłania (np. szybki podwójny Enter, zanim przycisk zdąży się wyłączyć)
  const submittingRef = useRef(false);
  useImperativeHandle(ref, () => emailInputRef.current!);

  const emailError = validateEmail(email);
  const privacyError = privacyAccepted ? null : "Zaznacz tę zgodę, abyśmy mogli wysłać Ci materiał.";

  // błąd e-maila pokazujemy po opuszczeniu pola lub próbie wysłania; błąd zgody – dopiero po próbie wysłania
  const showEmailError = (emailTouched || submitAttempted) && !!emailError;
  const showPrivacyError = submitAttempted && !!privacyError;

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setSubmitAttempted(true);

    if (emailError || privacyError) {
      const count = [emailError, privacyError].filter(Boolean).length;
      setAnnouncement(count > 1 ? "Formularz zawiera 2 błędy." : "Formularz zawiera 1 błąd.");
      if (emailError) emailInputRef.current?.focus();
      else privacyRef.current?.focus();
      return;
    }

    submittingRef.current = true;
    setAnnouncement("Wysyłanie formularza…");
    setStatus("submitting");
    try {
      // sukces pokazujemy dopiero po odpowiedzi wysyłki; wpisany adres zostaje w polu przy błędzie
      const result = await submitFreeMaterial({ email: email.trim(), newsletter });
      if (result.accepted) {
        // zgłoszenie przyjęte przez backend → strona podziękowania (bez stanu nie da się na nią wejść)
        navigate("/dziekujemy", { state: { submitted: true } satisfies ThankYouState });
        return;
      }
      // symulacja (brak podłączonej wysyłki): dotychczasowy komunikat w miejscu formularza
      setAnnouncement("");
      setStatus("success");
    } catch {
      setAnnouncement("");
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-4 sm:py-6">
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="text-2xl font-heading text-foreground mb-3 outline-none">
          Dziękujemy!
        </h3>
        <p className="text-lg text-foreground/85 leading-relaxed">Formularz został wysłany.</p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="flex flex-col gap-5 md:gap-6 text-left">
      {/* komunikaty dla czytników ekranu (podsumowanie błędów, stan wysyłania) */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <div>
        <label htmlFor="free-material-email" className="block text-base font-medium text-foreground mb-2">
          Adres e-mail <span className="text-foreground/80 font-normal text-sm">(wymagane)</span>
        </label>
        <div className="relative group">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/75 group-focus-within:text-accent transition-colors duration-300"
            aria-hidden="true"
          />
          <Input
            ref={emailInputRef}
            id="free-material-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="np. imie@domena.pl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => email.trim() && setEmailTouched(true)}
            required
            aria-required="true"
            aria-invalid={showEmailError}
            aria-describedby={showEmailError ? "free-material-email-error" : undefined}
            disabled={isSubmitting}
            className={cn(
              "pl-12 h-14 md:h-16 text-[1.0625rem] md:text-lg rounded-xl bg-white/[0.11] border-2 border-white/45 placeholder:text-foreground/65 focus:border-accent focus:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-0 transition-colors duration-200",
              showEmailError && "border-red-400 focus:border-red-400 focus-visible:ring-red-400/40",
            )}
          />
        </div>
        {showEmailError && <FieldError id="free-material-email-error">{emailError}</FieldError>}
      </div>

      <fieldset className="space-y-4">
        <legend className="sr-only">Zgody</legend>

        <div>
          <div className="flex items-start gap-4">
            <Checkbox
              ref={privacyRef}
              id="free-material-privacy"
              checked={privacyAccepted}
              onCheckedChange={(val) => setPrivacyAccepted(val === true)}
              aria-required="true"
              aria-invalid={showPrivacyError}
              aria-describedby={showPrivacyError ? "free-material-privacy-error" : undefined}
              disabled={isSubmitting}
              className={cn(checkboxClass, showPrivacyError && "border-red-400/80")}
            />
            <label
              htmlFor="free-material-privacy"
              className="text-base text-foreground leading-relaxed cursor-pointer select-none"
            >
              Chcę otrzymać bezpłatny materiał PDF na podany adres e-mail i akceptuję{" "}
              <Link to="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-accent transition-colors">
                Politykę Prywatności
              </Link>
              . <span className="text-foreground/75 text-sm">(wymagane)</span>
            </label>
          </div>
          {showPrivacyError && (
            <div className="ml-10">
              <FieldError id="free-material-privacy-error">{privacyError}</FieldError>
            </div>
          )}
        </div>

        <div className="flex items-start gap-4 border-t border-white/10 pt-4">
          <Checkbox
            id="free-material-newsletter"
            checked={newsletter}
            onCheckedChange={(val) => setNewsletter(val === true)}
            disabled={isSubmitting}
            className={checkboxClass}
          />
          <label
            htmlFor="free-material-newsletter"
            className="text-base text-foreground leading-relaxed cursor-pointer select-none"
          >
            Chcę też otrzymywać newsletter Mystic Aurora z inspiracjami i informacjami o nowych materiałach.{" "}
            <span className="text-foreground/75 text-sm">(opcjonalnie)</span>
          </label>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2.5">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          // bez tego wciśnięcie przycisku zdejmuje fokus z pola e-mail, pojawia się komunikat błędu, przycisk
          // przesuwa się w dół i kliknięcie „przepada” – formularz się nie wysyła. Klawiatura działa bez zmian.
          onMouseDown={(e) => e.preventDefault()}
          className="w-full min-h-[3.75rem] h-auto py-3 px-6 bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground text-lg font-semibold rounded-xl shadow-[0_12px_30px_-8px_hsl(42_85%_55%/0.6)] hover:shadow-[0_16px_40px_-8px_hsl(42_85%_55%/0.75)] hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0 transition-all duration-200 whitespace-normal focus-visible:ring-accent focus-visible:ring-offset-[#2d2439]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Wysyłanie…
            </>
          ) : (
            "Wyślij mi darmowy PDF"
          )}
        </Button>


        {status === "error" && (
          <FieldError id="free-material-submit-error" role="alert">
            Nie udało się wysłać formularza. Spróbuj ponownie za chwilę.
          </FieldError>
        )}
      </div>

      <div className="text-sm text-foreground/80 leading-relaxed text-center sm:text-left">
        <p>
          Adres e-mail wykorzystamy do wysłania materiału{newsletter ? " i newslettera" : ""}. Z newslettera możesz
          wypisać się w każdej chwili. Szczegóły znajdziesz w{" "}
          <Link to="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-accent transition-colors">
            Polityce Prywatności
          </Link>
          .
        </p>
      </div>
    </form>
  );
});

FreeMaterialForm.displayName = "FreeMaterialForm";

export default FreeMaterialForm;
