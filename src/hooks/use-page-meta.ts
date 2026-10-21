import { useEffect } from "react";
import { PAGE_SEO, SITE_URL, type PageSeo, type SeoPath } from "@/config/seo";

const setTag = (selector: string, attr: string, value: string): (() => void) => {
  const el = document.head.querySelector<HTMLElement>(selector);
  if (!el) return () => {};
  const previous = el.getAttribute(attr);
  el.setAttribute(attr, value);
  return () => {
    if (previous !== null) el.setAttribute(attr, previous);
  };
};

const setRobots = (content: string): (() => void) => {
  const el = document.createElement("meta");
  el.name = "robots";
  el.content = content;
  document.head.appendChild(el);
  return () => el.remove();
};

// Ustawia tytuł, opis, canonical i Open Graph podstrony; przywraca wartości z index.html po wyjściu.
// `path` = podstrona z src/config/seo.ts; dla 404 przekaż własne metadane i brak ścieżki.
export const usePageMeta = (path: SeoPath | null, override?: PageSeo) => {
  useEffect(() => {
    const seo: PageSeo = override ?? PAGE_SEO[path!];
    const previousTitle = document.title;
    document.title = seo.title;

    const restore = [
      setTag('meta[name="description"]', "content", seo.description),
      setTag('meta[property="og:title"]', "content", seo.title),
      setTag('meta[property="og:description"]', "content", seo.description),
      setTag('meta[name="twitter:title"]', "content", seo.title),
      setTag('meta[name="twitter:description"]', "content", seo.description),
    ];
    if (path) {
      const url = `${SITE_URL}${path === "/" ? "/" : path}`;
      restore.push(setTag('link[rel="canonical"]', "href", url), setTag('meta[property="og:url"]', "content", url));
    }
    if (seo.noindex) restore.push(setRobots("noindex"));

    return () => {
      document.title = previousTitle;
      restore.forEach((fn) => fn());
    };
  }, [path, override]);
};
