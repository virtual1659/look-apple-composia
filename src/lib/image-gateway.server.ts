export const IMAGE_MODEL = "openai/gpt-image-2.5-sunburst";
export const GATEWAY = "https://ai.gateway.lovable.dev";

export function editImage(apiKey: string, form: FormData, signal?: AbortSignal) {
  const streaming = form.get("stream") !== "false";
  form.set("model", IMAGE_MODEL);
  if (streaming) {
    form.set("stream", "true");
    if (!form.has("partial_images")) form.set("partial_images", "1");
  } else {
    form.delete("stream");
    form.delete("partial_images");
  }
  return fetch(`${GATEWAY}/v1/images/edits`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    signal: signal ?? null,
  });
}
