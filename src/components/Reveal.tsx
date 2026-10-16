import { useEffect } from "react";

/** Active les animations d'apparition au défilement pour tous les éléments [data-reveal]. */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("reveal-off");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const scan = () => {
      document.querySelectorAll("main section, main h1, main h2, main li, main a.group, main figure, main button.group, main img").forEach((el) => {
        if (el.hasAttribute("data-reveal")) return;
        if (el.closest("header, [role=dialog], .no-reveal")) return;
        el.setAttribute("data-reveal", "");
        const parent = el.parentElement;
        if (parent) {
          const idx = Array.from(parent.children).indexOf(el);
          (el as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(idx, 8) * 70}ms`);
        }
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          requestAnimationFrame(() => el.classList.add("is-visible"));
        } else io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
