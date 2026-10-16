# Retrouver tout le catalogue sur le site

## Objectif
Chaque produit du catalogue AREWOOD a sa propre fiche, comme dans le PDF : grand visuel du profilé, caractéristiques techniques, pictos verts des propriétés, et photos de mise en situation réelles.

## Ce qui change
1. **Extraction complète des visuels du PDF** (16 pages, ~245 images) : vue produit (profilé en coupe / lame en grand), échantillons de teintes réels, pictos verts, photos de chantier. Chaque image est associée à son produit et hébergée sur le site.
2. **Nouvelle page par produit** (ex. /catalogue/deck-145-22) :
   - grand visuel du profilé + coupe technique,
   - tableau complet des caractéristiques (largeur, épaisseur, longueur, poids/ml, structure, surface…) repris page par page du PDF,
   - rangée de pictos verts (recyclable, UV, sans entretien, antidérapant…) exactement ceux affichés pour ce produit,
   - teintes disponibles avec les vrais échantillons du catalogue,
   - galerie de mises en situation réelles (agrandissables au clic),
   - accessoires compatibles et bouton « Demander un devis ».
3. **Page Catalogue** : chaque carte produit affiche la photo du profilé et renvoie vers sa fiche ; galerie de réalisations plus fournie par famille.
4. **Sections manquantes** : « Profilés sur mesure (Special design) » et la page des propriétés du composite avec les pictos verts, ajoutées si absentes.
5. **Accueil** : bandeau de pictos verts et mosaïque de réalisations.

## Vérification
Comparaison page par page PDF ↔ site pour ne rien oublier ; contrôle visuel desktop et mobile ; tests existants sur les teintes conservés.

## Détails techniques
- pdftoppm + pdfimages pour extraire ; recadrage des pictos/vues produit depuis les rendus de page si les images sont fusionnées ; upload via lovable-assets.
- Données enrichies dans src/lib/catalogue.ts (image produit, specs complètes, liste de pictos, galerie par produit) ; pictos décrits dans une liste unique réutilisée.
- Route src/routes/catalogue.$produitId.tsx avec head() propre à chaque produit (og:image = visuel produit).
- Le simulateur IA n'est pas touché.
