import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Tool = "polygon" | "brush" | "eraser";
export type ZoneEditorHandle = { getMask: () => Promise<Blob | null>; hasSelection: () => boolean };

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

export const ZoneEditor = forwardRef<ZoneEditorHandle, { photoUrl: string; width: number; height: number }>(
  function ZoneEditor({ photoUrl, width, height }, ref) {
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
      if (!drawing.current || !last.current) return;
      const p = toCanvas(e);
      stroke(last.current, p);
      last.current = p;
    };
    const onUp = () => {
      drawing.current = false;
      last.current = null;
    };

    const undo = () => {
      if (points.length) return setPoints(points.slice(0, -1));
      const prev = history.current.pop();
      if (prev) ctx().putImageData(prev, 0, 0);
      force((n) => n + 1);
    };
    const clear = () => {
      snapshot();
      ctx().clearRect(0, 0, width, height);
      setPoints([]);
    };

    useImperativeHandle(ref, () => ({
      hasSelection: () => {
        const d = ctx().getImageData(0, 0, width, height).data;
        for (let i = 3; i < d.length; i += 64) if ((d[i] ?? 0) > 0) return true;
        return false;
      },
      getMask: () => {
        const m = document.createElement("canvas");
        m.width = width;
        m.height = height;
        const mc = m.getContext("2d")!;
        mc.fillStyle = "black";
        mc.fillRect(0, 0, width, height);
        mc.globalCompositeOperation = "destination-out";
        // Slight dilation so edges blend naturally
        mc.filter = "blur(2px)";
        mc.drawImage(canvasRef.current!, 0, 0);
        mc.drawImage(canvasRef.current!, 0, 0);
        return new Promise((res) => m.toBlob(res, "image/png"));
      },
    }));

    const tools: { id: Tool; label: string }[] = [
      { id: "polygon", label: "Polygone" },
      { id: "brush", label: "Pinceau" },
      { id: "eraser", label: "Gomme" },
    ];

    return (
      <div className="space-y-3">
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
        <p className="text-sm text-muted-foreground">
          {tool === "polygon"
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
          />
          <svg viewBox={`0 0 ${width} ${height}`} className="pointer-events-none absolute inset-0 h-full w-full">
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
