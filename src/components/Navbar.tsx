import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import mysticLogo from "@/assets/mystic-aurora-logo-v2.png";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";
import { trackFreeMaterialCta } from "@/lib/analytics";

type NavItem = { label: string; section?: string; to?: string };

const navItems: NavItem[] = [
  { label: "O nas", section: "o-nas" },
  { label: "Produkty", section: "produkty" },
  { label: "Darmowy materiał", to: "/7-dni-powrotu-do-siebie" },
  { label: "Kontakt", section: "kontakt" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  // menu mobilne: Escape zamyka i oddaje fokus przyciskowi, tło nie przewija się, ukryte linki są poza kolejnością Tab
  useEffect(() => {
    panelRef.current?.toggleAttribute("inert", !isOpen);
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    // po przejściu na szerokość desktopową menu mobilne nie ma sensu – zamykamy je
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (e: MediaQueryListEvent) => e.matches && setIsOpen(false);
    // fokus opuścił menu (np. Tab za ostatni link) – zamykamy, żeby nie trafiał do przyciemnionej treści
    const onFocusIn = (e: FocusEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [isOpen]);

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname === "/") {
      scrollToSection(id);
      window.history.replaceState(null, "", `#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    setIsOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
    }
  };

  const linkClass =
    "text-sm font-body tracking-wide text-foreground/80 hover:text-accent transition-colors duration-300";

  const renderItem = (item: NavItem, mobile = false) => {
    const className = cn(linkClass, mobile && "block py-3 text-base");
    if (item.section) {
      return (
        <a
          key={item.label}
          href={`/#${item.section}`}
          onClick={(e) => handleSectionClick(e, item.section!)}
          className={className}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link
        key={item.label}
        to={item.to!}
        onClick={(e) => {
          if (item.to === "/7-dni-powrotu-do-siebie") trackFreeMaterialCta(mobile ? "nav_mobile" : "nav_desktop");
          // link do strony, na której już jesteśmy: przewijamy do formularza (jeśli jest), zamiast nic nie robić
          if (item.to === location.pathname) {
            e.preventDefault();
            setIsOpen(false);
            // po zamknięciu menu mobilnego (zdjęcie blokady przewijania) – dlatego z opóźnieniem
            window.setTimeout(() => {
              if (document.getElementById("formularz")) scrollToSection("formularz");
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }, 50);
          }
        }}
        className={className}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        isScrolled || isOpen
          ? "bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
          <img
            src={mysticLogo}
            alt="Mystic Aurora Logo"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-contain"
          />
          <span className="text-xl md:text-2xl font-heading font-light text-foreground group-hover:text-accent transition-colors duration-300">
            Mystic Aurora
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">{navItems.map((item) => renderItem(item))}</div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-controls="mobile-menu"
          className="md:hidden p-2 -mr-2 text-foreground/80 hover:text-accent transition-colors"
          aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-6 pb-4 divide-y divide-white/10">{navItems.map((item) => renderItem(item, true))}</div>
      </div>

      {/* przyciemnienie strony pod otwartym menu – kliknięcie zamyka menu */}
      {isOpen && (
        <div
          className="md:hidden absolute inset-x-0 top-full h-screen bg-background/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Navbar;
