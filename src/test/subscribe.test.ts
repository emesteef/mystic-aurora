// Testy funkcji netlify/functions/subscribe.js. MailerLite jest podstawiony (fetch), nic nie trafia do prawdziwego konta.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handler } from "../../netlify/functions/subscribe.js";

const ENV = {
  MAILERLITE_API_KEY: "test-key",
  MAILERLITE_GROUP_FREE_7_DAYS: "g-7dni",
  MAILERLITE_GROUP_NEWSLETTER: "g-newsletter",
};

const call = (body: unknown, method = "POST") =>
  handler({ httpMethod: method, body: typeof body === "string" ? body : JSON.stringify(body) });

const mockMailerLite = (status: number, body: unknown = { data: { id: "1", status: "active" } }) => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const sentPayload = (fetchMock: ReturnType<typeof vi.fn>) => JSON.parse(fetchMock.mock.calls[0][1].body);
const logged = (spy: ReturnType<typeof vi.spyOn>) => spy.mock.calls.flat().join(" ");

describe("subscribe – zapis po bezpłatny pierwszy dzień", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    for (const [k, v] of Object.entries(ENV)) vi.stubEnv(k, v);
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("poprawny e-mail bez newslettera → tylko grupa FREE_7_DAYS, bez daty zgody i statusu", async () => {
    const fetchMock = mockMailerLite(201);
    const res = await call({ source: "free_7_days", email: " anna@example.com ", newsletter: false });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ ok: true });
    expect(sentPayload(fetchMock)).toEqual({ email: "anna@example.com", groups: ["g-7dni"] });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer test-key");
  });

  it("poprawny e-mail z newsletterem → FREE_7_DAYS + NEWSLETTER i data zgody", async () => {
    const fetchMock = mockMailerLite(201);
    const res = await call({
      source: "free_7_days",
      email: "anna@example.com",
      newsletter: true,
      consented_at: "2026-10-24T10:00:00.000Z",
    });
    expect(res.statusCode).toBe(200);
    expect(sentPayload(fetchMock)).toEqual({
      email: "anna@example.com",
      groups: ["g-7dni", "g-newsletter"],
      fields: { data_zgody_rodo: "2026-10-24" },
    });
  });

  it("zgoda tylko przy jawnym true – \"true\" lub 1 nie zapisuje do newslettera", async () => {
    for (const newsletter of ["true", 1, "on"]) {
      const fetchMock = mockMailerLite(200);
      await call({ source: "free_7_days", email: "anna@example.com", newsletter, consented_at: new Date().toISOString() });
      expect(sentPayload(fetchMock).groups).toEqual(["g-7dni"]);
      expect(sentPayload(fetchMock).fields).toBeUndefined();
    }
  });

  it("newsletter bez daty zgody → 400, bez wywołania MailerLite", async () => {
    const fetchMock = mockMailerLite(200);
    const res = await call({ source: "free_7_days", email: "anna@example.com", newsletter: true });
    expect(res.statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("nigdy nie używa grupy FREE_MEDITATION", async () => {
    vi.stubEnv("MAILERLITE_GROUP_FREE_MEDITATION", "g-medytacja");
    const fetchMock = mockMailerLite(200);
    await call({ source: "free_7_days", email: "anna@example.com", newsletter: true, consented_at: new Date().toISOString(), group: "FREE_MEDITATION" });
    expect(sentPayload(fetchMock).groups).not.toContain("g-medytacja");
  });

  it.each(["", "anna", "anna@gmail", "anna@@gmail.com", "an na@gmail.com", `${"a".repeat(250)}@example.com`, 42, null])(
    "niepoprawny e-mail %s → 400 invalid_email, bez wywołania MailerLite",
    async (email) => {
      const fetchMock = mockMailerLite(200);
      const res = await call({ source: "free_7_days", email, newsletter: false });
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error).toBe("invalid_email");
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("nieprawidłowe żądanie (zła metoda, brak źródła, zły JSON) → bez wywołania MailerLite", async () => {
    const fetchMock = mockMailerLite(200);
    expect((await call({ source: "free_7_days", email: "anna@example.com" }, "GET")).statusCode).toBe(405);
    expect((await call({ email: "anna@example.com" })).statusCode).toBe(400);
    expect((await call("{nie json")).statusCode).toBe(400);
    expect((await call("x".repeat(5000))).statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ponowny zapis istniejącego kontaktu (200) → sukces, tylko dodanie grup, bez status i resubscribe", async () => {
    const fetchMock = mockMailerLite(200, { data: { id: "1", status: "active" } });
    const res = await call({ source: "free_7_days", email: "anna@example.com", newsletter: false });
    expect(res.statusCode).toBe(200);
    const payload = sentPayload(fetchMock);
    expect(payload).not.toHaveProperty("status");
    expect(payload).not.toHaveProperty("resubscribe");
    expect(payload).not.toHaveProperty("fields"); // nie nadpisuje wcześniejszej daty zgody
  });

  it("kontakt wcześniej wypisany → ta sama odpowiedź co dla innych (bez ujawniania), bez próby ponownego zapisu", async () => {
    const fetchMock = mockMailerLite(200, { data: { id: "1", status: "unsubscribed" } });
    const res = await call({ source: "free_7_days", email: "anna@example.com", newsletter: false });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ ok: true });
    expect(sentPayload(fetchMock)).not.toHaveProperty("status");
    expect(sentPayload(fetchMock)).not.toHaveProperty("resubscribe");
  });

  it("MailerLite odrzuca adres (422 z błędem pola email) → 400 invalid_email", async () => {
    mockMailerLite(422, { message: "The email must be a valid email address.", errors: { email: ["anna@example.com is invalid"] } });
    const res = await call({ source: "free_7_days", email: "anna@example.com", newsletter: false });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toBe("invalid_email");
    expect(logged(errorSpy)).not.toContain("anna@example.com");
  });

  it("422 z błędem konfiguracji (np. zła grupa) → 502 server_error, nie błąd adresu", async () => {
    mockMailerLite(422, { errors: { "groups.0": ["The selected groups.0 is invalid."] } });
    const res = await call({ source: "free_7_days", email: "anna@example.com", newsletter: false });
    expect(res.statusCode).toBe(502);
    expect(JSON.parse(res.body).error).toBe("server_error");
  });

  it.each([
    [401, 502],
    [429, 503],
    [500, 502],
  ])("błąd API MailerLite %i → %i, bez szczegółów dla użytkownika i bez e-maila w logach", async (mlStatus, status) => {
    mockMailerLite(mlStatus, { message: "Unauthenticated. anna@example.com test-key" });
    const res = await call({ source: "free_7_days", email: "anna@example.com", newsletter: false });
    expect(res.statusCode).toBe(status);
    expect(res.body).not.toMatch(/Unauthenticated|anna@|test-key/);
    expect(logged(errorSpy)).not.toMatch(/anna@|test-key|Unauthenticated/);
  });

  it("brak połączenia z MailerLite → 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    const res = await call({ source: "free_7_days", email: "anna@example.com", newsletter: false });
    expect(res.statusCode).toBe(502);
  });

  it.each(Object.keys(ENV))("brak zmiennej %s → 500, bez wywołania MailerLite, w logu tylko nazwa", async (name) => {
    vi.stubEnv(name, "");
    const fetchMock = mockMailerLite(200);
    const res = await call({ source: "free_7_days", email: "anna@example.com", newsletter: false });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).error).toBe("server_error");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(logged(errorSpy)).toContain(name);
    expect(logged(errorSpy)).not.toMatch(/test-key|g-7dni|g-newsletter/);
  });
});
