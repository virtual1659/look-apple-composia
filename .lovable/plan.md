# Site matériaux composites + simulateur IA avant/après

## Pages
- **Accueil** : présentation des composites (terrasses, bardage façade), visuel fort, accès au simulateur.
- **Catalogue** : fiches produits (ex. ARE-DECK 145/22 « effet bois embossé »), caractéristiques techniques, nuancier.
- **Simulateur** (cœur du projet) : outil IA avant/après.
- **Contact / devis** : formulaire simple.

## Simulateur – parcours client
1. **Importer une photo** (glisser-déposer ou appareil photo sur mobile).
2. **Délimiter la zone** : le client dessine un polygone (clics successifs) ou peint au pinceau sur la photo ; quadrillage/surbrillance de la zone choisie, gomme et « tout effacer ».
3. **Type de surface** : Sol (terrasse, tour de piscine) ou Mur de façade (les fenêtres restent intactes).
4. **Choisir le revêtement** dans la liste, puis **la couleur** : Gris clair, Chêne clair, Café clair, Café foncé, Anthracite (pastilles visuelles).
5. **Générer** : l'IA applique le matériau uniquement dans la zone, en respectant perspective, lumière et ombres.
6. **Résultat avant/après** avec curseur glissant, téléchargement de l'image, bouton « demander un devis ».

## Design
Direction architecturale haut de gamme : tons pierre/sable, accents bois chaud, typographie éditoriale, grandes photos. Entièrement responsive (le dessin de zone fonctionne au doigt sur mobile).

## Détails techniques
- Lovable Cloud activé ; génération via Lovable AI (modèle d'image par défaut, édition avec masque) dans une route serveur avec aperçu en streaming.
- Masque créé dans un canvas côté navigateur (polygone/pinceau) et envoyé avec la photo + une image de référence du matériau/couleur + consigne précise.
- Catalogue des matériaux et couleurs défini dans un fichier de données (facile à enrichir) ; images d'échantillons générées pour chaque couleur.
- Pas de comptes utilisateurs dans cette première version (ajoutable ensuite pour sauvegarder les projets).
