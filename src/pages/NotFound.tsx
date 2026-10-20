import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { NOT_FOUND_SEO } from "@/config/seo";

const NotFound = () => {
  const location = useLocation();
  usePageMeta(null, NOT_FOUND_SEO);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="mb-4 text-5xl md:text-6xl font-heading font-light text-foreground">404</h1>
        <p className="mb-8 text-lg text-muted-foreground">Nie znaleźliśmy tej strony.</p>
        <Link to="/" className="text-accent underline underline-offset-4 hover:opacity-80 transition-opacity">
          Wróć do strony głównej
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
