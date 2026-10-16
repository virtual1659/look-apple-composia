import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import heroPiscine from "@/assets/hero-piscine.jpg.asset.json";
import { CATEGORIES, TEINTES, ATOUTS } from "@/lib/catalogue";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Composia · composite bois pour terrasses, façades et pergolas" },
      {
        name: "description",
        content:
          "Lames de terrasse, bardages de façade, clôtures et pergolas en composite bois : 50 % bois, 50 % polymère, cinq teintes, sans entretien.",
      },
      { property: "og:title", content: "Composia · composite bois pour terrasses et façades" },
      {
        property: "og:description",
        content: "Terrasses, façades, clôtures et pergolas en composite bois, sans entretien.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: heroPiscine.url },
      { name: "twitter:image", content: heroPiscine.url },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src={heroPiscine.url}
          alt="Plage de piscine en lames de terrasse composite"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 text-ink-foreground">
          <p className="eyebrow text-sand">Composite bois · 50 % bois, 50 % polymère</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.02] md:text-7xl">
            L'aspect du bois. Sans l'entretien.
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">
            Sols et terrasses, bardages de façade, clôtures et pergolas. Une gamme complète de
            profilés, du bord de piscine au mur de façade.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/catalogue">Voir le catalogue</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Demander un devis</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">Nos gammes</p>
        <h2 className="mt-3 max-w-2xl text-4xl">Quatre familles de profilés.</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/catalogue"
              hash={c.id}
              className="group overflow-hidden rounded-2xl bg-card shadow-soft"
            >
              <img
                src={c.image}
                alt={c.galerie[0]?.alt ?? c.titre}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="p-6">
                <h3 className="text-2xl">{c.titre}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.intro}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary">
                  Découvrir →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-ink-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow text-sand">Nuancier</p>
            <h2 className="mt-3 text-4xl">Cinq teintes, une texture bois embossée.</h2>
            <p className="mt-4 opacity-80">
              Résistant aux UV, à l'eau chlorée et aux taches. Ne se fend pas, ne grise pas, ne demande
              ni lasure ni huile. Les gammes clôture et pergola existent en quatre teintes.
            </p>
            <Button asChild className="mt-8">
              <Link to="/catalogue">Découvrir les produits</Link>
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {TEINTES.map((t) => (
              <figure key={t.id}>
                <img
                  src={t.swatch}
                  alt={t.label}
                  loading="lazy"
                  className="aspect-[1/2] w-full rounded-md object-cover"
                />
                <figcaption className="mt-2 text-xs opacity-80">{t.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">Propriétés</p>
        <h2 className="mt-3 max-w-2xl text-4xl">Pensé pour l'extérieur, durablement.</h2>
        <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ATOUTS.slice(0, 6).map((a) => (
            <div key={a.titre} className="border-t border-foreground/20 pt-4">
              <dt className="font-semibold">{a.titre}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{a.texte}</dd>
            </div>
          ))}
        </dl>
        <Button asChild variant="secondary" className="mt-10">
          <Link to="/a-propos">Toutes les propriétés</Link>
        </Button>
      </section>
    </>
  );
}
