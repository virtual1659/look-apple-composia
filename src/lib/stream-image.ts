import { createParser } from "eventsource-parser";
import { flushSync } from "react-dom";

type ImagePayload = { type?: string; b64_json?: string; error?: { message?: string } };

export async function streamImage(
  endpoint: string,
  input: FormData,
  onFrame: (dataUrl: string, isFinal: boolean) => void,
): Promise<void> {
  const send = (stream: boolean) => {
    const form = new FormData();
    input.forEach((value, name) => form.append(name, value));
    form.set("stream", String(stream));
    return fetch(endpoint, { method: "POST", body: form });
  };
  const res = await send(true);
  if (!res.ok || !res.body) throw new Error((await res.text().catch(() => "")) || `Erreur ${res.status}`);

  let sawCompleted = false;
  let sawAnyEvent = false;
  let streamError: string | undefined;
  const parser = createParser({
    onEvent(event) {
      let payload: ImagePayload | undefined;
      try {
        payload = JSON.parse(event.data) as ImagePayload;
      } catch {
        payload = undefined;
      }
      if (event.event === "error" || payload?.type === "error") {
        sawAnyEvent = true;
        streamError = payload?.error?.message ?? "La génération a échoué";
        return;
      }
      const type = event.event || payload?.type;
      if (
        type !== "image_generation.partial_image" &&
        type !== "image_generation.completed" &&
        type !== "image_edit.partial_image" &&
        type !== "image_edit.completed"
      )
        return;
      sawAnyEvent = true;
      if (!payload?.b64_json) {
        streamError = "Aucune image reçue";
        return;
      }
      const isFinal = type === "image_generation.completed" || type === "image_edit.completed";
      const b64 = payload.b64_json;
      flushSync(() => onFrame(`data:image/png;base64,${b64}`, isFinal));
      if (isFinal) sawCompleted = true;
    },
  });
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  try {
    while (true) {
      let chunk: ReadableStreamReadResult<string>;
      try {
        chunk = await reader.read();
      } catch (error) {
        if (sawAnyEvent) throw error;
        break;
      }
      if (chunk.done) break;
      parser.feed(chunk.value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  if (streamError) throw new Error(streamError);
  if (!sawAnyEvent) {
    const replay = await send(false);
    if (!replay.ok) throw new Error((await replay.text().catch(() => "")) || `Erreur ${replay.status}`);
    const json = (await replay.json()) as { data?: { b64_json?: string }[] };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new Error("Aucune image reçue");
    onFrame(`data:image/png;base64,${b64}`, true);
    return;
  }
  if (!sawCompleted) throw new Error("La génération s'est interrompue");
}
