import { ATOUTS_PICTOS } from "@/lib/catalogue";
import { cn } from "@/lib/utils";

/** Les 13 pictos verts « Caractéristiques du composite » du catalogue. */
export function Pictos({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-5",
        compact ? "grid-cols-3 sm:grid-cols-5 lg:grid-cols-7" : "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {ATOUTS_PICTOS.map((a) => (
        <li key={a.titre} className={cn("flex gap-3", compact ? "flex-col items-center text-center" : "items-start")}>
          <img src={a.picto} alt="" className={cn("shrink-0", compact ? "h-12 w-12" : "h-11 w-11")} />
          <div>
            <p className={cn("font-semibold leading-tight", compact && "text-xs")}>{a.titre}</p>
            {!compact && <p className="mt-0.5 text-sm text-muted-foreground">{a.texte}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
