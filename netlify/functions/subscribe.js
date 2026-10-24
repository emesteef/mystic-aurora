// Zapis po bezpłatny pierwszy dzień programu „7 dni, żeby wrócić do siebie” (formularz na /7-dni-powrotu-do-siebie).
//
// Zasady:
// - zawsze grupa FREE_7_DAYS (z nią powiązana jest automatyzacja MailerLite wysyłająca PDF),
// - grupa NEWSLETTER tylko przy świadomie zaznaczonej zgodzie (newsletter === true),
// - FREE_MEDITATION nie jest tu używana,
// - istniejący kontakt jest aktualizowany, nie duplikowany; MailerLite tylko DODAJE grupy (nie usuwa pominiętych),
// - nie wysyłamy pola status ani resubscribe, więc osoba wypisana nie zostanie zapisana ponownie,
// - do logów trafiają tylko kody błędów – bez adresów e-mail, treści odpowiedzi MailerLite i klucza API.

const MAILERLITE_URL = "https://connect.mailerlite.com/api/subscribers";
const TIMEOUT_MS = 8000;
const MAX_BODY_BYTES = 2048;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUIRED_ENV = ["MAILERLITE_API_KEY", "MAILERLITE_GROUP_FREE_7_DAYS", "MAILERLITE_GROUP_NEWSLETTER"];

const json = (statusCode, body) => ({
    statusCode,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    body: JSON.stringify(body),
});

const isValidEmail = (value) => typeof value === "string" && value.length <= 254 && EMAIL_PATTERN.test(value);

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        const res = json(405, { ok: false, error: "method_not_allowed" });
        return { ...res, headers: { ...res.headers, Allow: "POST" } };
    }

    const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
    if (missing.length) {
        // tylko nazwy zmiennych, bez wartości
        console.error("subscribe: brak konfiguracji:", missing.join(", "));
        return json(500, { ok: false, error: "server_error" });
    }

    if (!event.body || event.body.length > MAX_BODY_BYTES) {
        return json(400, { ok: false, error: "invalid_request" });
    }

    let data;
    try {
        data = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body);
    } catch {
        return json(400, { ok: false, error: "invalid_request" });
    }
    if (!data || typeof data !== "object" || data.source !== "free_7_days") {
        return json(400, { ok: false, error: "invalid_request" });
    }

    const email = typeof data.email === "string" ? data.email.trim() : "";
    if (!isValidEmail(email)) {
        return json(400, { ok: false, error: "invalid_email" });
    }

    // zgoda na newsletter tylko przy jawnym true (nie "true", nie 1) i z datą wyrażenia zgody
    const newsletter = data.newsletter === true;
    const consentDate =
        newsletter && typeof data.consented_at === "string" && !Number.isNaN(Date.parse(data.consented_at))
            ? new Date(data.consented_at).toISOString().substring(0, 10) // pole daty w MailerLite: „YYYY-MM-DD”
            : null;
    if (newsletter && !consentDate) {
        return json(400, { ok: false, error: "invalid_request" });
    }

    const groups = [process.env.MAILERLITE_GROUP_FREE_7_DAYS];
    if (newsletter) groups.push(process.env.MAILERLITE_GROUP_NEWSLETTER);

    // bez status i resubscribe: nowy kontakt dostaje domyślny status konta, istniejący zachowuje swój
    // (w tym „unsubscribed”); data zgody tylko przy zgodzie – pominięte pole nie kasuje wcześniejszej wartości
    const payload = { email, groups, ...(consentDate && { fields: { data_zgody_rodo: consentDate } }) };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(MAILERLITE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        if (res.ok) {
            // 201 – nowy kontakt, 200 – zaktualizowany istniejący. Odpowiedź jest taka sama niezależnie od tego,
            // czy adres był już na liście lub został wcześniej wypisany – formularz nie zdradza, kto jest zapisany.
            return json(200, { ok: true });
        }

        if (res.status === 422) {
            // 422 to błąd adresu albo konfiguracji (np. nieistniejąca grupa). Logujemy tylko nazwy pól, nie ich treść.
            const fieldNames = Object.keys((await res.json().catch(() => null))?.errors ?? {});
            console.error("subscribe: MailerLite odrzucił dane (422), pola:", fieldNames.join(", ") || "brak");
            if (fieldNames.includes("email")) return json(400, { ok: false, error: "invalid_email" });
            return json(502, { ok: false, error: "server_error" });
        }
        console.error("subscribe: MailerLite odpowiedział statusem", res.status);
        if (res.status === 429) return json(503, { ok: false, error: "busy" });
        return json(502, { ok: false, error: "server_error" });
    } catch (e) {
        console.error("subscribe:", e?.name === "AbortError" ? "przekroczony czas odpowiedzi MailerLite" : "błąd połączenia z MailerLite");
        return json(502, { ok: false, error: "server_error" });
    } finally {
        clearTimeout(timeout);
    }
};
