import { createFileRoute } from "@tanstack/react-router";
import { buildPrompt } from "@/lib/materials";
import { editImage } from "@/lib/image-gateway.server";

export const Route = createFileRoute("/api/simulate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Service IA non configuré", { status: 500 });
        const input = await request.formData();
        const photo = input.get("photo");
        const mask = input.get("mask");
        const swatch = input.get("swatch");
        const prompt = buildPrompt(String(input.get("material") ?? ""), String(input.get("color") ?? ""));
        if (!(photo instanceof File) || !(mask instanceof File) || !(swatch instanceof File) || !prompt) {
          return new Response("Photo, zone et matériau requis", { status: 400 });
        }
        const form = new FormData();
        form.append("image[]", photo);
        form.append("image[]", swatch);
        form.append("mask", mask);
        form.append("prompt", prompt);
        form.append("stream", String(input.get("stream") ?? "true"));
        try {
          const upstream = await editImage(apiKey, form, request.signal);
          if (!upstream.ok) {
            const text = await upstream.text().catch(() => "");
            console.error("image edit failed", upstream.status, text);
            const msg =
              upstream.status === 402
                ? "Crédits IA épuisés. Ajoutez des crédits pour continuer."
                : upstream.status === 429
                  ? "Trop de demandes, réessayez dans un instant."
                  : "La génération a échoué. Réessayez.";
            return new Response(msg, { status: upstream.status });
          }
          return new Response(upstream.body, {
            headers: {
              "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream",
              "Cache-Control": "no-cache, no-transform",
            },
          });
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") return new Response(null, { status: 499 });
          throw e;
        }
      },
    },
  },
});
