import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPiscine from "@/assets/hero-piscine.jpg.asset.json";
import { ATOUTS, CATEGORIES, TEINTES, TOUS_PRODUITS, img } from "@/lib/catalogue";
import { Pictos } from "@/components/Pictos";
import { PhotoGrid } from "@/components/Lightbox";

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
  const [teinte, setTeinte] = useState(TEINTES[2]?.id ?? TEINTES[0].id);
  const stats = [
    { v: String(CATEGORIES.length).padStart(2, "0"), l: "familles de profilés" },
    { v: String(TEINTES.length).padStart(2, "0"), l: "teintes embossées" },
    { v: String(ATOUTS.length), l: "propriétés techniques" },
    { v: "0", l: "lasure, huile ou peinture" },
  ];
  const [c0, c1, c2, c3] = CATEGORIES;

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

        <div className="relative mt-12 overflow-hidden rounded-[2rem] shadow-soft">
          <img
            src={heroPiscine.url}
            alt="Plage de piscine en lames de terrasse composite"
            className="aspect-[16/10] w-full object-cover md:aspect-[16/8]"
          />
          <div className="absolute inset-x-0 bottom-5 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border bg-background/75 p-1.5 backdrop-blur-xl">
              {TEINTES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTeinte(t.id)}
                  aria-label={t.label}
                  className={`h-7 w-7 overflow-hidden rounded-full ring-offset-2 transition ${teinte === t.id ? "ring-2 ring-primary" : ""}`}
                >
                  <img src={t.swatch} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              <Link to="/simulateur" className="px-3 text-xs font-medium text-primary">
                Essayer sur ma photo
              </Link>
            </div>
          </div>
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
            {[c0, c1].filter(Boolean).map((c) => <FamilyCard key={c.id} c={c} className="md:col-span-3 aspect-[4/3]" />)}
            {[c2, c3].filter(Boolean).map((c) => <FamilyCard key={c.id} c={c} className="md:col-span-2 aspect-[4/3]" />)}
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
          Résistant aux UV, à l'eau chlorée et aux taches. Ne se fend pas, ne grise pas.
        </p>
        <div className="mx-auto mt-12 flex max-w-2xl items-end justify-center gap-3 md:gap-5">
          {TEINTES.map((t) => {
            const on = teinte === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setTeinte(t.id)} className="flex-1 text-center">
                <img
                  src={t.swatch}
                  alt={t.label}
                  className={`w-full rounded-2xl object-cover shadow-soft transition-all duration-500 ${on ? "aspect-[1/2.6]" : "aspect-[1/2]"}`}
                />
                <span className={`mt-3 block text-xs ${on ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
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
        <PhotoGrid
          photos={["a-sol-1", "a-sol-3", "a-fac-3", "a-sol-6", "s-pergola-1", "a-fac-6", "s-cloture-2", "a-bs-2"].map(img)}
          alt="Réalisation en composite bois"
          className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 [&_img]:rounded-2xl"
        />
      </section>

      <section className="bg-warm py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="eyebrow">Propriétés</p>
            <h2 className="mt-3 text-4xl">Pensé pour durer dehors.</h2>
          </div>
          <Pictos compact className="mt-12" />
          <div className="mt-8 text-center">
            <Link to="/a-propos" className="text-sm text-primary">Toutes les propriétés ›</Link>
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

function FamilyCard({ c, className = "" }: { c: (typeof CATEGORIES)[number]; className?: string }) {
  return (
    <Link to="/catalogue" hash={c.id} className={`group relative overflow-hidden rounded-3xl shadow-soft ${className}`}>
      <img src={c.image} alt={c.galerie[0]?.alt ?? c.titre} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl border bg-background/70 px-4 py-3 text-left backdrop-blur-xl">
        <div>
          <p className="text-sm font-semibold">{c.titre}</p>
          <p className="text-xs text-muted-foreground">{c.produits.length} profilés</p>
        </div>
        <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
