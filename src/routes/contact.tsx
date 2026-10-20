import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, TEINTES } from "@/lib/catalogue";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Demande de devis · Composia" },
      { name: "description", content: "Demandez un devis pour votre terrasse, façade, clôture ou pergola en composite." },
      { property: "og:title", content: "Demande de devis · Composia" },
      { property: "og:description", content: "Un conseiller vous recontacte pour chiffrer votre projet composite." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const field = "w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground";
const poses = ["Je pose moi-même", "Je cherche un poseur", "J'ai mon artisan"];
const delais = ["Dès que possible", "1 à 3 mois", "Plus tard"];

function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-lg px-2 py-1.5 text-xs transition ${value === o ? "bg-card font-medium shadow-soft" : "text-muted-foreground"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [projets, setProjets] = useState<string[]>([CATEGORIES[0]?.id ?? ""]);
  const [surface, setSurface] = useState(40);
  const [teinte, setTeinte] = useState(TEINTES[2]?.id ?? "");
  const [pose, setPose] = useState(poses[1]!);
  const [delai, setDelai] = useState(delais[1]!);
  const [profil, setProfil] = useState("Particulier");

  const toggle = (id: string) =>
    setProjets((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const recap = [
    ["Projet", CATEGORIES.filter((c) => projets.includes(c.id)).map((c) => c.titre).join(" + ") || "—"],
    ["Surface", `≈ ${surface} m²`],
    ["Teinte", TEINTES.find((t) => t.id === teinte)?.label ?? "À définir"],
    ["Pose", pose],
    ["Délai", delai],
  ];
  const step = sent ? 3 : projets.length ? 2 : 1;
  const cover = CATEGORIES.find((c) => c.id === projets[0])?.image ?? CATEGORIES[0]?.image;

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 text-center md:pt-24">
        <p className="eyebrow">Devis & contact · Gratuit et sans engagement</p>
        <h1 className="mt-4 text-5xl leading-[1.02] md:text-7xl">
          Parlons de <span className="text-wood">votre projet.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Décrivez votre projet en deux minutes : un conseiller vous rappelle avec un devis détaillé, accessoires de pose compris.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-3 md:px-5">
        <div className="grid gap-4 rounded-[2rem] bg-muted p-4 md:p-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-card p-5 shadow-soft md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Votre demande de devis</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Étape {step} sur 3
                {[1, 2, 3].map((n) => (
                  <span key={n} className={`h-1 w-6 rounded-full ${n <= step ? "bg-primary" : "bg-border"}`} />
                ))}
              </div>
            </div>

            {sent ? (
              <div className="mt-10 rounded-2xl bg-muted p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check /></span>
                <p className="mt-4 text-xl font-semibold">Merci, votre demande est prête.</p>
                <p className="mt-2 text-sm text-muted-foreground">Nous revenons vers vous rapidement.</p>
              </div>
            ) : (
              <form
                className="mt-8 space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <fieldset>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <legend className="font-medium uppercase tracking-wide">Votre projet</legend>
                    <span>Plusieurs choix possibles</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {CATEGORIES.map((c) => {
                      const on = projets.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggle(c.id)}
                          className={`relative overflow-hidden rounded-2xl border-2 text-left transition ${on ? "border-primary" : "border-transparent"}`}
                        >
                          <img src={c.image} alt="" className="aspect-[4/3] w-full object-cover" />
                          <span className={`absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card/80"}`}>
                            {on && <Check className="h-3 w-3" />}
                          </span>
                          <span className="block bg-card px-3 py-2 text-xs font-medium">{c.titre}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Surface et teinte</legend>
                  <div className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Surface approximative</span>
                      <span className="text-2xl font-semibold">{surface} m²</span>
                    </div>
                    <input type="range" min={5} max={200} step={5} value={surface} onChange={(e) => setSurface(Number(e.target.value))} className="mt-3 w-full accent-primary" aria-label="Surface en m²" />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {TEINTES.map((t) => (
                      <button key={t.id} type="button" onClick={() => setTeinte(t.id)} aria-label={t.label} className={`overflow-hidden rounded-xl ring-offset-2 transition ${teinte === t.id ? "ring-2 ring-primary" : ""}`}>
                        <img src={t.swatch} alt="" className="aspect-[2/1] w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="space-y-3">
                  <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pose et délai</legend>
                  <div className="grid items-center gap-2 sm:grid-cols-[120px_1fr]"><span className="text-sm">Pour la pose</span><Segmented options={poses} value={pose} onChange={setPose} /></div>
                  <div className="grid items-center gap-2 sm:grid-cols-[120px_1fr]"><span className="text-sm">Délai souhaité</span><Segmented options={delais} value={delai} onChange={setDelai} /></div>
                </fieldset>

                <fieldset className="space-y-3">
                  <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Vos coordonnées</legend>
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                    {["Particulier", "Professionnel"].map((p) => (
                      <button key={p} type="button" onClick={() => setProfil(p)} className={`rounded-lg py-1.5 text-xs ${profil === p ? "bg-card font-medium shadow-soft" : "text-muted-foreground"}`}>{p}</button>
                    ))}
                  </div>
                  <div className="divide-y rounded-2xl border px-4">
                    {[
                      ["Nom", "text", true],
                      ["E-mail", "email", true],
                      ["Téléphone", "tel", false],
                      ["Code postal", "text", false],
                    ].map(([l, t, req]) => (
                      <label key={l as string} className="grid grid-cols-[110px_1fr] items-center text-sm">
                        <span className="text-muted-foreground">{l}</span>
                        <input type={t as string} required={req as boolean} className={field} />
                      </label>
                    ))}
                    <label className="grid grid-cols-[110px_1fr] items-start text-sm">
                      <span className="pt-3 text-muted-foreground">Message</span>
                      <textarea rows={3} placeholder="Support existant (dalle, terre, plots), contraintes d'accès, questions…" className={field} />
                    </label>
                  </div>
                  <label className="flex items-center justify-between gap-4 rounded-2xl border p-4 text-xs">
                    J'accepte que Composia utilise ces informations pour me recontacter au sujet de ma demande.
                    <input type="checkbox" required className="h-5 w-5 accent-primary" />
                  </label>
                </fieldset>

                <Button type="submit" size="lg" className="w-full rounded-full">Envoyer ma demande</Button>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl shadow-soft">
              {cover && <img src={cover} alt="" className="aspect-[3/4] w-full object-cover" />}
              <div className="absolute inset-x-3 bottom-3 rounded-2xl border bg-background/75 p-4 backdrop-blur-xl">
                <p className="text-xs text-muted-foreground">Récapitulatif</p>
                <dl className="mt-2 space-y-1.5 text-xs">
                  {recap.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="rounded-3xl bg-card p-5 shadow-soft">
              <p className="font-semibold">Et ensuite ?</p>
              <ol className="mt-4 space-y-4 text-sm">
                {[
                  ["Accusé de réception", "Votre demande est bien enregistrée."],
                  ["Appel d'un conseiller", "Pour préciser le support et les accès."],
                  ["Devis détaillé", "Lames, ossature et accessoires."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-3">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{i + 1}</span>
                    <div><p className="font-medium">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="text-center text-4xl">Pas un devis ? Par ici.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {([
            ["Simulateur IA", "Visualisez la lame et la teinte sur votre photo.", "/simulateur"],
            ["Pose & accessoires", "Ossature, entraxe, fixation, compatibilité.", "/pose"],
            ["Catalogue", "Tous les profilés, teintes et finitions.", "/catalogue"],
          ] as const).map(([t, d, to]) => (
            <Link key={t} to={to} className="rounded-3xl bg-muted p-6 transition hover:bg-accent">
              <p className="text-lg font-semibold">{t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              <p className="mt-4 text-sm text-primary">Découvrir ›</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
