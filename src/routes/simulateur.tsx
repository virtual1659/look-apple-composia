import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Check, Maximize, Sun, Mountain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZoneEditor, type ZoneEditorHandle } from "@/components/ZoneEditor";
import { BeforeAfter } from "@/components/BeforeAfter";
import { COLORS, MATERIALS } from "@/lib/materials";
import exemplePhoto from "@/assets/exemple-projet.jpg.asset.json";
import { streamImage } from "@/lib/stream-image";

export const Route = createFileRoute("/simulateur")({
  head: () => ({
    meta: [
      { title: "Simulateur IA avant/après · Composia" },
      { name: "description", content: "Importez la photo de votre maison et visualisez votre terrasse, votre clôture ou votre façade en composite grâce à l'IA." },
      { property: "og:title", content: "Simulateur IA avant/après · Composia" },
      { property: "og:description", content: "Visualisez votre projet composite sur votre propre photo en quelques secondes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Simulateur,
});

type Photo = { url: string; blob: Blob; width: number; height: number };

async function toPng(b: Blob, w: number, h: number): Promise<Blob> {
  const img = new Image();
  img.src = URL.createObjectURL(b);
  await img.decode();
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d")!.drawImage(img, 0, 0, w, h);
  return new Promise((r) => c.toBlob((x) => r(x!), "image/png"));
}

async function preparePhoto(file: File): Promise<Photo> {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  const scale = 1536 / Math.max(img.naturalWidth, img.naturalHeight);
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
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{n}</span>
        <h2 className="text-xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

const conseils = [
  { i: Sun, t: "Lumière du jour", d: "Évitez le contre-jour et la nuit : le rendu sera plus fidèle." },
  { i: Maximize, t: "Cadrage large", d: "Prenez toute la surface et un peu de contexte autour." },
  { i: Mountain, t: "Zone dégagée", d: "Limitez les meubles et pieds de chaises dans la zone à recouvrir." },
  { i: Camera, t: "Bonne résolution", d: "Une photo de téléphone récent suffit. JPG ou PNG." },
];

const faq = [
  { q: "Le rendu est-il fidèle à la réalité ?", r: "C'est une aide à la décision. Pour valider la teinte, demandez un échantillon." },
  { q: "Ça fonctionne pour une façade ?", r: "Oui : choisissez « Mur de façade » et délimitez le mur en évitant les fenêtres." },
  { q: "Puis-je simuler plusieurs zones ?", r: "Faites une zone à la fois, puis relancez sur la nouvelle image si besoin." },
  { q: "Que devient ma photo ?", r: "Elle sert uniquement à générer le rendu et n'est pas conservée sur le site." },
  { q: "Est-ce gratuit ?", r: "Oui, le simulateur est gratuit et sans inscription." },
];

function Simulateur() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [surface, setSurface] = useState<"sol" | "mur" | "cloture">("sol");
  const [materialId, setMaterialId] = useState(MATERIALS[0]!.id);
  const [colorId, setColorId] = useState(COLORS[2]!.id);
  const [result, setResult] = useState<string | null>(null);
  const [final, setFinal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const editor = useRef<ZoneEditorHandle>(null);

  const materials = MATERIALS.filter((m) => m.surface === surface);
  const color = COLORS.find((c) => c.id === colorId)!;

  const [detecting, setDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState<string | null>(null);
  const [detectedFor, setDetectedFor] = useState<"sol" | "mur" | "cloture" | null>(null);

  const detect = async (p = photo) => {
    if (!p) return;
    setDetecting(true);
    setDetectMsg(null);
    try {
      // Downsized JPEG for the vision model
      const img = new Image();
      img.src = p.url;
      await img.decode();
      const s = 1024 / Math.max(p.width, p.height);
      const c = document.createElement("canvas");
      c.width = Math.round(p.width * s);
      c.height = Math.round(p.height * s);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      const jpg: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/jpeg", 0.85));
      const form = new FormData();
      form.append("photo", new File([jpg], "photo.jpg", { type: "image/jpeg" }));
      form.append("surface", surface);
      const res = await fetch("/api/detect-zone", { method: "POST", body: form });
      if (!res.ok) throw new Error((await res.text()) || "La détection a échoué.");
      const { polygons } = (await res.json()) as { polygons: [number, number][][] };
      setDetectedFor(surface);
      if (!polygons.length) {
        setDetectMsg("Aucune zone trouvée : délimitez-la à la main avec le polygone ou le pinceau.");
        return;
      }
      editor.current?.fillPolygons(polygons);
      setDetectMsg("Zone détectée. Ajustez avec la gomme ou le pinceau si besoin.");
    } catch (e) {
      setDetectMsg(e instanceof Error ? e.message : "La détection a échoué.");
    } finally {
      setDetecting(false);
    }
  };

  const useExample = async () => {
    try {
      const blob = await (await fetch(exemplePhoto.url)).blob();
      await onFile(new File([blob], "exemple.jpg", { type: blob.type || "image/jpeg" }));
    } catch {
      setError("Impossible de charger la photo d'exemple.");
    }
  };

  const onFile = async (f?: File | null) => {
    if (!f || !f.type.startsWith("image/")) return;
    setResult(null);
    setError(null);
    setDetectedFor(null);
    const p = await preparePhoto(f);
    setPhoto(p);
    setDetectMsg(null);
  };

  const generate = async () => {
    if (!photo || !editor.current) return;
    if (!editor.current.hasSelection()) {
      setError(surface === "cloture" ? "Tracez d'abord la ligne de la clôture au sol (2 points minimum)." : "Délimitez d'abord la zone à recouvrir sur la photo.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    setFinal(false);
    try {
      const swatch = await (await fetch(color.swatch)).blob();
      if (surface === "cloture") {
        const segs = editor.current.getFenceSegments();
        let base: Blob = photo.blob;
        for (let i = 0; i < segs.length; i++) {
          setProgress(`Panneau ${i + 1} sur ${segs.length}`);
          const m = await editor.current.quadMask(segs[i]!);
          const f = new FormData();
          f.append("photo", new File([base], "photo.png", { type: "image/png" }));
          f.append("mask", new File([m!], "mask.png", { type: "image/png" }));
          f.append("swatch", new File([swatch], "swatch.jpg", { type: swatch.type || "image/jpeg" }));
          f.append("material", materialId);
          f.append("color", colorId);
          let last = "";
          await streamImage("/api/simulate", f, (src, isFinal) => {
            last = src;
            setResult(src);
            setFinal(isFinal && i === segs.length - 1);
          });
          base = await (await fetch(last)).blob();
          if (base.type !== "image/png") base = await toPng(base, photo.width, photo.height);
        }
        setTimeout(() => document.getElementById("resultat")?.scrollIntoView({ behavior: "smooth" }), 100);
        return;
      }
      const mask = await editor.current.getMask();
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
      setProgress(null);
    }
  };

  return (
    <>
    <div className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
      <div className="text-center">
        <p className="eyebrow">Simulateur IA · Gratuit, sans inscription</p>
        <h1 className="mt-4 text-5xl leading-[1.02] md:text-7xl">
          Votre extérieur.
          <br />
          <span className="text-wood">Avant les travaux.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Importez une photo de votre terrasse, piscine ou façade, délimitez la zone, choisissez la lame et la teinte : le rendu est prêt en quelques secondes.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
          {["Sols, façades, clôtures", `${COLORS.length} teintes`, "Rendu joint au devis"].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 rounded-[2rem] bg-warm p-3 md:p-6">
      <div className="overflow-hidden rounded-3xl border bg-card shadow-soft">
        <div className="flex items-center gap-2 border-b px-5 py-3">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-sand" />
          <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
          <span className="ml-3 truncate text-xs text-muted-foreground">{photo ? `Photo · ${photo.width}×${photo.height}` : "Nouvelle simulation"}</span>
        </div>
      <div className="grid gap-10 p-5 md:p-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          <Step n={1} title="Importez votre photo">
            {!photo ? (
              <div className="space-y-3">
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
                  className={`flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-center transition-colors ${dragOver ? "border-primary bg-accent/40" : "border-border bg-card hover:bg-muted"}`}
                >
                  <Camera className="h-8 w-8 text-primary" /><span className="text-xl font-semibold">Déposez votre photo ici</span>
                  <span className="text-sm text-muted-foreground">ou touchez pour choisir / prendre une photo · JPG, PNG</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                </label>
                <button
                  type="button"
                  onClick={useExample}
                  className="flex w-full items-center gap-4 rounded-2xl border bg-card p-3 text-left transition-colors hover:bg-accent/40"
                >
                  <img src={exemplePhoto.url} alt="Photo d'exemple : terrasse de piscine, façade et clôture" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                  <span>
                    <span className="block font-semibold">Essayer avec la photo d'exemple</span>
                    <span className="block text-sm text-muted-foreground">Une piscine, une façade et une clôture : les trois surfaces en une seule photo.</span>
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl bg-muted p-3 text-sm">
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
              {surface !== "cloture" && (
              <div className="flex flex-wrap items-center gap-3 rounded-xl bg-accent/40 p-3">
                <Button size="sm" className="rounded-full" disabled={detecting} onClick={() => detect()}>
                  <Sparkles className="mr-1 h-4 w-4" />
                  {detecting ? "Détection en cours…" : detectedFor && detectedFor !== surface ? "Relancer la détection" : "Détection automatique"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {detectMsg ?? (detectedFor && detectedFor !== surface
                    ? "Type de surface changé : relancez la détection."
                    : "L'IA repère la zone, corrigez ensuite avec la gomme ou le pinceau.")}
                </span>
              </div>
              )}
              <ZoneEditor ref={editor} photoUrl={photo.url} width={photo.width} height={photo.height} fence={surface === "cloture"} />
            </Step>
          )}

          {result && photo && (
            <div id="resultat" className="space-y-4">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl">Votre avant / après</h2>
              </div>
              <BeforeAfter before={photo.url} after={result} blur={!final} />
              {final && (
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="rounded-full">
                    <a href={result} download="projet-composite.png">Télécharger l'image</a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/contact">Demander un devis</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="no-reveal h-fit space-y-7 rounded-2xl bg-muted p-5 lg:sticky lg:top-24">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Type de surface</h3>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-card p-1">
              {(["sol", "mur", "cloture"] as const).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={surface === s ? "default" : "ghost"}
                  onClick={() => {
                    setSurface(s);
                    setMaterialId(MATERIALS.find((m) => m.surface === s)!.id);
                  }}
                >
                  {s === "sol" ? "Sol / piscine" : s === "mur" ? "Mur de façade" : "Clôture"}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Lame</h3>
            <div className="mt-3 space-y-2">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaterialId(m.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${materialId === m.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
                >
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs opacity-70">{m.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Teinte</h3>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {COLORS.map((c) => (
                <button key={c.id} onClick={() => setColorId(c.id)} title={c.label} className="group space-y-1">
                  <img
                    src={c.swatch}
                    alt={c.label}
                    loading="lazy"
                    className={`aspect-square w-full rounded-md object-cover ring-offset-2 ring-offset-muted transition ${colorId === c.id ? "ring-2 ring-primary" : "group-hover:opacity-80"}`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm font-semibold">{color.label}</p>
          </div>
          <Button className="w-full rounded-full" size="lg" disabled={!photo || loading} onClick={generate}>
            {loading ? progress ?? "Génération en cours…" : "Générer mon projet"}
          </Button>
          {loading && <p className="text-xs text-muted-foreground">Cela peut prendre jusqu'à une minute.</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {!photo && <p className="text-xs text-muted-foreground">Commencez par importer une photo.</p>}
        </aside>
      </div>
      </div>
      </div>
    </div>

    <section className="mt-20 bg-muted py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="eyebrow">Conseils</p>
          <h2 className="mt-3 text-4xl">Une bonne photo. Un bon rendu.</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {conseils.map((c) => (
            <div key={c.t} className="rounded-3xl bg-card p-6 shadow-soft">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><c.i className="h-4 w-4" /></span>
              <p className="mt-6 font-semibold">{c.t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-3xl px-5 py-20">
      <h2 className="text-center text-4xl">Questions fréquentes.</h2>
      <div className="mt-10 divide-y border-y">
        {faq.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {f.q}
              <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.r}</p>
          </details>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-24 text-center">
      <h2 className="text-4xl md:text-6xl">Un projet en tête <span className="text-wood">?</span></h2>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full"><Link to="/contact">Demander un devis</Link></Button>
        <Button asChild variant="ghost" className="rounded-full text-primary"><Link to="/catalogue">Voir le catalogue ›</Link></Button>
      </div>
    </section>
    </>
  );
}
