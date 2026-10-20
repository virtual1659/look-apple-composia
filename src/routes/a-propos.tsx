import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Layers, Ruler, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pictos } from "@/components/Pictos";
import usine from "@/assets/cephe-vertical.jpg.asset.json";
import facade from "@/assets/cephe-facade.jpg.asset.json";
import pergola from "@/assets/pergola-salon.jpg.asset.json";
import plafond from "@/assets/cephe-plafond.jpg.asset.json";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos · fabricant de composite bois depuis 2007" },
      {
        name: "description",
        content:
          "Un composite 50 % farine de bois, 50 % polymère, produit sur lignes automatisées par un fabricant installé depuis 2007 et issu de trois générations du bois.",
      },
      { property: "og:title", content: "À propos · fabricant de composite bois depuis 2007" },
      {
        property: "og:description",
        content: "50 % bois, 50 % polymère : un matériau durable et recyclable pour l'extérieur.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: usine.url },
      { name: "twitter:image", content: usine.url },
    ],
  }),
  component: APropos,
});

const chiffres = [
  { v: "1980", l: "La famille fondatrice commence son métier dans le bois et la décoration intérieure." },
  { v: "3ᵉ", l: "génération aux commandes, avec la technologie et l'innovation en plus." },
  { v: "2007", l: "Premier fabricant de profilés en composite bois de son pays." },
  { v: "50/50", l: "farine de bois et polymère, pour un matériau durable et recyclable." },
];

const frise = [
  { a: "1980", t: "Le métier du bois", d: "Une entreprise familiale dans le bois et la décoration intérieure." },
  { a: "2007", t: "Le composite", d: "Un projet de recherche et développement aboutit aux premiers profilés." },
  { a: "Aujourd'hui", t: "Lignes automatisées", d: "Une production régulière, du sol à la façade, en cinq teintes." },
  { a: "Composia", t: "Près de chez vous", d: "Conseil, devis et simulateur IA pour visualiser votre projet.", dark: true },
];

const etapes = [
  { t: "Matière", d: "50 % farine de bois, 50 % polymère, mélangés de façon homogène." },
  { t: "Extrusion", d: "Profilés alvéolaires ou pleins, sur lignes entièrement automatisées." },
  { t: "Finition", d: "Texture bois embossée ou film PVC décor, selon le modèle." },
  { t: "Contrôle", d: "Dimensions et teinte vérifiées pour une pose régulière." },
];

const engagements = [
  { i: Leaf, t: "Sans entretien", d: "Ni lasure, ni huile, ni peinture. Ne se fend pas, ne grise pas." },
  { i: Layers, t: "Système complet", d: "Lames, ossature, clips, plots et finitions, tous compatibles." },
  { i: Ruler, t: "Conseil technique", d: "Entraxe, fixation, support : nous vous guidons pour la pose." },
  { i: Wrench, t: "Devis détaillé", d: "Lames, ossature et accessoires chiffrés ensemble." },
];

function APropos() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 text-center md:pt-24">
        <p className="eyebrow">À propos · Qui sommes-nous</p>
        <h1 className="mt-4 text-5xl leading-[1.02] md:text-7xl">
          Des gens du bois.
          <br />
          <span className="text-wood">Un matériau d'aujourd'hui.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Composia distribue des profilés en composite bois pour les terrasses, façades, clôtures et pergolas,
          issus d'un fabricant familial du bois depuis 1980.
        </p>
        <div className="mt-12 grid grid-cols-3 items-end gap-4">
          <img src={facade.url} alt="Façade en bardage composite" className="aspect-[3/4] w-full rounded-3xl object-cover shadow-soft" />
          <img src={pergola.url} alt="Pergola composite" className="aspect-[3/4] w-full rounded-3xl object-cover shadow-soft md:aspect-[4/5]" />
          <img src={plafond.url} alt="Plafond en lames composite" className="aspect-[3/4] w-full rounded-3xl object-cover shadow-soft" />
        </div>
        <dl className="mt-10 grid gap-4 text-left sm:grid-cols-2 md:grid-cols-4">
          {chiffres.map((c, i) => (
            <div key={c.v} className="rounded-3xl bg-muted p-6">
              <dt className={`text-4xl font-semibold tracking-tight ${i === 3 ? "text-wood" : ""}`}>{c.v}</dt>
              <dd className="mt-3 text-sm text-muted-foreground">{c.l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20 bg-muted py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="eyebrow">Notre histoire</p>
            <h2 className="mt-3 text-4xl">Quarante ans de bois.<br />Le composite en plus.</h2>
          </div>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {frise.map((f) => (
              <li key={f.a} className={`rounded-3xl p-6 shadow-soft ${f.dark ? "bg-ink text-ink-foreground" : "bg-card"}`}>
                <span className={`block h-2 w-2 rounded-full ${f.dark ? "bg-primary" : "bg-border"}`} />
                <p className="mt-4 text-2xl font-semibold tracking-tight">{f.a}</p>
                <p className="mt-1 text-sm font-medium">{f.t}</p>
                <p className={`mt-2 text-sm ${f.dark ? "opacity-70" : "text-muted-foreground"}`}>{f.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <p className="eyebrow">Fabrication</p>
          <h2 className="mt-3 text-4xl">Une usine pensée pour la régularité.</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Même formule, même texture, même teinte d'un lot à l'autre.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl shadow-soft">
            <img src={usine.url} alt="Bardage composite vertical" loading="lazy" className="h-full min-h-80 w-full object-cover" />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border bg-background/70 px-4 py-3 backdrop-blur-xl">
              <span className="text-sm">Bois / polymère</span>
              <span className="text-lg font-semibold">50 / 50</span>
            </div>
          </div>
          <div className="rounded-3xl bg-muted p-8">
            <p className="text-lg font-semibold">Quatre étapes, chaque lot.</p>
            <ol className="mt-6 space-y-5">
              {etapes.map((e, i) => (
                <li key={e.t} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold shadow-soft">{i + 1}</span>
                  <div>
                    <p className="font-medium">{e.t}</p>
                    <p className="text-sm text-muted-foreground">{e.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="text-center">
          <p className="eyebrow">Nos engagements</p>
          <h2 className="mt-3 text-4xl">Ce que vous pouvez attendre de nous.</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {engagements.map((e, i) => (
            <div key={e.t} className={`rounded-3xl p-6 shadow-soft ${i === 0 ? "bg-ink text-ink-foreground" : "bg-card border"}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <e.i className="h-4 w-4" />
              </span>
              <p className="mt-6 text-lg font-semibold tracking-tight">{e.t}</p>
              <p className={`mt-2 text-sm ${i === 0 ? "opacity-70" : "text-muted-foreground"}`}>{e.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-warm py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="eyebrow">Propriétés</p>
            <h2 className="mt-3 text-4xl">Pourquoi le composite bois.</h2>
          </div>
          <Pictos className="mt-12" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h2 className="text-4xl md:text-6xl">Rejoignez le réseau <span className="text-wood">Composia.</span></h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">Particulier, poseur ou revendeur : parlons de votre projet.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full"><Link to="/contact">Nous contacter</Link></Button>
          <Button asChild variant="ghost" className="rounded-full text-primary"><Link to="/catalogue">Voir le catalogue ›</Link></Button>
        </div>
      </section>
    </>
  );
}
