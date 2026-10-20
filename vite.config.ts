import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { PAGE_SEO, SITE_URL } from "./src/config/seo";

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Po buildzie tworzy dist/<podstrona>.html z metadanymi z src/config/seo.ts.
// Netlify serwuje /<podstrona> z tego pliku, więc roboty bez JavaScriptu (Facebook, X) widzą właściwy tytuł i opis.
const seoPages = (): Plugin => ({
  name: "seo-pages",
  apply: "build",
  closeBundle() {
    const distDir = path.resolve(__dirname, "dist");
    const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

    for (const [route, seo] of Object.entries(PAGE_SEO)) {
      if (route === "/") continue;
      const url = `${SITE_URL}${route}`;
      const title = escapeAttr(seo.title);
      const description = escapeAttr(seo.description);
      const html = template
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
        .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
        .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
        .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
        .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
        .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`)
        .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${description}`);
      fs.writeFileSync(path.join(distDir, `${route.slice(1)}.html`), html);
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), seoPages()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
