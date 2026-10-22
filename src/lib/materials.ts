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
  surface: "sol" | "mur" | "cloture";
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
  {
    id: "are-clos",
    name: "ARE-PROFILÉ CLÔTURE 200/22",
    subtitle: "Clôture · lames horizontales",
    surface: "cloture",
    description:
      "Profilé clôture composite pour brise-vue, palissades et écrans de intimité. Pose horizontale entre poteaux, rendu plein et décoratif.",
    specs: [
      { label: "Largeur", value: "200 mm" },
      { label: "Épaisseur", value: "22 mm" },
      { label: "Finition", value: "Bois embossé" },
    ],
    promptDescription:
      "composite privacy fence panels made of horizontal slats 200 mm high with an embossed wood-grain texture, filling the frame between the existing posts",
  },
];

export function buildPrompt(materialId: string, colorId: string): string | null {
  const m = MATERIALS.find((x) => x.id === materialId);
  const c = COLORS.find((x) => x.id === colorId);
  if (!m || !c) return null;
  const surfaceRule =
    m.surface === "sol"
      ? "The masked area is a floor / ground surface (terrace, pool surround or walkway): lay the boards flat on the ground following its perspective."
      : m.surface === "mur"
        ? "The masked area is a building facade wall: fully re-clad the wall surface with the new boards, even if it already has cladding — the existing cladding must be completely replaced and visibly different. Windows, glass, doors, frames, gutters, lights and railings must stay exactly as they are and stay visible."
        : "Build a NEW continuous solid privacy fence filling the whole masked area. The mask is made of one or several connected quadrilaterals, each one a flat vertical fence panel standing on the ground along its bottom edge; where two quadrilaterals meet there is a corner of the fence. In each panel the opaque horizontal slats follow the perspective of that panel (converging toward the same vanishing point as its top and bottom edges), so each side of a corner has its own slat direction. Put a slim vertical post at each end and at every corner. Nearer panels hide farther ones. The fence fully hides what is behind it inside the mask. Do not spill outside the mask, and keep any objects already standing in front intact.";
  return [
    "Photorealistic architectural renovation preview.",
    `Replace ONLY the transparent (masked) area of the first image with ${m.promptDescription}, colour ${c.en} (approximately ${c.hex}).`,
    `The new boards MUST be clearly ${c.en}: completely discard the original colour of the existing surface, do not keep or blend its hue. Match the colour and texture of the second image (the material sample) exactly.`,
    surfaceRule,
    "Respect the original perspective, vanishing lines, realistic scale, lighting, shadows and reflections.",
    "Keep everything outside the mask strictly identical: furniture, people, plants, water, sky, objects. Objects standing on the surface stay on top of it with their shadows.",
  ].join(" ");
}
