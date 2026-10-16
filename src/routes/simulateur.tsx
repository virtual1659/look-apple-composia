import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoneEditor, type ZoneEditorHandle } from "@/components/ZoneEditor";
import { BeforeAfter } from "@/components/BeforeAfter";
import { COLORS, MATERIALS } from "@/lib/materials";
import { streamImage } from "@/lib/stream-image";

export const Route = createFileRoute("/simulateur")({
  head: () => ({
    meta: [
      { title: "Simulateur IA avant/après · Composia" },
      { name: "description", content: "Importez la photo de votre maison et visualisez votre terrasse ou façade en composite grâce à l'IA." },
      { property: "og:title", content: "Simulateur IA avant/après · Composia" },
      { property: "og:description", content: "Visualisez votre projet composite sur votre propre photo en quelques secondes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Simulateur,
});

type Photo = { url: string; blob: Blob; width: number; height: number };

async function preparePhoto(file: File): Promise<Photo> {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  const scale = Math.min(1, 1536 / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d")!.drawImage(img, 0, 0, w, h);
  const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/png"));
  return { url: URL.createObjectURL(blob), blob, width: w, height: h };
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl text-primary">0{n}</span>
        <h2 className="text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Simulateur() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [surface, setSurface] = useState<"sol" | "mur">("sol");
  const [materialId, setMaterialId] = useState(MATERIALS[0].id);
  const [colorId, setColorId] = useState(COLORS[2].id);
  const [result, setResult] = useState<string | null>(null);
  const [final, setFinal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const editor = useRef<ZoneEditorHandle>(null);

  const materials = MATERIALS.filter((m) => m.surface === surface);
  const color = COLORS.find((c) => c.id === colorId)!;

  const onFile = async (f?: File | null) => {
    if (!f || !f.type.startsWith("image/")) return;
    setResult(null);
    setError(null);
    setPhoto(await preparePhoto(f));
  };

  const generate = async () => {
    if (!photo || !editor.current) return;
    if (!editor.current.hasSelection()) {
      setError("Délimitez d'abord la zone à recouvrir sur la photo.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    setFinal(false);
    try {
      const mask = await editor.current.getMask();
      const swatch = await (await fetch(color.swatch)).blob();
      const form = new FormData();
      form.append("photo", new File([photo.blob], "photo.png", { type: "image/png" }));
      form.append("mask", new File([mask!], "mask.png", { type: "image/png" }));
      form.append("swatch", new File([swatch], "swatch.jpg", { type: swatch.type || "image/jpeg" }));
      form.append("material", materialId);
      form.append("color", colorId);
      await streamImage("/api/simulate", form, (src, isFinal) => {
        setResult(src);
        setFinal(isFinal);
      });
      setTimeout(() => document.getElementById("resultat")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "La génération a échoué.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <p className="eyebrow">Simulateur IA</p>
      <h1 className="mt-3 max-w-3xl text-4xl md:text-6xl">Voyez votre projet avant de le poser.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Importez une photo de votre terrasse, de votre piscine ou de votre façade, délimitez la zone et choisissez votre composite.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          <Step n={1} title="Importez votre photo">
            {!photo ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  onFile(e.dataTransfer.files[0]);
                }}
                className={`flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed text-center transition-colors ${dragOver ? "border-primary bg-accent/40" : "border-border bg-card hover:bg-muted"}`}
              >
                <span className="font-display text-2xl">Déposez votre photo ici</span>
                <span className="text-sm text-muted-foreground">ou touchez pour choisir / prendre une photo · JPG, PNG</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-lg bg-card p-3 text-sm">
                <span className="text-muted-foreground">Photo chargée ({photo.width}×{photo.height})</span>
                <label className="cursor-pointer font-semibold text-primary">
                  Changer de photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                </label>
              </div>
            )}
          </Step>

          {photo && (
            <Step n={2} title="Délimitez la zone à recouvrir">
              <ZoneEditor ref={editor} photoUrl={photo.url} width={photo.width} height={photo.height} />
            </Step>
          )}

          {result && photo && (
            <div id="resultat" className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-primary">✦</span>
                <h2 className="text-2xl">Votre avant / après</h2>
              </div>
              <BeforeAfter before={photo.url} after={result} blur={!final} />
              {final && (
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href={result} download="projet-composite.png">Télécharger l'image</a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Demander un devis</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="h-fit space-y-8 rounded-2xl bg-card p-6 shadow-soft lg:sticky lg:top-24">
          <div>
            <h3 className="text-lg">03 · Type de surface</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["sol", "mur"] as const).map((s) => (
                <Button
                  key={s}
                  variant={surface === s ? "default" : "outline"}
                  onClick={() => {
                    setSurface(s);
                    setMaterialId(MATERIALS.find((m) => m.surface === s)!.id);
                  }}
                >
                  {s === "sol" ? "Sol / piscine" : "Mur de façade"}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg">04 · Revêtement</h3>
            <div className="mt-3 space-y-2">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaterialId(m.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${materialId === m.id ? "border-primary bg-accent/40" : "hover:bg-muted"}`}
                >
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg">05 · Couleur</h3>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {COLORS.map((c) => (
                <button key={c.id} onClick={() => setColorId(c.id)} title={c.label} className="group space-y-1">
                  <img
                    src={c.swatch}
                    alt={c.label}
                    loading="lazy"
                    className={`aspect-square w-full rounded-md object-cover ring-offset-2 ring-offset-card transition ${colorId === c.id ? "ring-2 ring-primary" : "group-hover:opacity-80"}`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm font-semibold">{color.label}</p>
          </div>
          <Button className="w-full" size="lg" disabled={!photo || loading} onClick={generate}>
            {loading ? "Génération en cours…" : "Générer mon projet"}
          </Button>
          {loading && <p className="text-xs text-muted-foreground">Cela peut prendre jusqu'à une minute.</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {!photo && <p className="text-xs text-muted-foreground">Commencez par importer une photo.</p>}
        </aside>
      </div>
    </div>
  );
}
