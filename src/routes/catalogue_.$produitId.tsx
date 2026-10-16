import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Pictos } from "@/components/Pictos";
import { PhotoGrid } from "@/components/Lightbox";
import { getProduit } from "@/lib/catalogue";

export const Route = createFileRoute("/catalogue_/$produitId")({
  loader: ({ params }) => {
    const p = getProduit(params.produitId);
    if (!p) throw notFound();
    return { id: p.id };
  },
  head: ({ params }) => {
    const p = getProduit(params.produitId);
    if (!p) return { meta: [{ title: "Produit introuvable" }, { name: "robots", content: "noindex" }] };
    const title = `${p.nom} · ${p.finition} | Composite bois`;
    return {
      meta: [
        { title },
        { name: "description", content: `${p.nom} (${p.finition}) : ${p.description}`.slice(0, 160) },
        { property: "og:title", content: title },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="text-3xl">Produit introuvable</h1>
      <Button asChild className="mt-6">
        <Link to="/catalogue">Retour au catalogue</Link>
      </Button>
    </div>
  ),
  component: FicheProduit,
});

function FicheProduit() {
  const { id } = Route.useLoaderData();
  const p = getProduit(id)!;
  const cat = p.categorie;
  const autres = cat.produits.filter((x) => x.id !== p.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/catalogue" className="hover:text-foreground">Catalogue</Link> /{" "}
        <Link to="/catalogue" hash={cat.id} className="hover:text-foreground">{cat.titre}</Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-start">
        <div className="space-y-4">
          {p.visuel && (
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-card p-8 shadow-soft">
              <img src={p.visuel} alt={`Profilé ${p.nom}`} className="max-h-full w-full object-contain" />
            </div>
          )}
          {p.situation?.[0] && (
            <img
              src={p.situation[0]}
              alt={`${p.nom} en situation`}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          )}
        </div>

        <div>
          <p className="eyebrow">{cat.titre}</p>
          <h1 className="mt-2 text-4xl md:text-5xl">{p.nom}</h1>
          <p className="mt-2 text-lg text-primary">{p.finition}</p>
          <p className="mt-5 text-muted-foreground">{p.description}</p>

          <div className="mt-8 overflow-hidden rounded-xl border">
            <p className="bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink-foreground">
              Caractéristiques techniques
            </p>
            <dl className="divide-y">
              {p.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 px-5 py-3 text-sm">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <h2 className="mt-8 text-xl">Teintes disponibles</h2>
          <ul className="mt-4 grid grid-cols-5 gap-2">
            {p.teintes.map((t) => (
              <li key={t.id}>
                <img src={t.swatch} alt="" className="aspect-square w-full rounded-md object-cover" />
                <p className="mt-1 text-xs text-muted-foreground">{t.label}</p>
              </li>
            ))}
          </ul>

          {p.folio && (
            <>
              <h2 className="mt-8 text-xl">Décors film PVC extérieur</h2>
              <img src={p.folio} alt="Décors film PVC extérieur" className="mt-4 w-full rounded-xl" />
            </>
          )}

          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">Demander un devis pour ce produit</Link>
          </Button>
        </div>
      </div>

      <section className="mt-16 rounded-2xl bg-card p-6 shadow-soft md:p-10">
        <p className="eyebrow">Caractéristiques du composite</p>
        <Pictos compact className="mt-6" />
      </section>

      {(p.situation?.length ?? 0) > 1 && (
        <section className="mt-16">
          <h2 className="text-3xl">Mises en situation</h2>
          <PhotoGrid photos={p.situation!.slice(1)} alt={p.nom} className="mt-6 grid gap-4 sm:grid-cols-3" />
        </section>
      )}

      {cat.realisations && (
        <section className="mt-16">
          <h2 className="text-3xl">Réalisations {cat.titre.toLowerCase()}</h2>
          <PhotoGrid photos={cat.realisations} alt={`Réalisation ${cat.titre}`} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" />
        </section>
      )}

      {autres.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl">Dans la même gamme</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {autres.map((o) => (
              <Link
                key={o.id}
                to="/catalogue/$produitId"
                params={{ produitId: o.id }}
                className="rounded-xl bg-card p-4 shadow-soft transition-shadow hover:shadow-lg"
              >
                {o.visuel && <img src={o.visuel} alt="" loading="lazy" className="aspect-[4/3] w-full object-contain" />}
                <p className="mt-2 font-semibold">{o.nom}</p>
                <p className="text-xs text-muted-foreground">{o.finition}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
