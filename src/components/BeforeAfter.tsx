import { useState } from "react";

export function BeforeAfter({ before, after, blur }: { before: string; after: string; blur?: boolean }) {
  const [pos, setPos] = useState(0);
  return (
    <div className="relative w-full select-none overflow-hidden rounded-xl bg-muted shadow-soft">
      <img src={before} alt="Avant" className="block w-full" />
      <img
        src={after}
        alt="Après"
        className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 ${blur ? "blur-md" : ""}`}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      />
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-background" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground shadow-soft">
          ⇆
        </div>
      </div>
      <span className="absolute top-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-ink-foreground">Avant</span>
      <span className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Après</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparer avant et après"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
