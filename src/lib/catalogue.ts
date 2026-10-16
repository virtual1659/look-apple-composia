import gris from "@/assets/sw-gris.jpg";
import chene from "@/assets/sw-chene.jpg";
import cafeClair from "@/assets/sw-cafe-clair.jpg";
import cafeFonce from "@/assets/sw-cafe-fonce.jpg";
import anthracite from "@/assets/sw-anthracite.jpg";

import solHotel from "@/assets/sol-hotel.jpg.asset.json";
import solCabanas from "@/assets/sol-cabanas.jpg.asset.json";
import solMer from "@/assets/sol-mer.jpg.asset.json";
import solTerrasse from "@/assets/sol-terrasse.jpg.asset.json";
import cepheFacade from "@/assets/cephe-facade.jpg.asset.json";
import cepheVertical from "@/assets/cephe-vertical.jpg.asset.json";
import cepheMaison from "@/assets/cephe-maison.jpg.asset.json";
import cephePlafond from "@/assets/cephe-plafond.jpg.asset.json";
import briseSoleil from "@/assets/brise-soleil.jpg.asset.json";
import clotAnthracite from "@/assets/clot-anthracite.jpg.asset.json";
import clotBrun from "@/assets/clot-brun.jpg.asset.json";
import clotBalcon from "@/assets/clot-balcon.jpg.asset.json";
import pergolaJardin from "@/assets/pergola-jardin.jpg.asset.json";
import pergolaSalon from "@/assets/pergola-salon.jpg.asset.json";
import pergolaRestaurant from "@/assets/pergola-restaurant.jpg.asset.json";

export type Teinte = { id: string; label: string; swatch: string };

export const TEINTES: Teinte[] = [
  { id: "gris-clair", label: "Gris clair", swatch: gris },
  { id: "chene-clair", label: "Chêne clair", swatch: chene },
  { id: "cafe-clair", label: "Café clair", swatch: cafeClair },
  { id: "cafe-fonce", label: "Café foncé", swatch: cafeFonce },
  { id: "anthracite", label: "Anthracite", swatch: anthracite },
];

/** Les gammes clôture et pergola n'existent pas en gris clair. */
export const TEINTES_BOIS = TEINTES.filter((t) => t.id !== "gris-clair");

export type Produit = {
  id: string;
  /** Vue produit (profilé) extraite du catalogue. */
  visuel?: string;
  /** Photos de mise en situation réelle. */
  situation?: string[];
  /** Nuancier des films PVC extérieurs, pour les finitions filmées. */
  folio?: string;
  nom: string;
  finition: string;
  description: string;
  specs: { label: string; value: string }[];
  teintes: Teinte[];
};

export type Categorie = {
  id: string;
  titre: string;
  intro: string;
  image: string;
  galerie: { src: string; alt: string }[];
  produits: Produit[];
  accessoires?: { nom: string; description: string; image?: string }[];
  /** Photos de réalisations de la gamme. */
  realisations?: string[];
  /** Photos de pose et schémas de montage. */
  montage?: string[];
};

const usageSol =
  "Bord de piscine, allée, terrasse, aire de jeux, jardin et aménagement paysager : une solution durable et esthétique face aux intempéries.";
const usageFacade =
  "Habillage décoratif et protecteur des murs intérieurs et extérieurs de vos bâtiments.";
const usageCloture =
  "Nos systèmes de clôture composite délimitent vos espaces privatifs avec un rendu décoratif et une protection longue durée.";
const usagePergola =
  "Nos profilés de pergola composent des espaces de vie extérieurs esthétiques et résistants.";

