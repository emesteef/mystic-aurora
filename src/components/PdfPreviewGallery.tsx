import { useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PdfPage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Podgląd stron PDF: klik/Enter otwiera stronę w większym oknie (Radix Dialog – Escape, pułapka fokusu,
// powrót fokusu na miniaturę po zamknięciu). Obrazy zawsze w całości (object-contain, oryginalne proporcje).
const PdfPreviewGallery = ({ pages }: { pages: PdfPage[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const current = openIndex !== null ? pages[openIndex] : null;
  // po zamknięciu wracamy fokusem na miniaturę, z której otwarto podgląd
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const lastOpened = useRef(0);

  return (
    <>
      {/* telefon: przewijane poziomo duże strony; desktop: dwie strony obok siebie, lekko na siebie nachodzące */}
      <ul
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pt-2 pb-6 md:mx-0 md:px-0 md:pb-4 md:overflow-visible md:justify-center md:gap-0 [scrollbar-width:thin]"
        aria-label="Strony podglądu materiału"
      >
        {pages.map((page, index) => (
          <li
            key={page.src}
            className={cn(
              "snap-center shrink-0 w-[78%] sm:w-[60%] md:w-[52%] md:max-w-[340px]",
              index === 0 ? "md:-rotate-[2.5deg] md:z-10" : "md:-ml-[6%] md:mt-8 md:rotate-[2deg] md:z-20",
            )}
          >
            <button
              type="button"
              ref={(el) => (triggers.current[index] = el)}
              onClick={() => {
                lastOpened.current = index;
                setOpenIndex(index);
              }}
              className="group relative block w-full rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6d3fa3]/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4ece2]"
              aria-label={`Powiększ: ${page.alt}`}
            >
              <img
                src={page.src}
                alt=""
                width={page.width}
                height={page.height}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain rounded-md shadow-[0_24px_50px_-14px_rgba(42,27,58,0.5)] ring-1 ring-[#2a1b3a]/10 transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:group-hover:translate-y-0"
              />
              <span className={cn(
                  "absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#2a1b3a]/85 px-3 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur-sm opacity-90 group-hover:opacity-100 group-focus-visible:opacity-100",
                  // na desktopie pierwszą stronę częściowo zakrywa druga – etykieta po lewej
                  index === 0 && "md:right-auto md:left-3",
                )}
              >
                <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                Powiększ
              </span>
            </button>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root open={current !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-[#120d18]/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              triggers.current[lastOpened.current]?.focus();
            }}
            className="fixed left-1/2 top-1/2 z-[70] -translate-x-1/2 -translate-y-1/2 w-[min(92vw,calc(88vh*0.707))] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          >
            {current && (
              <>
                <DialogPrimitive.Title className="sr-only">{current.alt}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                  Powiększony podgląd strony materiału. Naciśnij Escape lub przycisk „Zamknij podgląd”, aby wrócić.
                </DialogPrimitive.Description>
                <img
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  className="w-full h-auto max-h-[88vh] object-contain rounded-md shadow-2xl"
                />
                <DialogPrimitive.Close
                  className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-background text-foreground border border-white/20 shadow-lg hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Zamknij podgląd"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </DialogPrimitive.Close>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
};

export default PdfPreviewGallery;
