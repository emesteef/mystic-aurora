// Zgoda na cookies analityczne (GA4). Skrypt Google ładuje się dopiero po zgodzie.

export const GA_MEASUREMENT_ID = "G-FWB0VV9QW5";

const STORAGE_KEY = "ma-cookie-consent";
const CONSENT_VERSION = 1;
export const OPEN_COOKIE_SETTINGS_EVENT = "ma:open-cookie-settings";

export interface ConsentChoice {
  analytics: boolean;
  date: string;
  version: number;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export const getConsent = (): ConsentChoice | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoice;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
};

const ensureGtag = () => {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // gtag wymaga obiektu `arguments`, nie tablicy
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
};

let gaLoaded = false;

const loadAnalytics = () => {
  ensureGtag();
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  window.gtag!("consent", "update", { analytics_storage: "granted" });
  if (gaLoaded) return;
  gaLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.gtag!("js", new Date());
  window.gtag!("config", GA_MEASUREMENT_ID);
};

const deleteAnalyticsCookies = () => {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
      });
    }
  });
};

const disableAnalytics = () => {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
  deleteAnalyticsCookies();
};

export const saveConsent = (analytics: boolean) => {
  const choice: ConsentChoice = { analytics, date: new Date().toISOString(), version: CONSENT_VERSION };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // brak dostępu do localStorage – wybór obowiązuje tylko w tej sesji
  }
  if (analytics) loadAnalytics();
  else disableAnalytics();
};

// Wywoływane przy starcie aplikacji: ładuje GA tylko przy zapisanej zgodzie.
export const applyStoredConsent = () => {
  if (getConsent()?.analytics) loadAnalytics();
};

export const openCookieSettings = () => {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
};