const CATEGORIES_BASE: Categorie[] = [
  {
    id: "sols",
    titre: "Sols & terrasses",
    intro:
      "Lames de terrasse composite alvéolaires ou pleines, en finition bois embossé, rainures larges ou film PVC. Pose sur lambourdes composite, aluminium ou plots réglables.",
    image: solTerrasse.url,
    galerie: [
      { src: solHotel.url, alt: "Plage de piscine d'hôtel en lames composite" },
      { src: solCabanas.url, alt: "Terrasse composite avec cabanas en bord de mer" },
      { src: solMer.url, alt: "Promenade composite le long du littoral" },
      { src: solTerrasse.url, alt: "Terrasse composite autour d'une piscine privée" },
    ],
    produits: [
      {
        id: "deck-150-25",
        nom: "ARE-DECK 150/25",
        finition: "Alvéolaire 4 canaux",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "150 mm" },
          { label: "Épaisseur", value: "25 mm" },
          { label: "Structure", value: "4 canaux" },
        ],
        teintes: TEINTES,
      },
      {
        id: "deck-145-22",
        nom: "ARE-DECK 145/22",
        finition: "Alvéolaire 5 canaux",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "145 mm" },
          { label: "Épaisseur", value: "22 mm" },
          { label: "Structure", value: "5 canaux" },
        ],
        teintes: TEINTES,
      },
      {
        id: "deck-145-28",
        nom: "ARE-DECK 145/28",
        finition: "Alvéolaire 4 canaux",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "145 mm" },
          { label: "Épaisseur", value: "28 mm" },
          { label: "Structure", value: "4 canaux" },
        ],
        teintes: TEINTES,
      },
      {
        id: "deck-150-26",
        nom: "ARE-DECK 150/26",
        finition: "Alvéolaire 4 canaux",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "150 mm" },
          { label: "Épaisseur", value: "26 mm" },
          { label: "Structure", value: "4 canaux" },
        ],
        teintes: TEINTES,
      },
      {
        id: "deck-150-26-large",
        nom: "ARE-DECK 150/26",
        finition: "Rainures larges",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "150 mm" },
          { label: "Épaisseur", value: "26 mm" },
          { label: "Surface", value: "Rainures larges" },
        ],
        teintes: TEINTES,
      },
      {
        id: "deck-145-22-bois",
        nom: "ARE-DECK 145/22",
        finition: "Alvéolaire, bois embossé",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "145 mm" },
          { label: "Épaisseur", value: "22 mm" },
          { label: "Surface", value: "Bois embossé" },
        ],
        teintes: TEINTES,
      },
      {
        id: "deck-145-22-plein",
        nom: "ARE-DECK 145/22 PLEIN",
        finition: "Profilé plein (Solid deck)",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "145 mm" },
          { label: "Épaisseur", value: "22 mm" },
          { label: "Structure", value: "Pleine" },
        ],
        teintes: TEINTES,
      },
      {
        id: "deck-145-22-plein-bois",
        nom: "ARE-DECK 145/22 PLEIN",
        finition: "Profilé plein, bois embossé",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "145 mm" },
          { label: "Épaisseur", value: "22 mm" },
          { label: "Structure", value: "Pleine" },
          { label: "Surface", value: "Bois embossé" },
        ],
        teintes: TEINTES,
      },
      {
        id: "decklam-145-28",
        nom: "ARE-DECKLAM 145/28",
        finition: "Surface filmée PVC extérieur",
        description:
          "Version filmée PVC de nos lames de terrasse, pour un rendu bois très réaliste au bord de piscine, sur les terrasses et les allées.",
        specs: [
          { label: "Largeur", value: "145 mm" },
          { label: "Épaisseur", value: "28 mm" },
          { label: "Surface", value: "Film PVC extérieur" },
        ],
        teintes: TEINTES,
      },
    ],
    accessoires: [
      {
        nom: "Lambourde WPC 30/40 mm",
        description:
          "Ossature support de la terrasse sur sol plan et de niveau. Entraxe de pose : 25 cm.",
      },
      {
        nom: "Profilé de rive en L 40/80 mm",
        description:
          "Ferme les rives de terrasse et les jeux entre terrasse et mur ; s'utilise aussi en finition décorative.",
      },
      {
        nom: "Clips de fixation 46/42 mm",
        description:
          "Clip en tôle d'acier galvanisé, il fixe les lames sur les lambourdes de façon invisible.",
      },
      {
        nom: "Plot réglable pedestal",
        description:
          "Pour les sols irréguliers ou les terrasses surélevées, en complément de l'ossature. Entraxe : 25 cm.",
      },
      {
        nom: "Lambourde aluminium 40/40 mm",
        description: "Ossature posée sur plots réglables. Entraxe de pose : 25 cm.",
      },
      {
        nom: "Colle polyuréthane",
        description:
          "Mastic-colle élastique multi-supports : métal, surfaces peintes, bois, pierre, béton, polyester et PVC rigide.",
      },
      {
        nom: "Vis lambourde composite",
        description: "Fixe le clip de montage sur la lambourde composite.",
      },
      { nom: "Vis lambourde métal", description: "Fixe le clip de montage sur l'ossature métallique." },
      { nom: "Vis béton Buldex", description: "Fixe l'ossature composite sur un sol béton." },
    ],
  },
  {
    id: "facades",
    titre: "Façades & bardages",
    intro:
      "Panneaux muraux, clins et brise-soleil composite pour habiller une façade, un mur intérieur ou un plafond extérieur, en finition bois embossé, lisse ou filmée PVC.",
    image: cepheMaison.url,
    galerie: [
      { src: cepheMaison.url, alt: "Maison contemporaine avec bardage composite" },
      { src: cepheFacade.url, alt: "Façade de villa habillée en composite" },
      { src: cepheVertical.url, alt: "Bardage composite en pose verticale" },
      { src: cephePlafond.url, alt: "Plafond extérieur en lames composite" },
    ],
    produits: [
      {
        id: "panneau-220-26-lisse",
        nom: "ARE-PANNEAU MURAL 220/26",
        finition: "Surface lisse",
        description: usageFacade,
        specs: [
          { label: "Largeur", value: "220 mm" },
          { label: "Épaisseur", value: "26 mm" },
          { label: "Surface", value: "Lisse" },
        ],
        teintes: TEINTES,
      },
      {
        id: "panneau-220-26-bois",
        nom: "ARE-PANNEAU MURAL 220/26",
        finition: "Bois embossé",
        description: usageFacade,
        specs: [
          { label: "Largeur", value: "220 mm" },
          { label: "Épaisseur", value: "26 mm" },
          { label: "Surface", value: "Bois embossé" },
        ],
        teintes: TEINTES,
      },
      {
        id: "clin-186-21-bois",
        nom: "ARE-CLIN 186/21",
        finition: "Bois embossé",
        description: usageFacade,
        specs: [
          { label: "Largeur", value: "185 mm" },
          { label: "Épaisseur", value: "21 mm" },
          { label: "Surface", value: "Bois embossé" },
        ],
        teintes: TEINTES,
      },
      {
        id: "clin-186-21-folio",
        nom: "ARE-CLIN 186/21",
        finition: "Surface filmée PVC",
        description:
          "Clin de façade filmé PVC, disponible dans notre gamme de décors extérieurs, pour les murs intérieurs comme extérieurs.",
        specs: [
          { label: "Largeur", value: "185 mm" },
          { label: "Épaisseur", value: "21 mm" },
          { label: "Surface", value: "Film PVC extérieur" },
        ],
        teintes: TEINTES,
      },
      {
        id: "brise-soleil-105-52",
        nom: "ARE-BRISE-SOLEIL 105/52",
        finition: "Surface filmée PVC",
        description:
          "Le brise-soleil 105/52 apporte une solution esthétique et résistante en intérieur comme en extérieur : claustra, protection solaire, habillage de plafond.",
        specs: [
          { label: "Largeur", value: "105 mm" },
          { label: "Hauteur", value: "52 mm" },
          { label: "Surface", value: "Film PVC extérieur" },
        ],
        teintes: TEINTES,
      },
    ],
  },
  {
    id: "clotures",
    titre: "Clôtures",
    intro:
      "Profilés de clôture composite et poteaux métalliques, en finition bois embossé ou lisse, pour délimiter jardins, piscines et copropriétés.",
    image: clotBrun.url,
    galerie: [
      { src: clotBrun.url, alt: "Clôture composite brune devant un jardin" },
      { src: clotAnthracite.url, alt: "Clôture composite anthracite le long d'une allée" },
      { src: clotBalcon.url, alt: "Garde-corps composite d'une terrasse" },
    ],
    produits: [
      {
        id: "cloture-200-22-bois",
        nom: "ARE-PROFILÉ CLÔTURE 200/22",
        finition: "Bois embossé",
        description: usageCloture,
        specs: [
          { label: "Largeur", value: "200 mm" },
          { label: "Épaisseur", value: "22 mm" },
          { label: "Surface", value: "Bois embossé" },
        ],
        teintes: TEINTES_BOIS,
      },
      {
        id: "cloture-200-22-lisse",
        nom: "ARE-PROFILÉ CLÔTURE 200/22",
        finition: "Surface lisse",
        description: usageCloture,
        specs: [
          { label: "Largeur", value: "200 mm" },
          { label: "Épaisseur", value: "22 mm" },
          { label: "Surface", value: "Lisse" },
        ],
        teintes: TEINTES_BOIS,
      },
      {
        id: "cloture-105-52",
        nom: "ARE-PROFILÉ CLÔTURE 105/52",
        finition: "Lame claustra",
        description: usageCloture,
        specs: [
          { label: "Largeur", value: "105 mm" },
          { label: "Hauteur", value: "52 mm" },
        ],
        teintes: TEINTES_BOIS,
      },
      {
        id: "poteau-80-80",
        nom: "ARE-POTEAU MÉTAL 80/80",
        finition: "Poteau de clôture",
        description:
          "Poteau métallique qui reçoit les lames de clôture composite et assure la tenue de l'ensemble.",
        specs: [
          { label: "Section", value: "80 × 80 mm" },
          { label: "Matière", value: "Métal" },
        ],
        teintes: TEINTES_BOIS,
      },
    ],
  },
  {
    id: "pergolas",
    titre: "Pergolas",
    intro:
      "Poteaux et poutres composite de forte section pour construire des pergolas, carports et espaces de réception extérieurs.",
    image: pergolaSalon.url,
    galerie: [
      { src: pergolaSalon.url, alt: "Pergola composite abritant un salon de jardin" },
      { src: pergolaJardin.url, alt: "Pergola composite dans un parc" },
      { src: pergolaRestaurant.url, alt: "Terrasse de restaurant sous pergola composite" },
    ],
    produits: [
      {
        id: "pergola-poteau",
        nom: "ARE-POTEAU PERGOLA 140/140",
        finition: "Poteau porteur",
        description: usagePergola,
        specs: [
          { label: "Section", value: "140 × 140 mm" },
          { label: "Usage", value: "Structure porteuse" },
        ],
        teintes: TEINTES_BOIS,
      },
      {
        id: "pergola-poutre",
        nom: "ARE-POUTRE / CHEVRON 160/60",
        finition: "Poutre et chevron",
        description: usagePergola,
        specs: [
          { label: "Largeur", value: "160 mm" },
          { label: "Hauteur", value: "60 mm" },
        ],
        teintes: TEINTES_BOIS,
      },
    ],
    accessoires: [
      { nom: "Pied d'ancrage métal", description: "Ancre le poteau de pergola au sol." },
      { nom: "Capot bas de pergola", description: "Finition en pied de poteau." },
      { nom: "Capot haut de pergola", description: "Finition en tête de poteau." },
      { nom: "Capot de poutre droit", description: "Finition d'about de poutre." },
      { nom: "Capot de poutre en biais", description: "Finition d'about coupé en angle." },
      { nom: "Équerre de liaison en L", description: "Assemblage poteau / poutre." },
      { nom: "Connecteur en U", description: "Assemblage de poutres et chevrons." },
      { nom: "Tige filetée", description: "Fixation traversante des assemblages." },
    ],
  },
];

