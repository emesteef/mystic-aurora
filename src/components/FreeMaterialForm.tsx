import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, CircleAlert, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

interface FormData {
  email: string;
  newsletter: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// TODO: podłączyć wysyłkę (np. /.netlify/functions/subscribe). Na razie tylko symulacja.
// Po podłączeniu: przy sukcesie i zaznaczonym newsletterze wywołać trackNewsletterSignup("landing_free_material").
const submitFreeMaterial = async (data: FormData): Promise<void> => {
  void data;
  await new Promise((resolve) => setTimeout(resolve, 800));
};

const validateEmail = (value: string): string | null => {
  const email = value.trim();
  if (!email) return "Wpisz adres e-mail, na który mamy wysłać materiał.";
  if (!email.includes("@")) return "W adresie e-mail brakuje znaku „@”, np. imie@domena.pl.";
  if (!EMAIL_PATTERN.test(email)) return "Ten adres wygląda na niepełny. Sprawdź, czy ma format imie@domena.pl.";
  return null;
};

const FieldError = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-red-300">
    <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
    <span>{children}</span>
  </p>
);

const checkboxClass =
  "mt-0.5 h-6 w-6 rounded-[5px] border-2 border-white/55 bg-white/[0.04] data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-accent-foreground [&_svg]:h-4 [&_svg]:w-4 focus-visible:ring-accent focus-visible:ring-offset-[#2a2134]";

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
    setSubmitAttempted(true);

    if (emailError || privacyError) {
      const count = [emailError, privacyError].filter(Boolean).length;
      setAnnouncement(count > 1 ? "Formularz zawiera 2 błędy." : "Formularz zawiera 1 błąd.");
      if (emailError) emailInputRef.current?.focus();
      else privacyRef.current?.focus();
      return;
    }

    setAnnouncement("Wysyłanie formularza…");
    setStatus("submitting");
    try {
      await submitFreeMaterial({ email: email.trim(), newsletter });
      setAnnouncement("");
      setStatus("success");
    } catch {
      setAnnouncement("Nie udało się wysłać formularza.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-4 sm:py-6">
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="text-2xl font-heading text-foreground mb-3 outline-none">
          Dziękujemy!
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Materiał wyślemy na adres <span className="text-foreground break-all">{email.trim()}</span>. Sprawdź swoją
          skrzynkę, także folder „Oferty” lub „Spam”.
        </p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="flex flex-col gap-6 text-left">
      {/* komunikaty dla czytników ekranu (podsumowanie błędów, stan wysyłania) */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <div>
        <label htmlFor="free-material-email" className="block text-base font-medium text-foreground mb-2">
          Adres e-mail <span className="text-foreground/70 font-normal text-sm">(wymagane)</span>
        </label>
        <div className="relative group">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60 group-focus-within:text-accent transition-colors duration-300"
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
              "pl-12 h-14 text-base md:text-lg rounded-xl bg-white/[0.08] border-white/30 placeholder:text-foreground/50 focus:border-accent focus:bg-white/[0.1] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-0 transition-colors duration-200",
              showEmailError && "border-red-400/70 focus:border-red-400",
            )}
          />
        </div>
        {showEmailError && <FieldError id="free-material-email-error">{emailError}</FieldError>}
      </div>

      <fieldset className="space-y-5">
        <legend className="sr-only">Zgody</legend>

        <div>
          <div className="flex items-start gap-3.5">
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
              className="text-[0.9375rem] text-foreground/90 leading-relaxed cursor-pointer"
            >
              Chcę otrzymać bezpłatny materiał PDF na podany adres e-mail i akceptuję{" "}
              <Link to="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-accent transition-colors">
                Politykę Prywatności
              </Link>
              . <span className="text-foreground/65 text-sm">(wymagane)</span>
            </label>
          </div>
          {showPrivacyError && (
            <div className="ml-[2.375rem]">
              <FieldError id="free-material-privacy-error">{privacyError}</FieldError>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3.5">
          <Checkbox
            id="free-material-newsletter"
            checked={newsletter}
            onCheckedChange={(val) => setNewsletter(val === true)}
            disabled={isSubmitting}
            className={checkboxClass}
          />
          <label
            htmlFor="free-material-newsletter"
            className="text-[0.9375rem] text-foreground/90 leading-relaxed cursor-pointer"
          >
            Chcę też otrzymywać newsletter Mystic Aurora z inspiracjami i informacjami o nowych materiałach.{" "}
            <span className="text-foreground/65 text-sm">(opcjonalnie)</span>
          </label>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2.5">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full min-h-[3.75rem] h-auto py-3 px-6 bg-gradient-to-r from-accent to-amber-500 hover:from-accent/90 hover:to-amber-500/90 text-accent-foreground text-lg font-semibold rounded-xl shadow-[0_12px_30px_-8px_hsl(42_85%_55%/0.6)] hover:shadow-[0_16px_40px_-8px_hsl(42_85%_55%/0.75)] hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0 transition-all duration-200 whitespace-normal focus-visible:ring-accent focus-visible:ring-offset-[#2a2134]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Wysyłanie…
            </>
          ) : (
            "Wyślij mi pierwszy dzień"
          )}
        </Button>

        <p className="text-center text-sm text-foreground/80">Materiał PDF otrzymasz na podany adres e-mail.</p>

        {status === "error" && (
          <FieldError id="free-material-submit-error">
            Nie udało się wysłać formularza. Spróbuj ponownie za chwilę.
          </FieldError>
        )}
      </div>

      <div className="flex items-start gap-3 border-t border-white/10 pt-5 text-sm text-foreground/75 leading-relaxed">
        <Lock className="w-4 h-4 mt-1 shrink-0 text-accent" aria-hidden="true" />
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
