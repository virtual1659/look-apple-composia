import gris from "@/assets/sw-gris.jpg";
import chene from "@/assets/sw-chene.jpg";
import cafeClair from "@/assets/sw-cafe-clair.jpg";
import cafeFonce from "@/assets/sw-cafe-fonce.jpg";
import anthracite from "@/assets/sw-anthracite.jpg";

export type ColorOption = { id: string; label: string; en: string; swatch: string; hex: string };
export type Material = {
  id: string;
  name: string;
  subtitle: string;
  surface: "sol" | "mur";
  description: string;
  specs: { label: string; value: string }[];
  promptDescription: string;
};

export const COLORS: ColorOption[] = [
  { id: "gris-clair", label: "Gris clair", en: "light grey", swatch: gris, hex: "#a9a9ab" },
  { id: "chene-clair", label: "Chêne clair", en: "light honey oak", swatch: chene, hex: "#c48e4c" },
  { id: "cafe-clair", label: "Café clair", en: "light coffee reddish-brown", swatch: cafeClair, hex: "#9c5f45" },
  { id: "cafe-fonce", label: "Café foncé", en: "dark coffee brown", swatch: cafeFonce, hex: "#4f3a30" },
  { id: "anthracite", label: "Anthracite", en: "anthracite charcoal grey", swatch: anthracite, hex: "#3a3b3e" },
];

export const MATERIALS: Material[] = [
  {
    id: "are-deck",
    name: "ARE-DECK 145/22",
    subtitle: "Lame de terrasse · effet bois embossé",
    surface: "sol",
    description:
      "Lame alvéolaire 5 canaux pour bords de piscine, allées, terrasses et jardins. Résistante aux UV, à l'humidité et sans entretien.",
    specs: [
      { label: "Largeur", value: "145 mm" },
      { label: "Épaisseur", value: "22 mm" },
      { label: "Finition", value: "Bois embossé" },
    ],
    promptDescription:
      "composite WPC decking boards 145 mm wide with an embossed wood-grain texture, laid in long parallel planks with thin regular gaps",
  },
  {
    id: "are-wall",
    name: "ARE-WALL Bardage",
    subtitle: "Bardage façade · lames horizontales",
    surface: "mur",
    description:
      "Bardage composite pour façades et murs extérieurs. Pose horizontale, joints discrets, stabilité dimensionnelle et tenue des couleurs.",
    specs: [
      { label: "Largeur", value: "156 mm" },
      { label: "Épaisseur", value: "21 mm" },
      { label: "Pose", value: "Horizontale" },
    ],
    promptDescription:
      "composite exterior wall cladding boards 156 mm high installed horizontally, with an embossed wood-grain texture and thin shadow joints",
  },
  {
    id: "are-wall-v",
    name: "ARE-WALL Vertical",
    subtitle: "Bardage façade · lames verticales",
    surface: "mur",
    description: "La même lame de bardage en pose verticale pour allonger visuellement la façade.",
    specs: [
      { label: "Largeur", value: "156 mm" },
      { label: "Épaisseur", value: "21 mm" },
      { label: "Pose", value: "Verticale" },
    ],
    promptDescription:
      "composite exterior wall cladding boards 156 mm wide installed vertically, with an embossed wood-grain texture and thin shadow joints",
  },
];

export function buildPrompt(materialId: string, colorId: string): string | null {
  const m = MATERIALS.find((x) => x.id === materialId);
  const c = COLORS.find((x) => x.id === colorId);
  if (!m || !c) return null;
  const surfaceRule =
    m.surface === "sol"
      ? "The masked area is a floor / ground surface (terrace, pool surround or walkway): lay the boards flat on the ground following its perspective."
      : "The masked area is a building facade wall: clad the wall surface only. Windows, doors, frames, gutters, lights and railings must stay exactly as they are and stay visible.";
  return [
    "Photorealistic architectural renovation preview.",
    `Replace ONLY the transparent (masked) area of the first image with ${m.promptDescription}, colour ${c.en}.`,
    "Match the colour and texture of the second image (the material sample) exactly.",
    surfaceRule,
    "Respect the original perspective, vanishing lines, realistic scale, lighting, shadows and reflections.",
    "Keep everything outside the mask strictly identical: furniture, people, plants, water, sky, objects. Objects standing on the surface stay on top of it with their shadows.",
  ].join(" ");
}
