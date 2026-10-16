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
  accessoires?: { nom: string; description: string }[];
};

const usageSol =
  "Bord de piscine, allée, terrasse, aire de jeux, jardin et aménagement paysager : une solution durable et esthétique face aux intempéries.";
const usageFacade =
  "Habillage décoratif et protecteur des murs intérieurs et extérieurs de vos bâtiments.";
const usageCloture =
  "Nos systèmes de clôture composite délimitent vos espaces privatifs avec un rendu décoratif et une protection longue durée.";
const usagePergola =
  "Nos profilés de pergola composent des espaces de vie extérieurs esthétiques et résistants.";

export const CATEGORIES: Categorie[] = [
  {
    id: "sols",
    titre: "Sols & terrasses",
    intro:
      "Lames de terrasse composite alvéolaires ou pleines, en finition bois embossé, rainures larges ou film PVC. Pose sur lambourdes composite, aluminium ou plots réglables.",
    image: solHotel.url,
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
        id: "deck-145-22-plein",
        nom: "ARE-DECK 145/22 PLEIN",
        finition: "Profilé plein, bois embossé",
        description: usageSol,
        specs: [
          { label: "Largeur", value: "145 mm" },
          { label: "Épaisseur", value: "22 mm" },
          { label: "Structure", value: "Pleine" },
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

export function getCategorie(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
