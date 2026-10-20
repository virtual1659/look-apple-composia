import { createFileRoute } from "@tanstack/react-router";

const PROMPTS = {
  sol: "Identify the main floor covering in this photo (deck boards, tiles, paving, concrete…) that will be replaced by composite decking. First determine which single continuous material covers most of the terrace/floor, then select ONLY the area covered by that same material, following its exact boundaries where the material changes. Exclude anything made of a different material even if adjacent: pool coping/edge stones, stone or tile borders, curbs, steps of another material, drains, water, grass, planters, furniture, walls, sky and vegetation.",
  mur: "Identify the main exterior facade covering in this photo (render, brick, stone, siding…) that will be replaced by composite cladding. First determine which single continuous material covers most of the wall, then select ONLY the area covered by that same material, following its exact boundaries where the material changes. Exclude windows, doors, frames, sills, trims and bands of another material, roof, gutters, ground, sky and vegetation.",
} as const;

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["polygons"],
  properties: {
    polygons: {
      type: "array",
      items: { type: "array", items: { type: "array", items: { type: "number" } } },
    },
  },
};

function toBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export const Route = createFileRoute("/api/detect-zone")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Service IA non configuré", { status: 500 });
        const input = await request.formData();
        const photo = input.get("photo");
        const surface = input.get("surface") === "mur" ? "mur" : "sol";
        if (!(photo instanceof File) || photo.size > 6_000_000) return new Response("Photo requise", { status: 400 });
        const dataUrl = `data:${photo.type || "image/jpeg"};base64,${toBase64(await photo.arrayBuffer())}`;
        const text = `${PROMPTS[surface]} Return one or more polygons tracing these areas precisely, each as a list of [x, y] points (8 to 40 points), with coordinates normalized from 0 to 1000 relative to image width (x) and height (y). Return an empty list if none.`;

        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
            signal: request.signal,
            body: JSON.stringify({
              model: "openai/gpt-6-astra",
              stream: true,
              store: false,
              reasoning: { effort: "low" },
              input: [{ role: "user", content: [{ type: "input_text", text }, { type: "input_image", image_url: dataUrl }] }],
              text: { format: { type: "json_schema", name: "zones", strict: true, schema } },
            }),
          });
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") return new Response(null, { status: 499 });
          throw e;
        }
        if (!upstream.ok || !upstream.body) {
          console.error("detect-zone failed", upstream.status, await upstream.text().catch(() => ""));
          const msg = upstream.status === 402 ? "Crédits IA épuisés." : upstream.status === 429 ? "Trop de demandes, réessayez dans un instant." : "La détection a échoué.";
          return new Response(msg, { status: upstream.status });
        }

        // Read SSE, accumulate output text
        const reader = upstream.body.getReader();
        const dec = new TextDecoder();
        let buf = "", out = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, i).trim();
            buf = buf.slice(i + 1);
            if (!line.startsWith("data:")) continue;
            try {
              const ev = JSON.parse(line.slice(5));
              if (ev.type === "response.output_text.delta") out += ev.delta ?? "";
            } catch { /* ignore */ }
          }
        }

        let polygons: [number, number][][] = [];
        try {
          const raw = JSON.parse(out).polygons;
          if (Array.isArray(raw)) {
            polygons = raw
              .slice(0, 10)
              .map((p: unknown) =>
                (Array.isArray(p) ? p : [])
                  .slice(0, 80)
                  .filter((pt: unknown): pt is number[] => Array.isArray(pt) && pt.length >= 2 && pt.every((n) => typeof n === "number" && isFinite(n)))
                  .map((pt) => [Math.min(1000, Math.max(0, pt[0]!)), Math.min(1000, Math.max(0, pt[1]!))] as [number, number]),
              )
              .filter((p: [number, number][]) => p.length >= 3);
          }
        } catch {
          console.error("detect-zone bad output", out.slice(0, 300));
        }
        return Response.json({ polygons });
      },
    },
  },
});
