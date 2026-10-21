import { Link } from "react-router-dom";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS, type Product } from "@/config/products";
import { trackFreeMaterialCta, trackProductClick, trackShopClick } from "@/lib/analytics";

const ProductCard = ({ product }: { product: Product }) => {
  const isAvailable = product.status === "available" && !!product.productUrl;

  return (
    <article className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl shadow-black/20 transition-all duration-500 hover:border-accent/40 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* okładka: ten sam kwadratowy kontener i ta sama powierzchnia we wszystkich kartach;
          grafika w całości, w oryginalnych proporcjach (object-contain), bez przycinania */}
      <div className="relative aspect-square m-3 mb-0 rounded-xl bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.09),rgba(255,255,255,0.025)_70%)] ring-1 ring-inset ring-white/[0.06]">
        {/* warstwa absolutna: obraz nie rozpycha kontenera, więc wszystkie mają te same wymiary */}
        <div className="absolute inset-5 sm:inset-6 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.imageAlt ?? `Grafika produktu „${product.title}”`}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-[3px] shadow-[0_14px_28px_-10px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        </div>
      </div>

      <div className="relative flex flex-col flex-1 px-5 pt-5 pb-6 md:px-6 md:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/70">{product.format}</p>
          {!isAvailable && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent/90">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />W przygotowaniu
            </span>
          )}
        </div>
        <h3 className="text-2xl font-heading font-medium text-foreground mb-2 md:mb-3 group-hover:text-accent transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>

        {/* akcje tylko wtedy, gdy coś faktycznie robią; mt-auto wyrównuje je do dołu kart */}
        {(isAvailable || product.freeSampleUrl) && (
          <div className="mt-auto pt-5 flex flex-col gap-3">
            {isAvailable && (
              <Button asChild variant="heroOutline" size="lg" className="w-full rounded-xl">
                <a
                  href={product.productUrl}
                  onClick={() => {
                    trackProductClick({ id: product.id, name: product.title, price: product.price });
                    trackShopClick(product.productUrl!);
                  }}
                >
                  Zobacz produkt
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </Button>
            )}
            {/* wyróżniony link do darmowego dnia: delikatna złota ramka (słabszy niż złoty przycisk w hero) */}
            {product.freeSampleUrl && (
              <Link
                to={product.freeSampleUrl}
                onClick={() => trackFreeMaterialCta("products_section")}
                className="group/link flex items-center justify-center gap-2 rounded-xl border border-accent/45 bg-accent/[0.1] px-3 py-3 text-[0.9375rem] font-medium text-accent hover:bg-accent/[0.16] hover:border-accent/70 hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Odbierz pierwszy dzień za darmo
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover/link:translate-x-0.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

const ProductsSection = () => {
  return (
    <section id="produkty" className="py-14 md:py-24 px-6 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Produkty</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-5">
            Odkryj nasze produkty
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Przygotowujemy materiały, które pomogą Ci zatrzymać się na chwilę, przyjrzeć się sobie i wprowadzić więcej
            uważności do codzienności.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 max-w-md md:max-w-none mx-auto">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
