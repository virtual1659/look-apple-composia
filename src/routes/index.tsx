import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";
import { COLORS } from "@/lib/materials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Composia · Terrasses et façades en composite" },
      { name: "description", content: "Lames de terrasse et bardages composites. Visualisez votre projet sur votre photo grâce à notre simulateur IA." },
      { property: "og:title", content: "Composia · Terrasses et façades en composite" },
      { property: "og:description", content: "Matériaux composites sans entretien et simulateur IA avant/après." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { t: "Importez", d: "Une photo de votre terrasse, piscine ou façade, prise au téléphone." },
  { t: "Délimitez", d: "Tracez la zone à recouvrir : sol, tour de piscine, mur entre les fenêtres." },
  { t: "Choisissez", d: "Le revêtement et sa couleur parmi notre nuancier." },
  { t: "Visualisez", d: "L'IA génère votre avant / après réaliste en quelques secondes." },
];

function Index() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={hero} alt="Terrasse composite autour d'une piscine" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 text-ink-foreground">
          <p className="eyebrow text-sand">Matériaux composites</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.02] md:text-7xl">L'aspect du bois. Sans l'entretien.</h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">
            Terrasses, tours de piscine et bardages de façade. Essayez-les sur votre maison avant de décider.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/simulateur">Essayer le simulateur IA</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/catalogue">Voir le catalogue</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">Comment ça marche</p>
        <h2 className="mt-3 max-w-2xl text-4xl">Votre projet, sur votre photo, en quatre gestes.</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="border-t border-foreground/20 pt-5">
              <span className="font-display text-4xl text-primary">0{i + 1}</span>
              <h3 className="mt-2 text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-ink-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow text-sand">Nuancier</p>
            <h2 className="mt-3 text-4xl">Cinq teintes, une texture bois embossée.</h2>
            <p className="mt-4 opacity-80">Résistant aux UV, à l'eau chlorée et aux taches. Ne se fend pas, ne grise pas, ne demande ni lasure ni huile.</p>
            <Button asChild className="mt-8">
              <Link to="/catalogue">Découvrir les produits</Link>
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((c) => (
              <figure key={c.id}>
                <img src={c.swatch} alt={c.label} loading="lazy" className="aspect-[1/2] w-full rounded-md object-cover" />
                <figcaption className="mt-2 text-xs opacity-80">{c.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