const IMAGES = import.meta.glob<{ url: string }>("../assets/cat/*.asset.json", {
  eager: true,
  import: "default",
});

/** URL d'un visuel extrait du catalogue (src/assets/cat/<nom>.jpg). */
export function img(nom: string): string {
  const key = Object.keys(IMAGES).find((k) => /\/([^/]+)\.(jpg|png)\.asset\.json$/.exec(k)?.[1] === nom);
  if (!key) throw new Error(`Visuel catalogue manquant : ${nom}`);
  return IMAGES[key].url;
}

const range = (prefix: string, n: number, from = 1) =>
  Array.from({ length: n }, (_, i) => `${prefix}-${i + from}`);

const MEDIA_PRODUITS: Record<string, { visuel: string; situation: string[]; folio?: string }> = {
  "deck-150-25": { visuel: "p-deck-150-25", situation: ["s-deck-150-25"] },
  "deck-145-22": { visuel: "p-deck-145-22", situation: ["s-deck-145-22"] },
  "deck-145-28": { visuel: "p-deck-145-28", situation: ["s-deck-145-28"] },
  "deck-150-26": { visuel: "p-deck-150-26", situation: ["s-deck-150-26"] },
  "deck-150-26-large": { visuel: "p-deck-150-26-large", situation: ["s-deck-150-26-large"] },
  "deck-145-22-bois": { visuel: "p-deck-145-22-bois", situation: ["s-deck-145-22-bois"] },
  "deck-145-22-plein": { visuel: "p-deck-145-22-plein", situation: ["s-deck-145-22-plein"] },
  "deck-145-22-plein-bois": {
    visuel: "p-deck-145-22-plein-bois",
    situation: ["s-deck-145-22-plein-bois"],
  },
  "decklam-145-28": { visuel: "p-decklam", situation: ["s-decklam"], folio: "f-decklam" },
  "panneau-220-26-lisse": { visuel: "p-panneau-lisse", situation: ["s-panneau-lisse", "a-fac-1"] },
  "panneau-220-26-bois": { visuel: "p-panneau-bois", situation: ["s-panneau-bois", "a-fac-2"] },
  "clin-186-21-bois": {
    visuel: "p-clin-bois",
    situation: ["s-clin-bois", "a-fac-8", "a-fac-9", "a-fac-10"],
  },
  "clin-186-21-folio": { visuel: "p-clin-folio", situation: ["s-clin-folio"], folio: "f-clin" },
  "brise-soleil-105-52": {
    visuel: "p-brise",
    situation: ["s-brise", "a-bs-1", "a-bs-2", "a-bs-3"],
    folio: "f-brise",
  },
  "cloture-200-22-bois": { visuel: "p-cloture-bois", situation: ["s-cloture-1"] },
  "cloture-200-22-lisse": { visuel: "p-cloture-lisse", situation: ["s-cloture-2"] },
  "cloture-105-52": { visuel: "p-cloture-105", situation: ["s-cloture-3"] },
  "poteau-80-80": { visuel: "p-poteau", situation: ["s-cloture-4"] },
  "pergola-poteau": { visuel: "p-pergola-poteau", situation: ["s-pergola-1"] },
  "pergola-poutre": { visuel: "p-pergola-poutre", situation: ["s-pergola-2", "s-pergola-3"] },
};

