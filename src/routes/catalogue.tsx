import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, LayoutGrid, List, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, TEINTES, TOUS_PRODUITS, type Produit } from "@/lib/catalogue";
import { PhotoGrid } from "@/components/Lightbox";

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

type P = Produit;
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const STRUCTURES = ["Alvéolaire", "Pleine"] as const;
const SURFACES = ["Embossé", "Rainures larges", "Film PVC"] as const;
const structureDe = (p: P) => (/plein/.test(norm(p.finition)) ? "Pleine" : /alveol/.test(norm(p.finition)) ? "Alvéolaire" : null);
const surfaceDe = (p: P) => {
  const f = norm(`${p.finition} ${p.nom}`);
  if (/film|pvc|folio/.test(f)) return "Film PVC";
  if (/rainures larges/.test(f)) return "Rainures larges";
  if (/emboss/.test(f)) return "Embossé";
  return null;
};

function Catalogue() {
  const [q, setQ] = useState("");
  const [famille, setFamille] = useState<string | null>(null);
  const [teinte, setTeinte] = useState<string | null>(null);
  const [structure, setStructure] = useState<string | null>(null);
  const [surface, setSurface] = useState<string | null>(null);
  const [vue, setVue] = useState<"grille" | "liste">("grille");
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const nbAcc = CATEGORIES.reduce((n, c) => n + (c.accessoires?.length ?? 0), 0);
  const match = (p: P) =>
    (!teinte || p.teintes.some((t) => t.id === teinte)) &&
    (!structure || structureDe(p) === structure) &&
    (!surface || surfaceDe(p) === surface) &&
    (!q || norm(`${p.nom} ${p.finition} ${p.description} ${p.specs.map((s) => s.value).join(" ")}`).includes(norm(q)));
  const sections = CATEGORIES.filter((c) => !famille || c.id === famille)
    .map((c) => ({ c, produits: c.produits.filter(match) }))
    .filter((s) => s.produits.length);
  const total = sections.reduce((n, s) => n + s.produits.length, 0);
  const choisis = useMemo(() => TOUS_PRODUITS.filter((p) => compare.includes(p.id)), [compare]);
  const toggle = (id: string) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 text-center md:pt-24">
        <p className="eyebrow">Catalogue · {TOUS_PRODUITS.length} profilés · {nbAcc} accessoires</p>
        <h1 className="mt-4 text-5xl leading-[1.02] md:text-7xl">
          Trouvez le <span className="text-wood">bon profilé.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          50 % farine de bois, 50 % polymère, produits sur lignes automatisées. Quatre familles, une même texture bois.
        </p>
        <label className="mx-auto mt-7 flex max-w-md items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Référence, usage, dimension…" className="w-full bg-transparent outline-none" />
          {q && <button type="button" onClick={() => setQ("")} aria-label="Effacer"><X className="h-4 w-4" /></button>}
        </label>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c) => {
            const on = famille === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFamille(on ? null : c.id)}
                className={`group relative overflow-hidden rounded-3xl text-left ring-offset-2 ring-offset-background transition ${on ? "ring-[3px] ring-primary" : ""}`}
              >
                <img src={c.image} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="glass absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-2xl px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold">{c.titre}</span>
                    <span className="block text-xs opacity-75">{c.produits.length} profilés</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl bg-muted px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Structure</span>
            <div className="flex rounded-xl bg-border/60 p-1">
              {STRUCTURES.map((s) => (
                <button key={s} type="button" onClick={() => setStructure(structure === s ? null : s)}
                  className={`rounded-lg px-4 py-1.5 font-medium transition ${structure === s ? "bg-background shadow-soft" : "text-foreground/80"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <span className="hidden h-6 w-px bg-border md:block" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Surface</span>
            {SURFACES.map((s) => (
              <button key={s} type="button" onClick={() => setSurface(surface === s ? null : s)}
                className={`rounded-full border px-4 py-1.5 font-medium transition ${surface === s ? "border-foreground bg-foreground text-background" : "bg-background"}`}>
                {s}
              </button>
            ))}
          </div>
          <span className="hidden h-6 w-px bg-border md:block" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Teinte</span>
            {TEINTES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTeinte(teinte === t.id ? null : t.id)}
                aria-label={t.label}
                title={t.label}
                className={`h-7 w-7 overflow-hidden rounded-full ring-offset-2 ring-offset-muted ${teinte === t.id ? "ring-2 ring-primary" : ""}`}
              >
                <img src={t.swatch} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3 text-muted-foreground">
            {(famille || teinte || q || structure || surface) && (
              <button type="button" className="text-primary" onClick={() => { setFamille(null); setTeinte(null); setQ(""); setStructure(null); setSurface(null); }}>
                Réinitialiser
              </button>
            )}
            <span>{total} résultat{total > 1 ? "s" : ""}</span>
            <div className="flex rounded-xl bg-border/60 p-1">
              <button type="button" aria-label="Vue grille" onClick={() => setVue("grille")} className={`rounded-lg p-1.5 ${vue === "grille" ? "bg-background text-foreground shadow-soft" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
              <button type="button" aria-label="Vue liste" onClick={() => setVue("liste")} className={`rounded-lg p-1.5 ${vue === "liste" ? "bg-background text-foreground shadow-soft" : ""}`}><List className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-24 px-5 py-20">
        {sections.length === 0 && <p className="text-center text-muted-foreground">Aucun profilé ne correspond à ces filtres.</p>}
        {sections.map(({ c: cat, produits }) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-24">
            <p className="eyebrow">{cat.titre}</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-4xl">{cat.titre}</h2>
            </div>
            <p className="mt-3 max-w-xl text-muted-foreground">{cat.intro}</p>

            <div className={`mt-10 grid gap-4 ${vue === "grille" ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
              {produits.map((p) => (
                <div key={p.id} className={`flex rounded-3xl border bg-card p-3 shadow-soft ${vue === "grille" ? "flex-col" : "flex-col sm:flex-row sm:items-center sm:gap-4"}`}>
                  <Link to="/catalogue/$produitId" params={{ produitId: p.id }} className={`group block ${vue === "liste" ? "sm:flex sm:flex-1 sm:items-center sm:gap-4" : ""}`}>
                    <div className={`flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-muted ${vue === "liste" ? "sm:w-48 sm:shrink-0" : ""}`}>
                      {p.visuel && (
                        <img src={p.visuel} alt={`Profilé ${p.nom}`} loading="lazy" className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                      )}
                    </div>
                    <div className="px-2 pt-4">
                      <p className="text-[11px] font-medium text-primary">{p.finition}</p>
                      <h3 className="mt-1 text-lg">{p.nom}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{p.specs.map((s) => s.value).join(" · ")}</p>
                    </div>
                  </Link>
                  <div className="mt-auto flex items-center justify-between px-2 pt-4 pb-1">
                    <div className="flex -space-x-1">
                      {p.teintes.map((t) => (
                        <img key={t.id} src={t.swatch} alt={t.label} title={t.label} className="h-4 w-4 rounded-full border-2 border-card object-cover" />
                      ))}
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                      Comparer
                      <input type="checkbox" checked={compare.includes(p.id)} onChange={() => toggle(p.id)} className="peer sr-only" />
                      <span className="relative h-5 w-9 rounded-full bg-border transition peer-checked:bg-primary after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-card after:transition peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {cat.accessoires && (
              <div className="mt-10 rounded-3xl bg-muted p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl">Accessoires de pose</h3>
                  <Link to="/pose" className="text-sm text-primary">Guide de pose ›</Link>
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.accessoires.map((a) => (
                    <li key={a.nom} className="flex items-center gap-3 rounded-2xl bg-card p-3">
                      {a.image ? (
                        <img src={a.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-lg object-contain" />
                      ) : (
                        <span className="h-12 w-12 shrink-0 rounded-lg bg-muted" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{a.nom}</p>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {cat.realisations && (
              <div className="mt-10">
                <h3 className="text-xl">Réalisations</h3>
                <PhotoGrid photos={cat.realisations} alt={`Réalisation ${cat.titre}`} className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4 [&_img]:rounded-2xl" />
              </div>
            )}
            {cat.montage && (
              <div className="mt-10">
                <h3 className="text-xl">Montage &amp; ossature</h3>
                <PhotoGrid photos={cat.montage} alt={`Montage ${cat.titre}`} className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4 [&_img]:rounded-2xl" />
              </div>
            )}
          </section>
        ))}
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/simulateur" className="rounded-3xl bg-muted p-6 transition hover:bg-accent">
            <p className="text-lg font-semibold">Simulateur IA</p>
            <p className="mt-2 text-sm text-muted-foreground">Essayez une lame et une teinte sur votre photo.</p>
            <p className="mt-4 text-sm text-primary">Essayer ›</p>
          </Link>
          <Link to="/pose" className="rounded-3xl bg-muted p-6 transition hover:bg-accent">
            <p className="text-lg font-semibold">Pose & accessoires</p>
            <p className="mt-2 text-sm text-muted-foreground">Ossature, clips, plots et visserie.</p>
            <p className="mt-4 text-sm text-primary">Voir ›</p>
          </Link>
          <Link to="/contact" className="rounded-3xl bg-ink p-6 text-ink-foreground">
            <p className="text-lg font-semibold">Demander un devis</p>
            <p className="mt-2 text-sm opacity-70">Surface, gamme, teinte, pose : on chiffre votre projet.</p>
            <p className="mt-4 text-sm text-primary">Commencer ›</p>
          </Link>
        </div>
      </section>

      {choisis.length > 0 && (
        <div className="fixed inset-x-3 bottom-4 z-40 mx-auto max-w-3xl">
          {showCompare && (
            <div className="mb-2 max-h-[60vh] overflow-auto rounded-3xl border bg-background p-4 shadow-soft">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr>
                    <th />
                    {choisis.map((p) => (
                      <th key={p.id} className="p-2 align-bottom">
                        {p.visuel && <img src={p.visuel} alt="" className="mb-2 h-14 w-full object-contain mix-blend-multiply" />}
                        <span className="text-sm font-semibold">{p.nom}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr><td className="p-2 text-muted-foreground">Finition</td>{choisis.map((p) => <td key={p.id} className="p-2">{p.finition}</td>)}</tr>
                  {Array.from(new Set(choisis.flatMap((p) => p.specs.map((s) => s.label)))).map((l) => (
                    <tr key={l}>
                      <td className="p-2 text-muted-foreground">{l}</td>
                      {choisis.map((p) => <td key={p.id} className="p-2">{p.specs.find((s) => s.label === l)?.value ?? "—"}</td>)}
                    </tr>
                  ))}
                  <tr><td className="p-2 text-muted-foreground">Teintes</td>{choisis.map((p) => <td key={p.id} className="p-2">{p.teintes.length}</td>)}</tr>
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 rounded-full border bg-background/90 py-2 pr-2 pl-4 shadow-soft backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs">
              {choisis.map((p) => p.visuel && <img key={p.id} src={p.visuel} alt="" className="h-7 w-10 rounded bg-muted object-contain" />)}
              <span>{choisis.length} profilé{choisis.length > 1 ? "s" : ""} sélectionné{choisis.length > 1 ? "s" : ""} (3 max)</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => { setCompare([]); setShowCompare(false); }}>Vider</Button>
              <Button size="sm" className="rounded-full" disabled={choisis.length < 2} onClick={() => setShowCompare((v) => !v)}>
                {showCompare ? "Masquer" : "Comparer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
