import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { FileText, Info, LayoutGrid, Menu, Ruler, Sparkles, X } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { RevealObserver } from "../components/Reveal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Composia · Composites" },
      { name: "description", content: "Terrasses et façades en composite, simulateur IA avant/après." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const nav = [
  { to: "/catalogue", label: "Catalogue", icon: LayoutGrid },
  { to: "/pose", label: "Pose", icon: Ruler },
  { to: "/a-propos", label: "À propos", icon: Info },
  { to: "/simulateur", label: "Simulateur IA", icon: Sparkles },
  { to: "/contact", label: "Devis", icon: FileText },
] as const;

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-5 pb-5 pt-1 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {nav.map((n, i) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onNavigate}
          className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card px-4 py-4 shadow-soft transition-colors hover:bg-accent/40 active:bg-accent/60"
          activeProps={{
            className:
              "border-primary/30 bg-primary text-primary-foreground hover:bg-primary/90",
          }}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <n.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="truncate text-sm font-semibold">{n.label}</span>
        </Link>
      ))}
    </div>
  );
}

const footerCols = [
  { t: "Produits", l: [["Sols & terrasses", "/catalogue"], ["Façades & bardages", "/catalogue"], ["Clôtures", "/catalogue"], ["Pergolas", "/catalogue"]] },
  { t: "Outils", l: [["Simulateur IA", "/simulateur"], ["Guide de pose", "/pose"]] },
  { t: "Conseils", l: [["Pose & accessoires", "/pose"], ["Propriétés du composite", "/a-propos"]] },
  { t: "Professionnels", l: [["Devenir revendeur", "/contact"], ["Grands projets", "/contact"]] },
  { t: "Composia", l: [["À propos", "/a-propos"], ["Demander un devis", "/contact"]] },
] as const;

function SiteFooter() {
  return (
    <footer className="mt-10 bg-muted px-5 pt-12 pb-8 text-xs text-muted-foreground">
      <div className="mx-auto max-w-6xl">
        <p className="border-b pb-6">
          * Données indicatives, à confirmer. Les rendus du simulateur IA sont une aide à la décision : commandez un échantillon pour valider la teinte.
        </p>
        <div className="grid grid-cols-2 gap-8 py-8 sm:grid-cols-5">
          {footerCols.map((c) => (
            <div key={c.t}>
              <p className="font-semibold text-foreground">{c.t}</p>
              <ul className="mt-3 space-y-2">
                {c.l.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="hover:text-foreground">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t pt-6">
          <span>© {new Date().getFullYear()} Composia. Tous droits réservés.</span>
          <span>France</span>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Ferme le menu mobile à chaque navigation.
  useEffect(() => {
    const unsub = router.subscribe("onResolved", () => setMenuOpen(false));
    return unsub;
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <header className="sticky top-3 z-40 px-3">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border bg-background/80 pl-5 pr-2 shadow-soft backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <span className="h-5 w-5 rounded-md" style={{ background: "var(--gradient-wood)" }} aria-hidden="true" />
            Composia
          </Link>
          <nav className="hidden items-center gap-1 text-[13px] sm:flex">
            {nav.filter((n) => n.to !== "/contact").map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-muted text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/contact"
            className="hidden rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Demander un devis
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent sm:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-4xl rounded-3xl border bg-background/95 pt-5 shadow-soft backdrop-blur-xl sm:hidden">
            <MobileMenu onNavigate={() => setMenuOpen(false)} />
          </div>
        )}
      </header>
      <RevealObserver />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
