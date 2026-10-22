# Clôture par tracé au sol, avec respect des angles

## Ce que verra le client
- **Plus de détection automatique au chargement.** La photo s'affiche sans sélection. Le bouton « Détection automatique » reste disponible pour le sol et la façade, mais il ne se lance que si le client clique dessus.
- **Nouvel outil « Tracé clôture »**, choisi d'office quand le type de surface est « Clôture » :
  1. Le client clique au pied de la future palissade, point par point (A, B, C, D…). Chaque clic crée un angle, ce qui permet de suivre un retour en Z comme sur votre photo.
  2. Un double-clic ou le bouton « Terminer le tracé » termine la ligne.
  3. La palissade apparaît aussitôt en aperçu : un panneau orange par segment, monté à la verticale depuis la ligne au sol.
  4. On règle la **hauteur** avec un curseur. La hauteur suit la perspective : elle est plus petite au fond, plus grande devant.
  5. On peut déplacer chaque point ou sa poignée de hauteur pour ajuster un angle. Le bouton Annuler fonctionne aussi.
- **Génération segment par segment, du fond vers l'avant.** L'IA construit d'abord le panneau le plus éloigné, puis le retour, puis le panneau de devant. Chaque passage repart de l'image précédente. Les panneaux de devant cachent donc correctement ceux du fond, et chaque angle garde sa propre orientation de lames. Une barre de progression affiche « Panneau 2 sur 3 ».

## Limites à connaître
- Chaque panneau est un rendu IA. Une clôture en 3 segments coûte donc environ 3 rendus et prend plus de temps.
- L'aperçu est en ligne droite entre les points. Un mur courbe demande plusieurs points rapprochés.
- On ne règle qu'une seule hauteur pour toute la clôture, pas une hauteur par segment.

## Détails techniques
- `simulateur.tsx` : retirer l'appel `setTimeout(() => detect(p))` dans `onFile`. Masquer le bandeau de détection quand la surface est `cloture`.
- `ZoneEditor` : ajouter le mode `fence`, actif quand `surface === "cloture"`. L'état contient `fencePts: [x,y][]` (pieds) et `height` (fraction de la hauteur de l'image). Le haut de chaque point se calcule ainsi : `top = foot - height * perspective(y)`, où `perspective` est linéaire en y, ce qui réduit la hauteur des points plus hauts sur la photo. Une poignée de hauteur par point permet de surcharger cette valeur. L'aperçu est dessiné en SVG : des quads `foot_i, foot_i+1, top_i+1, top_i` et des lignes pointillées au sol.
- Nouvelle méthode du handle, `getFenceSegments()` : elle renvoie la liste des quads triée de l'arrière vers l'avant, selon le y moyen des pieds (le plus petit d'abord).
- Nouvelle méthode `quadMask(quad)` : elle rend un masque PNG net, transparent à l'intérieur du quad, avec la même dilatation douce que `getMask`.
- Générer dans `simulateur.tsx` : en mode clôture, faire une boucle sur les segments. Chaque appel à `/api/simulate` envoie en photo le résultat final du segment précédent, converti en blob, et le masque du quad. L'aperçu flouté est affiché pendant chaque passage. En cas d'erreur, on s'arrête et on garde le dernier résultat réussi.
- `materials.ts` / `buildPrompt` pour la clôture : préciser « panneau unique plan, vertical, lames horizontales suivant la perspective du quadrilatère masqué, ne pas déborder, garder ce qui est devant ». Le prompt reste construit côté serveur, et l'API n'est pas modifiée.
- Les modes sol et façade restent inchangés, avec polygone, pinceau et gomme.
