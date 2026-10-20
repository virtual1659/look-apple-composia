# Sélection automatique de la zone par l'IA

## Ce que verra le client
- Dans l'étape 2 du simulateur, un nouveau bouton **« Détection automatique »**, en premier.
- Après l'import de la photo, l'IA lance la détection seule : la terrasse, le sol autour de la piscine ou le mur de façade est surligné en orange en 2 à 5 secondes. Le choix entre sol et façade suit le « Type de surface » sélectionné.
- Le client peut corriger le résultat avec les outils actuels : Gomme pour retirer une fenêtre ou un meuble, Pinceau ou Polygone pour ajouter une zone, Annuler.
- Si le client change le type de surface, on lui propose de relancer la détection.
- Si l'IA ne trouve rien, un message l'invite à délimiter la zone à la main. Le simulateur reste utilisable comme aujourd'hui.

## Limites à connaître
- La détection donne un contour approximatif, fait de quelques points : les bords fins comme les pieds de transats ou les échelles ne seront pas exclus parfaitement. La gomme reste utile.
- Chaque détection est une petite requête IA, facturée à part. Elle coûte beaucoup moins qu'un rendu.

## Détails techniques
- Nouvelle route serveur `src/routes/api/detect-zone.ts` (POST photo + surface `sol|mur`). Elle appelle un modèle de vision via le gateway Lovable AI (`google/gemini-2.5-flash`) avec un prompt fixe côté serveur et une sortie JSON structurée : `{ polygons: [[x,y],...][] }`, avec des coordonnées normalisées de 0 à 1000. Les fenêtres et portes sont exclues pour un mur, le mobilier et l'eau pour un sol.
- Le serveur valide la réponse : taille limitée, polygones de 3 points ou plus, coordonnées dans les bornes.
- `ZoneEditor` reçoit une nouvelle méthode `fillPolygons(polys)` : instantané pour l'annulation, puis remplissage avec le motif actuel. Le masque envoyé au rendu ne change pas.
- `simulateur.tsx` : la détection se lance automatiquement après `preparePhoto`, avec un état de chargement sur la photo et un bouton pour relancer.
