import { Link } from "react-router-dom";
import { ArrowRight, Check, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS, type Product } from "@/config/products";
import { trackFreeMaterialCta, trackProductClick, trackShopClick } from "@/lib/analytics";

const formatPrice = (price: number) => `${price.toLocaleString("pl-PL")} zł`;

const ProductCard = ({ product }: { product: Product }) => {
  const isAvailable = product.status === "available" && !!product.productUrl;

  return (
    <article className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl shadow-black/20 transition-all duration-500 hover:border-accent/40 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* cała grafika bez przycinania (object-contain) – okładki mają różne proporcje (A4, 3:4) */}
      <div className="relative aspect-[3/4] overflow-hidden px-8 pt-12 pb-6 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-accent/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <img
          src={product.image}
          alt={product.imageAlt ?? `Grafika produktu „${product.title}”`}
          loading="lazy"
          decoding="async"
          className="relative w-full h-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        {!isAvailable && (
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/80 border border-accent/40 backdrop-blur-md text-xs font-medium tracking-wide text-accent">
            W przygotowaniu
          </span>
        )}
      </div>

      <div className="relative flex flex-col flex-1 p-6 md:p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{product.format}</p>
        <h3 className="text-2xl font-heading font-medium text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

        {product.details && (
          <ul className="mt-5 space-y-2">
            {product.details.map((detail) => (
              <li key={detail} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                {detail}
              </li>
            ))}
          </ul>
        )}

        {/* mt-auto dociąga cenę i przyciski do dołu karty – karty w rzędzie mają równą wysokość */}
        <div className="mt-auto pt-6">
          {product.price !== undefined && (
            <p className="mb-4 text-sm text-muted-foreground">
              {isAvailable ? (
                <span className="text-2xl font-heading text-accent">{formatPrice(product.price)}</span>
              ) : (
                <>
                  Planowana cena: <span className="text-foreground">{formatPrice(product.price)}</span>
                </>
              )}
            </p>
          )}

          <div className="flex flex-col gap-3">
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
            {product.freeSampleUrl && (
              <Button asChild variant="hero" size="lg" className="w-full rounded-xl">
                <Link to={product.freeSampleUrl} onClick={() => trackFreeMaterialCta("products_section")}>
                  <Gift className="w-4 h-4" aria-hidden="true" />
                  Pobierz pierwszy dzień
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const ProductsSection = () => {
  const hasComingSoon = PRODUCTS.some((product) => product.status !== "available");

  return (
    <section id="produkty" className="py-24 px-6 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-md md:max-w-none mx-auto">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {hasComingSoon && (
          <p className="mt-12 text-center text-muted-foreground">
            Chcesz wiedzieć, kiedy materiały będą dostępne? Przy odbiorze{" "}
            <Link
              to="/7-dni-powrotu-do-siebie"
              onClick={() => trackFreeMaterialCta("products_section")}
              className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              darmowego materiału
            </Link>{" "}
            możesz zapisać się do newslettera.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
