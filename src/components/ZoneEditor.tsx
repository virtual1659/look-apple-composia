import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Tool = "polygon" | "brush" | "eraser";
export type ZoneEditorHandle = {
  getMask: () => Promise<Blob | null>;
  hasSelection: () => boolean;
  fillPolygons: (polys: [number, number][][]) => void;
  getFenceSegments: () => Quad[];
  quadMask: (q: Quad) => Promise<Blob | null>;
};
export type Quad = [number, number][];

function makePattern(ctx: CanvasRenderingContext2D) {
  const p = document.createElement("canvas");
  p.width = p.height = 28;
  const c = p.getContext("2d")!;
  const sel = getComputedStyle(document.documentElement).getPropertyValue("--selection").trim() || "orange";
  c.fillStyle = sel;
  c.globalAlpha = 0.45;
  c.fillRect(0, 0, 28, 28);
  c.globalAlpha = 1;
  c.strokeStyle = sel;
  c.lineWidth = 2;
  c.strokeRect(0, 0, 28, 28);
  return ctx.createPattern(p, "repeat")!;
}

export const ZoneEditor = forwardRef<ZoneEditorHandle, { photoUrl: string; width: number; height: number; fence?: boolean }>(
  function ZoneEditor({ photoUrl, width, height, fence = false }, ref) {
    const [fencePts, setFencePts] = useState<[number, number][]>([]);
    const [fenceH, setFenceH] = useState<number[]>([]);
    const [fenceDone, setFenceDone] = useState(false);
    const [heightPct, setHeightPct] = useState(18);
    const fenceHist = useRef<{ p: [number, number][]; h: number[]; d: boolean }[]>([]);
    const drag = useRef<{ i: number; kind: "foot" | "top" } | null>(null);
    const autoH = (y: number, pct = heightPct) => (pct / 100) * height * (0.35 + 0.9 * (y / height));
    const pushFence = () => {
      fenceHist.current.push({ p: fencePts, h: fenceH, d: fenceDone });
      if (fenceHist.current.length > 40) fenceHist.current.shift();
    };
    const quads = (): Quad[] =>
      fencePts.slice(0, -1).map((a, i) => {
        const b = fencePts[i + 1]!;
        return [a, b, [b[0], b[1] - fenceH[i + 1]!], [a[0], a[1] - fenceH[i]!]];
      });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tool, setTool] = useState<Tool>("polygon");
    const [brush, setBrush] = useState(60);
    const [points, setPoints] = useState<[number, number][]>([]);
    const history = useRef<ImageData[]>([]);
    const drawing = useRef(false);
    const last = useRef<[number, number] | null>(null);
    const [, force] = useState(0);

    const ctx = () => canvasRef.current!.getContext("2d")!;

    useEffect(() => {
      history.current = [];
      setPoints([]);
      ctx().clearRect(0, 0, width, height);
      setFencePts([]);
      setFenceH([]);
      setFenceDone(false);
      fenceHist.current = [];
    }, [photoUrl, width, height]);

    const snapshot = () => {
      history.current.push(ctx().getImageData(0, 0, width, height));
      if (history.current.length > 25) history.current.shift();
      force((n) => n + 1);
    };

    const toCanvas = (e: React.PointerEvent): [number, number] => {
      const r = canvasRef.current!.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * width, ((e.clientY - r.top) / r.height) * height];
    };

    const closePolygon = (pts = points) => {
      if (pts.length < 3) return;
      snapshot();
      const c = ctx();
      c.globalCompositeOperation = "source-over";
      c.fillStyle = makePattern(c);
      c.beginPath();
      pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
      c.closePath();
      c.fill();
      setPoints([]);
    };

    const stroke = (from: [number, number], to: [number, number]) => {
      const c = ctx();
      c.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      c.strokeStyle = tool === "eraser" ? "black" : makePattern(c);
      c.lineWidth = brush * (width / 1000);
      c.lineCap = "round";
      c.lineJoin = "round";
      c.beginPath();
      c.moveTo(...from);
      c.lineTo(...to);
      c.stroke();
    };

    const onDown = (e: React.PointerEvent) => {
      e.preventDefault();
      const p = toCanvas(e);
      if (fence) {
        const r = width * 0.02;
        for (let i = 0; i < fencePts.length; i++) {
          const [x, y] = fencePts[i]!;
          const kind = Math.hypot(x - p[0], y - fenceH[i]! - p[1]) < r ? "top" : Math.hypot(x - p[0], y - p[1]) < r ? "foot" : null;
          if (kind) {
            pushFence();
            (e.target as Element).setPointerCapture(e.pointerId);
            drag.current = { i, kind };
            return;
          }
        }
        if (fenceDone) return;
        pushFence();
        setFencePts([...fencePts, p]);
        setFenceH([...fenceH, autoH(p[1])]);
        return;
      }
      if (tool === "polygon") {
        if (points.length >= 3) {
          const [fx, fy] = points[0]!;
          if (Math.hypot(fx - p[0], fy - p[1]) < width * 0.025) return closePolygon();
        }
        setPoints([...points, p]);
        return;
      }
      (e.target as Element).setPointerCapture(e.pointerId);
      snapshot();
      drawing.current = true;
      last.current = p;
      stroke(p, p);
    };
    const onMove = (e: React.PointerEvent) => {
      if (drag.current) {
        const p = toCanvas(e);
        const { i, kind } = drag.current;
        if (kind === "foot") setFencePts(fencePts.map((q, k) => (k === i ? p : q)));
        else setFenceH(fenceH.map((h, k) => (k === i ? Math.max(10, fencePts[i]![1] - p[1]) : h)));
        return;
      }
      if (!drawing.current || !last.current) return;
      const p = toCanvas(e);
      stroke(last.current, p);
      last.current = p;
    };
    const onUp = () => {
      drag.current = null;
      drawing.current = false;
      last.current = null;
    };

    const undo = () => {
      if (fence) {
        const prev = fenceHist.current.pop();
        if (prev) {
          setFencePts(prev.p);
          setFenceH(prev.h);
          setFenceDone(prev.d);
        }
        return;
      }
      if (points.length) return setPoints(points.slice(0, -1));
      const prev = history.current.pop();
      if (prev) ctx().putImageData(prev, 0, 0);
      force((n) => n + 1);
    };
    const clear = () => {
      if (fence) {
        pushFence();
        setFencePts([]);
        setFenceH([]);
        setFenceDone(false);
        return;
      }
      snapshot();
      ctx().clearRect(0, 0, width, height);
      setPoints([]);
    };

    useImperativeHandle(ref, () => ({
      fillPolygons: (polys) => {
        snapshot();
        const c = ctx();
        c.clearRect(0, 0, width, height);
        c.globalCompositeOperation = "source-over";
        c.fillStyle = makePattern(c);
        for (const pts of polys) {
          c.beginPath();
          pts.forEach(([x, y], i) => {
            const px = (x / 1000) * width, py = (y / 1000) * height;
            if (i) c.lineTo(px, py); else c.moveTo(px, py);
          });
          c.closePath();
          c.fill();
        }
        setPoints([]);
      },
      getFenceSegments: () =>
        quads().sort((a, b) => a[0]![1] + a[1]![1] - (b[0]![1] + b[1]![1])),
      quadMask: (q) => {
        const d = document.createElement("canvas");
        d.width = width;
        d.height = height;
        const dc = d.getContext("2d")!;
        dc.fillStyle = "black";
        dc.fillRect(0, 0, width, height);
        dc.globalCompositeOperation = "destination-out";
        dc.filter = "blur(2px)";
        dc.beginPath();
        q.forEach(([x, y], i) => (i ? dc.lineTo(x, y) : dc.moveTo(x, y)));
        dc.closePath();
        dc.fill();
        return new Promise((res) => d.toBlob(res, "image/png"));
      },
      hasSelection: () => {
        if (fence) return fencePts.length >= 2;
        const d = ctx().getImageData(0, 0, width, height).data;
        for (let i = 3; i < d.length; i += 64) if ((d[i] ?? 0) > 0) return true;
        return false;
      },
      getMask: () => {
        // The on-screen selection is a semi-transparent pattern; turn every
        // selected pixel into a fully transparent (fully editable) mask pixel.
        const src = canvasRef.current!.getContext("2d")!.getImageData(0, 0, width, height);
        const m = document.createElement("canvas");
        m.width = width;
        m.height = height;
        const mc = m.getContext("2d")!;
        const out = mc.createImageData(width, height);
        for (let i = 0; i < src.data.length; i += 4) {
          out.data[i + 3] = src.data[i + 3]! > 8 ? 0 : 255; // black opaque = keep
        }
        mc.putImageData(out, 0, 0);
        // Slight dilation so edges blend naturally, then re-harden
        const d = document.createElement("canvas");
        d.width = width;
        d.height = height;
        const dc = d.getContext("2d")!;
        dc.fillStyle = "black";
        dc.fillRect(0, 0, width, height);
        dc.globalCompositeOperation = "destination-out";
        const sel = document.createElement("canvas");
        sel.width = width;
        sel.height = height;
        const sc = sel.getContext("2d")!;
        sc.fillStyle = "black";
        sc.fillRect(0, 0, width, height);
        sc.globalCompositeOperation = "destination-out";
        sc.drawImage(m, 0, 0);
        dc.filter = "blur(3px)";
        for (let k = 0; k < 3; k++) dc.drawImage(sel, 0, 0);
        return new Promise((res) => d.toBlob(res, "image/png"));
      },
    }));

    const tools: { id: Tool; label: string }[] = [
      { id: "polygon", label: "Polygone" },
      { id: "brush", label: "Pinceau" },
      { id: "eraser", label: "Gomme" },
    ];

    return (
      <div className="space-y-3">
        {fence ? (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Hauteur
            <input
              type="range"
              min={5}
              max={45}
              value={heightPct}
              onChange={(e) => {
                const v = +e.target.value;
                setHeightPct(v);
                setFenceH(fencePts.map((p) => autoH(p[1], v)));
              }}
            />
          </label>
          <div className="ml-auto flex gap-2">
            {!fenceDone && fencePts.length >= 2 && (
              <Button size="sm" onClick={() => { pushFence(); setFenceDone(true); }}>
                Terminer le tracé
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={undo}>Annuler</Button>
            <Button size="sm" variant="ghost" onClick={clear}>Tout effacer</Button>
          </div>
        </div>
        ) : (
        <div className="flex flex-wrap items-center gap-2">
          {tools.map((t) => (
            <Button key={t.id} size="sm" variant={tool === t.id ? "default" : "outline"} onClick={() => setTool(t.id)}>
              {t.label}
            </Button>
          ))}
          {tool !== "polygon" && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Taille
              <input type="range" min={15} max={160} value={brush} onChange={(e) => setBrush(+e.target.value)} />
            </label>
          )}
          <div className="ml-auto flex gap-2">
            {points.length >= 3 && (
              <Button size="sm" onClick={() => closePolygon()}>
                Fermer la zone
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={undo}>
              Annuler
            </Button>
            <Button size="sm" variant="ghost" onClick={clear}>
              Tout effacer
            </Button>
          </div>
        </div>
        )}
        <p className="text-sm text-muted-foreground">
          {fence
            ? fenceDone
              ? "Déplacez un point au sol ou une poignée de hauteur pour ajuster chaque angle."
              : "Cliquez au pied de la clôture, point par point à chaque angle, puis « Terminer le tracé » (ou double-clic)."
            : tool === "polygon"
            ? "Cliquez autour de la zone point par point, puis cliquez sur le premier point (ou « Fermer la zone »)."
            : tool === "brush"
              ? "Peignez la zone à recouvrir."
              : "Effacez les parties à exclure (fenêtres, mobilier…)."}
        </p>
        <div className="relative overflow-hidden rounded-xl bg-muted shadow-soft">
          <img src={photoUrl} alt="Votre photo" className="block w-full" draggable={false} />
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            onDoubleClick={() => fence && fencePts.length >= 2 && setFenceDone(true)}
          />
          <svg viewBox={`0 0 ${width} ${height}`} className="pointer-events-none absolute inset-0 h-full w-full">
            {fence && quads().map((q, i) => (
              <polygon key={"q" + i} points={q.map((p) => p.join(",")).join(" ")} fill="var(--selection)" fillOpacity={0.4} stroke="var(--selection)" strokeWidth={width / 400} />
            ))}
            {fence && fencePts.length > 1 && (
              <polyline points={fencePts.map((p) => p.join(",")).join(" ")} fill="none" stroke="white" strokeWidth={width / 350} strokeDasharray={`${width / 120} ${width / 200}`} />
            )}
            {fence && fencePts.map(([x, y], i) => (
              <g key={"f" + i}>
                <circle cx={x} cy={y} r={width / 110} fill="var(--selection)" stroke="white" strokeWidth={width / 500} />
                <circle cx={x} cy={y - fenceH[i]!} r={width / 160} fill="white" stroke="var(--selection)" strokeWidth={width / 400} />
              </g>
            ))}
            {points.length > 0 && (
              <polyline
                points={points.map((p) => p.join(",")).join(" ")}
                fill="none"
                stroke="var(--selection)"
                strokeWidth={width / 300}
                strokeDasharray={`${width / 100} ${width / 200}`}
              />
            )}
            {points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={width / (i === 0 ? 90 : 160)} fill="var(--selection)" stroke="var(--background)" strokeWidth={width / 500} />
            ))}
          </svg>
        </div>
      </div>
    );
  },
);