const MEDIA_CATEGORIES: Record<string, { realisations: string[]; montage?: string[]; accessoires?: string[] }> = {
  sols: {
    realisations: range("a-sol", 8),
    montage: range("m", 7),
    accessoires: ["x-joist", "x-edge", "x-clip", "x-pedestal", "x-alu", "x-glue", "x-vis-comp", "x-vis-metal", "x-vis-beton"],
  },
  facades: { realisations: [...range("a-fac", 7), ...range("a-bs", 3)] },
  clotures: { realisations: range("s-cloture", 4), montage: ["sch-cloture"] },
  pergolas: {
    realisations: range("s-pergola", 3),
    montage: ["sch-pergola"],
    accessoires: ["x-perg-ancrage", "x-perg-bas", "x-perg-haut", "x-perg-droit", "x-perg-angle", "x-perg-l", "x-perg-u", "x-perg-tige"],
  },
};

export const CATEGORIES: Categorie[] = CATEGORIES_BASE.map((c) => {
  const m = MEDIA_CATEGORIES[c.id];
  return {
    ...c,
    realisations: m?.realisations.map(img),
    montage: m?.montage?.map(img),
    accessoires: c.accessoires?.map((a, i) => ({
      ...a,
      image: m?.accessoires?.[i] ? img(m.accessoires[i]) : undefined,
    })),
    produits: c.produits.map((p) => {
      const pm = MEDIA_PRODUITS[p.id];
      return pm
        ? { ...p, visuel: img(pm.visuel), situation: pm.situation.map(img), folio: pm.folio && img(pm.folio) }
        : p;
    }),
  };
});

