import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/** Grille de photos agrandissables au clic. */
export function PhotoGrid({ photos, alt, className }: { photos: string[]; alt: string; className?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <div className={className ?? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(src)}
            className="group overflow-hidden rounded-xl"
            aria-label={`Agrandir la photo ${i + 1}`}
          >
            <img
              src={src}
              alt={`${alt} – photo ${i + 1}`}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-5xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          {open && <img src={open} alt={alt} className="max-h-[85vh] w-full rounded-xl object-contain" />}
        </DialogContent>
      </Dialog>
    </>
  );
}
