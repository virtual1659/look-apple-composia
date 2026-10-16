import { createFileRoute, Link } from "@tanstack/react-router";
import { PhotoGrid } from "@/components/Lightbox";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/catalogue";

export const Route = createFileRoute("/pose")({
  head: () => ({
    meta: [
      { title: "Pose et accessoires · composite bois" },
      {
        name: "description",
        content:
          "Ossature, clips invisibles, plots réglables et visserie : les règles de pose d'une terrasse, d'une clôture ou d'une pergola en composite.",
      },
      { property: "og:title", content: "Pose et accessoires · composite bois" },
      {
        property: "og:description",
        content: "Entraxe de 25 cm, clips invisibles, plots réglables : les principes de pose du composite.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pose,
});

const etapes = [
  {
    t: "Préparer le support",
    d: "Le sol doit être plan et de niveau. Sur dalle béton, l'ossature est fixée par vis béton Buldex ; sur sol irrégulier ou pour surélever, on passe par des plots réglables.",
  },
  {
    t: "Monter l'ossature",
    d: "Lambourdes composite 30/40 mm ou aluminium 40/40 mm, posées à 25 cm d'entraxe. Les plots réglables suivent le même entraxe.",
  },
  {
    t: "Poser les lames",
    d: "Les lames sont fixées sur l'ossature par clips en acier galvanisé 46/42 mm : aucune vis apparente et un jeu de dilatation régulier.",
  },
  {
    t: "Finir les rives",
    d: "Le profilé en L 40/80 mm ferme les rives de terrasse et les jeux contre les murs.",
  },
];

function Pose() {
  const accessoires = CATEGORIES.filter((c) => c.accessoires?.length);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Mise en œuvre</p>
      <h1 className="mt-3 text-4xl md:text-6xl">Pose &amp; accessoires</h1>
      <p className="mt-5 max-w-2xl text-muted-foreground">
        Le composite se pose sur une ossature ventilée, sans vis apparente. Voici les quatre étapes et
        la liste complète des accessoires de la gamme.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {etapes.map((e, i) => (
          <div key={e.t} className="border-t border-foreground/20 pt-5">
            <span className="font-display text-4xl text-primary">0{i + 1}</span>
            <h2 className="mt-2 text-xl">{e.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{e.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 space-y-12">
        {accessoires.map((cat) => (
          <section key={cat.id}>
            <h2 className="text-2xl">{cat.titre}</h2>
            {cat.montage && (
              <PhotoGrid photos={cat.montage} alt={`Montage ${cat.titre}`} className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4" />
            )}
            <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cat.accessoires!.map((a) => (
                <div key={a.nom} className="rounded-xl bg-card p-5 shadow-soft">
                  {a.image && (
                    <img src={a.image} alt="" loading="lazy" className="mb-3 aspect-[4/3] w-full rounded-lg object-contain" />
                  )}
                  <dt className="font-semibold">{a.nom}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{a.description}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <Button asChild className="mt-14">
        <Link to="/contact">Poser une question technique</Link>
      </Button>
    </div>
  );
}