export const TOUS_PRODUITS = CATEGORIES.flatMap((c) =>
  c.produits.map((p) => ({ ...p, categorie: c })),
);

export function getProduit(id: string) {
  return TOUS_PRODUITS.find((p) => p.id === id);
}

/** Les 13 propriétés du composite, avec leur picto vert du catalogue. */
export const ATOUTS = [
  { titre: "100 % recyclable", texte: "Le composite bois est entièrement recyclable." },
  { titre: "Longue durée de vie", texte: "Une tenue dans le temps sans déformation." },
  { titre: "Résistant aux UV", texte: "Résiste aux rayons du soleil sans grisailler." },
  { titre: "Sans entretien", texte: "Ni lasure, ni huile, ni ponçage." },
  { titre: "Résistant à l'humidité", texte: "Idéal au bord de l'eau et en bord de piscine." },
  { titre: "Ni peinture ni vernis", texte: "La teinte est dans la masse du profilé." },
  { titre: "Insensible au climat", texte: "Gel, pluie, chaleur : aucune incidence." },
  { titre: "Sans échardes", texte: "Agréable pieds nus, sans écharde." },
  { titre: "Antibactérien", texte: "Surface saine et facile à nettoyer." },
  { titre: "Ne propage pas la flamme", texte: "Comportement au feu maîtrisé." },
  { titre: "Insensible aux insectes", texte: "Ni termites, ni xylophages." },
  { titre: "Antidérapant", texte: "Sécurisant autour des piscines." },
  { titre: "Ne pourrit pas", texte: "Aucune putréfaction au contact de l'eau." },
];

export const ATOUTS_PICTOS = ATOUTS.map((a, i) => ({ ...a, picto: img(`picto-${i}`) }));

export function getCategorie(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
