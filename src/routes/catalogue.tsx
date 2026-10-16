import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { COLORS, MATERIALS } from "@/lib/materials";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Catalogue composite · Composia" },
      { name: "description", content: "Lames de terrasse ARE-DECK et bardages ARE-WALL : caractéristiques techniques et nuancier." },
      { property: "og:title", content: "Catalogue composite · Composia" },
      { property: "og:description", content: "Terrasses et bardages composites en cinq teintes bois." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalogue,
});

function Catalogue() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Catalogue</p>
      <h1 className="mt-3 text-4xl md:text-6xl">Nos composites</h1>
      <div className="mt-12 space-y-10">
        {MATERIALS.map((m, i) => (
          <article key={m.id} className="grid gap-8 rounded-2xl bg-card p-6 shadow-soft md:grid-cols-[280px_1fr] md:p-8">
            <img src={COLORS[i % COLORS.length].swatch} alt={m.name} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            <div>
              <p className="text-sm text-muted-foreground">{m.subtitle}</p>
              <h2 className="mt-1 text-3xl">{m.name}</h2>
              <p className="mt-3 text-muted-foreground">{m.description}</p>
              <dl className="mt-5 grid grid-cols-3 gap-4 border-y py-4">
                {m.specs.map((s) => (
                  <div key={s.label}>
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <span key={c.id} className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                    <img src={c.swatch} alt="" className="h-4 w-4 rounded-full object-cover" />
                    {c.label}
                  </span>
                ))}
              </div>
              <Button asChild className="mt-6">
                <Link to="/simulateur">Essayer sur ma photo</Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
