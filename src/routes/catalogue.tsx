import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/catalogue";
import { PhotoGrid } from "@/components/Lightbox";
import { Pictos } from "@/components/Pictos";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Catalogue composite · sols, façades, clôtures, pergolas" },
      {
        name: "description",
        content:
          "Lames de terrasse ARE-DECK, panneaux de façade, clins, brise-soleil, clôtures et pergolas en composite bois : dimensions, finitions et teintes.",
      },
      { property: "og:title", content: "Catalogue composite · sols, façades, clôtures, pergolas" },
      {
        property: "og:description",
        content: "Toute la gamme de profilés composite bois, avec ses dimensions et ses cinq teintes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalogue,
});

function Catalogue() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Catalogue 2025</p>
      <h1 className="mt-3 text-4xl md:text-6xl">Toute la gamme composite</h1>
      <p className="mt-5 max-w-2xl text-muted-foreground">
        Des profilés composés pour moitié de farine de bois et pour moitié de polymère, produits sur
        lignes entièrement automatisées. Quatre familles, une même texture bois.
      </p>

      <nav className="mt-8 flex flex-wrap gap-3">
        {CATEGORIES.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            {c.titre}
          </a>
        ))}
      </nav>

      <section className="mt-12 rounded-2xl bg-card p-6 shadow-soft md:p-10">
        <p className="eyebrow">Caractéristiques du composite</p>
        <Pictos compact className="mt-6" />
      </section>

      <div className="mt-16 space-y-24">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-24">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
              <img
                src={cat.image}
                alt={cat.galerie[0]?.alt ?? cat.titre}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft"
              />
              <div>
                <h2 className="text-3xl md:text-4xl">{cat.titre}</h2>
                <p className="mt-4 text-muted-foreground">{cat.intro}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.produits.map((p) => (
                <Link
                  key={p.id}
                  to="/catalogue/$produitId"
                  params={{ produitId: p.id }}
                  className="group flex flex-col rounded-2xl bg-card p-6 shadow-soft transition-shadow hover:shadow-lg"
                >
                  {p.visuel && (
                    <img
                      src={p.visuel}
                      alt={`Profilé ${p.nom}`}
                      loading="lazy"
                      className="mb-4 aspect-[16/9] w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{p.finition}</p>
                  <h3 className="mt-1 text-xl">{p.nom}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>
                  <dl className="mt-5 space-y-1 border-t pt-4 text-sm">
                    {p.specs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">{s.label}</dt>
                        <dd className="font-semibold">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.teintes.map((t) => (
                      <li key={t.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <img src={t.swatch} alt="" className="h-4 w-4 rounded-full object-cover" />
                        {t.label}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-4 text-sm font-semibold text-primary">Voir la fiche →</span>
                </Link>
              ))}
            </div>

            {cat.accessoires && (
              <div className="mt-10 rounded-2xl border p-6">
                <h3 className="text-xl">Accessoires {cat.titre.toLowerCase()}</h3>
                <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.accessoires.map((a) => (
                    <div key={a.nom}>
                      {a.image && (
                        <img src={a.image} alt="" loading="lazy" className="mb-3 aspect-[4/3] w-full rounded-lg bg-background object-contain" />
                      )}
                      <dt className="font-semibold">{a.nom}</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">{a.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {cat.realisations && (
              <div className="mt-10">
                <h3 className="text-xl">Réalisations</h3>
                <PhotoGrid
                  photos={cat.realisations}
                  alt={`Réalisation ${cat.titre}`}
                  className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4"
                />
              </div>
            )}
            {cat.montage && (
              <div className="mt-10">
                <h3 className="text-xl">Montage &amp; ossature</h3>
                <PhotoGrid
                  photos={cat.montage}
                  alt={`Montage ${cat.titre}`}
                  className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4"
                />
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-20 rounded-2xl bg-ink p-8 text-ink-foreground md:p-12">
        <h2 className="text-3xl">Un projet en tête ?</h2>
        <p className="mt-3 max-w-xl opacity-80">
          Dites-nous les surfaces à couvrir et la teinte envisagée : nous revenons vers vous avec un
          chiffrage.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <Link to="/contact">Demander un devis</Link>
        </Button>
      </div>
    </div>
  );
}
