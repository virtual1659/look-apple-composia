import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ATOUTS } from "@/lib/catalogue";
import usine from "@/assets/cephe-vertical.jpg.asset.json";

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

function APropos() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Qui sommes-nous</p>
      <h1 className="mt-3 max-w-3xl text-4xl md:text-6xl">Trois générations de bois, un matériau d'aujourd'hui.</h1>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-start">
        <div className="space-y-5 text-muted-foreground">
          <p>
            Notre partenaire industriel est devenu en 2007, à la suite d'un projet de recherche et
            développement, le premier fabricant de profilés en composite bois de son pays.
          </p>
          <p>
            Depuis 1980, la famille à l'origine de l'entreprise exerce dans le bois et la décoration
            intérieure : la troisième génération poursuit aujourd'hui ce métier en y ajoutant la
            technologie et l'innovation.
          </p>
          <p>
            Les profilés sont fabriqués sur des lignes entièrement automatisées, à partir de 50 % de
            farine de bois et 50 % de polymère : un matériau innovant, respectueux de l'environnement
            et à forte valeur ajoutée, destiné à la construction et à la décoration haut de gamme.
          </p>
        </div>
        <img
          src={usine.url}
          alt="Bardage composite sur une façade contemporaine"
          loading="lazy"
          className="aspect-[3/4] w-full rounded-2xl object-cover shadow-soft"
        />
      </div>

      <section className="mt-20">
        <p className="eyebrow">Propriétés</p>
        <h2 className="mt-3 text-3xl md:text-4xl">Pourquoi le composite bois</h2>
        <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ATOUTS.map((a) => (
            <div key={a.titre} className="border-t border-foreground/20 pt-4">
              <dt className="font-semibold">{a.titre}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{a.texte}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Button asChild className="mt-14">
        <Link to="/catalogue">Voir le catalogue</Link>
      </Button>
    </div>
  );
}
