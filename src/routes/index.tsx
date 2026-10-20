import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, ChevronsLeftRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPiscine from "@/assets/hero-piscine.jpg.asset.json";
import heroApres from "@/assets/hero-piscine-apres.jpg.asset.json";
import { ATOUTS, ATOUTS_PICTOS, CATEGORIES, TEINTES, TOUS_PRODUITS, img } from "@/lib/catalogue";

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
  const [teinte, setTeinte] = useState(TEINTES[2]?.id ?? "");
  const [pos, setPos] = useState(50);
  const [usage, setUsage] = useState("tous");
  const produitsUsage = usage === "tous" ? TOUS_PRODUITS : (CATEGORIES.find((c) => c.id === usage)?.produits ?? []);
  const stats = [
    { v: String(CATEGORIES.length).padStart(2, "0"), l: "familles de profilés" },
    { v: String(TEINTES.length).padStart(2, "0"), l: "teintes embossées" },
    { v: String(ATOUTS.length), l: "propriétés techniques" },
    { v: "0", l: "lasure, huile ou peinture" },
  ];
  const grands = CATEGORIES.slice(0, 2);
  const petits = CATEGORIES.slice(2, 4);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 text-center md:pt-24">
        <p className="eyebrow">Composite bois · 50 % bois, 50 % polymère</p>
        <h1 className="mt-4 text-5xl leading-[1.02] md:text-7xl">
          Le bois.
          <br />
          <span className="text-wood">Sans l'entretien.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Terrasses, bardages, clôtures et pergolas en composite. Une seule texture, du bord de piscine
          au mur de façade.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full">
            <Link to="/simulateur"><Sparkles /> Simuler ma maison</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full text-primary">
            <Link to="/catalogue">Voir le catalogue <ChevronRight /></Link>
          </Button>
        </div>

        <div className="relative mt-12 select-none overflow-hidden rounded-[2rem] shadow-soft">
          <img
            src={heroPiscine.url}
            alt="Plage de piscine avant : lames bois clair"
            className="aspect-[16/10] w-full object-cover md:aspect-[16/8]"
          />
          <img
            src={heroApres.url}
            alt="Plage de piscine après : lames composite anthracite"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          />
          <div className="pointer-events-none absolute inset-y-0 w-px bg-background/90" style={{ left: `${pos}%` }}>
            <span className="glass absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
              <ChevronsLeftRight className="h-5 w-5" />
            </span>
          </div>
          <input
            type="range" min={0} max={100} value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Comparer avant et après"
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
          <span className="glass pointer-events-none absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium">Avant</span>
          <span className="glass pointer-events-none absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium">Après · Anthracite</span>
          <div className="absolute inset-x-0 bottom-5 flex justify-center">
            <div className="glass flex items-center gap-2 rounded-full p-1.5">
              <span className="px-2 text-xs font-medium">Teinte</span>
              {TEINTES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTeinte(t.id)}
                  aria-label={t.label}
                  title={t.label}
                  className={`h-7 w-7 overflow-hidden rounded-full ring-offset-2 ring-offset-transparent transition ${teinte === t.id ? "ring-2 ring-background" : ""}`}
                >
                  <img src={t.swatch} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <Link to="/simulateur" className="glass absolute right-4 bottom-5 hidden max-w-[15rem] rounded-2xl p-4 text-left lg:block">
            <span className="flex items-center gap-1.5 text-[11px] font-medium opacity-80"><Sparkles className="h-3.5 w-3.5" /> Simulateur IA</span>
            <span className="mt-1 block text-sm font-semibold">Votre photo, votre teinte.</span>
            <span className="mt-1 block text-xs opacity-80">Testez {TEINTES.find((t) => t.id === teinte)?.label.toLowerCase()} sur votre terrasse ou façade ›</span>
          </Link>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-b pb-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="md:border-l md:first:border-l-0">
              <dt className="text-4xl font-semibold tracking-tight">{s.v}</dt>
              <dd className="mt-1 text-xs text-muted-foreground">{s.l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="eyebrow">Nos gammes</p>
            <h2 className="mt-3 text-4xl">Une matière. Quatre usages.</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Lames, clins, brise-soleil, poteaux et poutres : tous les profilés partagent la même texture bois embossée.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-6">
            {grands.map((c) => <FamilyCard key={c.id} c={c} className="md:col-span-3 aspect-[4/3]" />)}
            {petits.map((c) => <FamilyCard key={c.id} c={c} className="md:col-span-2 aspect-[4/3]" />)}
            <Link to="/pose" className="flex flex-col justify-between rounded-3xl bg-card p-6 shadow-soft md:col-span-2">
              <div>
                <p className="eyebrow">Système de pose</p>
                <p className="mt-2 text-xl font-semibold tracking-tight">De la lame au support, tout est au catalogue.</p>
              </div>
              <p className="mt-6 text-sm text-primary">Voir les accessoires ›</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="eyebrow">Nuancier</p>
        <h2 className="mt-3 text-4xl">Cinq teintes. Une texture bois.</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Résistant aux UV, à l'eau chlorée et aux taches. Ne se fend pas, ne grise pas, teinté dans la masse.
        </p>
        <div className="mt-8 inline-flex rounded-xl bg-muted p-1 text-sm">
          {USAGES.map((u) => (
            <button key={u.id} type="button" onClick={() => setUsage(u.id)}
              className={`rounded-lg px-5 py-1.5 font-medium transition ${usage === u.id ? "bg-background shadow-soft" : "text-muted-foreground"}`}>
              {u.label}
            </button>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-2xl items-end justify-center gap-3 md:gap-5">
          {TEINTES.map((t) => {
            const on = teinte === t.id;
            const nb = produitsUsage.filter((p) => p.teintes.some((x) => x.id === t.id)).length;
            const dispo = nb > 0;
            return (
              <button key={t.id} type="button" disabled={!dispo} onClick={() => setTeinte(t.id)} className={`flex-1 text-center transition-opacity ${dispo ? "" : "opacity-30"}`}>
                <img
                  src={t.swatch}
                  alt={t.label}
                  className={`w-full rounded-3xl object-cover shadow-soft transition-all duration-500 ${on ? "aspect-[1/2.6]" : "aspect-[1/2]"}`}
                />
                <span className={`mt-3 block text-xs ${on ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
                <span className="block text-[11px] text-muted-foreground">{dispo ? `${nb} profilé${nb > 1 ? "s" : ""}` : "Non disponible"}</span>
              </button>
            );
          })}
        </div>
        <Link to="/catalogue" className="mt-8 inline-block text-sm text-primary">Comparer les teintes en situation ›</Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Réalisations</p>
            <h2 className="mt-3 text-4xl">En bord de mer.<br />Comme en ville.</h2>
          </div>
          <Link to="/catalogue" className="text-sm text-primary">Toutes les réalisations ›</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {REAL.map((r, i) => (
            <Link key={r.src} to="/catalogue" hash={r.cat}
              className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "col-span-2 aspect-[16/9] md:aspect-auto md:h-72" : "aspect-[4/3] md:aspect-auto md:h-72"} ${i >= 2 ? "md:h-56" : ""}`}>
              <img src={img(r.src)} alt={r.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium">{r.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-warm py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="eyebrow">Propriétés</p>
            <h2 className="mt-3 text-4xl">Pensé pour durer dehors.</h2>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {ATOUTS_PICTOS.slice(0, 12).map((a) => (
              <li key={a.titre} className="glass rounded-2xl p-4">
                <img src={a.picto} alt="" className="h-8 w-8" />
                <p className="mt-5 text-sm font-semibold">{a.titre}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Et {ATOUTS_PICTOS.length - 12} autre : {ATOUTS_PICTOS.slice(12).map((a) => a.titre.toLowerCase()).join(", ")}.{" "}
            <Link to="/a-propos" className="text-primary">Toutes les propriétés ›</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 text-center">
        <p className="eyebrow">Votre projet</p>
        <h2 className="mt-3 text-4xl md:text-6xl">Parlons de votre <span className="text-wood">extérieur.</span></h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Surface, gamme, teinte, pose : envoyez-nous votre projet, un conseiller vous recontacte. {TOUS_PRODUITS.length} profilés disponibles.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full"><Link to="/contact">Demander un devis</Link></Button>
          <Button asChild variant="ghost" className="rounded-full text-primary"><Link to="/simulateur">Essayer le simulateur ›</Link></Button>
        </div>
      </section>
    </>
  );
}

const USAGES = [
  { id: "tous", label: "Tous" },
  { id: "sols", label: "Terrasse" },
  { id: "facades", label: "Façade" },
  { id: "clotures", label: "Clôture" },
];

const REAL = [
  { src: "a-sol-3", label: "Bord de mer · terrasse", cat: "sols" },
  { src: "a-sol-1", label: "Terrasse privée", cat: "sols" },
  { src: "s-pergola-1", label: "Pergola", cat: "pergolas" },
  { src: "a-bs-2", label: "Brise-soleil", cat: "facades" },
  { src: "s-cloture-2", label: "Clôture", cat: "clotures" },
];

function FamilyCard({ c, className = "" }: { c: (typeof CATEGORIES)[number]; className?: string }) {
  return (
    <Link to="/catalogue" hash={c.id} className={`group relative overflow-hidden rounded-3xl shadow-soft ${className}`}>
      <img src={c.image} alt={c.galerie[0]?.alt ?? c.titre} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <div className="glass absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{c.titre}</p>
          <p className="truncate text-xs opacity-80">{c.produits.length} profilés · {c.intro}</p>
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background/90 text-foreground">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
