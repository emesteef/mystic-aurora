// Dane marki i przedsiębiorcy w jednym miejscu.
// Pola ustawione na null są ukrywane na stronie – uzupełnij je, gdy dane będą zatwierdzone.

export interface CompanyInfo {
  legalName: string; // pełna nazwa przedsiębiorcy / firmy (np. imię i nazwisko + nazwa działalności)
  address: string; // adres wykonywania działalności
  nip: string;
  regon?: string;
}

export const BUSINESS = {
  brandName: "Mystic Aurora",
  email: "kontakt@mysticaurora.pl",
  instagram: { url: "https://www.instagram.com/themysticaurora/", label: "@themysticaurora" },
  facebook: { url: "https://www.facebook.com/profile.php?id=61591145302158", label: "Mystic Aurora" },
  privacyPolicyPath: "/polityka-prywatnosci",
  // adres regulaminu sklepu – ustaw, gdy dokument będzie opublikowany
  termsUrl: null as string | null,
  // dane przedsiębiorcy – ustaw po zatwierdzeniu
  company: null as CompanyInfo | null,
};
