// Zdarzenia GA4. Wysyłane tylko po zgodzie na cookies analityczne (GA ładuje się dopiero wtedy – src/lib/consent.ts).
// Parametry to wyłącznie stałe etykiety – nigdy nie przekazuj tu e-maila ani innych danych wpisanych przez użytkownika.

import { getConsent } from "@/lib/consent";

type CtaLocation = "home_hero" | "nav_desktop" | "nav_mobile" | "landing_hero" | "landing_preview" | "products_section" | "home_cta_section";
type FormLocation = "home_newsletter" | "landing_free_material";

const send = (name: string, params: Record<string, unknown>) => {
  if (!getConsent()?.analytics || !window.gtag) return;
  window.gtag("event", name, params);
};

// Kliknięcie CTA darmowego materiału
export const trackFreeMaterialCta = (location: CtaLocation) =>
  send("free_material_cta_click", { cta_location: location });

// Poprawny zapis do newslettera (rekomendowane zdarzenie GA4 „sign_up”)
export const trackNewsletterSignup = (location: FormLocation) =>
  send("sign_up", { method: "newsletter", form_location: location });

// Kliknięcie produktu (rekomendowane zdarzenie GA4 „select_item”) – do podpięcia, gdy powstaną karty produktów
export const trackProductClick = (item: { id: string; name: string; price?: number }) =>
  send("select_item", {
    item_list_name: "produkty",
    items: [{ item_id: item.id, item_name: item.name, ...(item.price !== undefined && { price: item.price }) }],
    ...(item.price !== undefined && { currency: "PLN" }),
  });

// Przejście do sklepu – do podpięcia, gdy będzie prawdziwy adres sklepu/produktu
export const trackShopClick = (destination: string) => send("shop_click", { link_url: destination });
