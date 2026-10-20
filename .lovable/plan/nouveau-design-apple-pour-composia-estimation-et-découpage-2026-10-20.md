# Nouveau design « Apple » pour Composia : estimation et découpage

## Ce qu'il faut savoir sur les crédits
- Chaque message en mode construction est facturé selon le travail réellement fait (taille et complexité). Il n'existe pas de prix fixe par page, donc je ne peux pas donner un chiffre exact à l'avance.
- Un message en mode plan (comme celui-ci) coûte 1 crédit.
- Les générations du simulateur IA sont facturées à part, à chaque rendu.
- Pour garder le contrôle, on avance **une page par message** et vous vérifiez le résultat avant de passer à la suivante.

## Taille de chaque étape (du plus léger au plus lourd)

| Étape | Contenu | Taille |
|---|---|---|
| 1. Base commune | Nouvelle police, couleurs, barre de menu en pilule, grand pied de page 5 colonnes | Moyenne |
| 2. À propos | Chiffres clés, frise 1980 → 2026, étapes usine, engagements, avis clients, équipe, réseau pro | Moyenne |
| 3. Accueil | Photo avant/après avec pastilles de teintes, chiffres, mosaïque des 4 familles, sélecteur de teintes, réalisations, pictos sur fond dégradé | Moyenne à grande |
| 4. Devis | Formulaire en 3 étapes (projet, surface en curseur, teinte, pose, fichiers, coordonnées), récapitulatif, carte du showroom, contacts | Grande |
| 5. Catalogue | Recherche, filtres (structure, surface, teinte), comparateur de profilés, configurateur de pose en 4 couches, tableau clôtures | La plus grande |
| 6. Simulateur | Nouvel habillage autour de l'outil actuel, vignettes des 5 teintes, conseils photo, questions fréquentes | Moyenne (l'outil IA lui-même ne change pas) |

Les étapes 4 et 5 contiennent de vraies nouvelles fonctions (filtres, comparateur, formulaire en étapes), pas seulement de l'habillage : ce sont elles qui coûtent le plus. Si votre budget est serré, on peut les faire d'abord en simple habillage, puis ajouter ces fonctions plus tard.

## Contenu à fournir (les maquettes contiennent des exemples inventés)
- Téléphone, e-mails, adresse et horaires du showroom de Montpellier
- Avis clients et noms de l'équipe (Julien Roux, Sophie Martin…) : réels ou à retirer
- Chiffres : « 850 » clients/projets, garantie « 10 ans », « stock en France »
- Le PDF du catalogue à proposer en téléchargement

Tant que ces informations manquent, je mets des textes génériques clairement repérables.

## Ordre conseillé
1. Base commune + Accueil (premier message) : vous voyez tout de suite le nouveau style
2. À propos
3. Simulateur
4. Devis (habillage, puis enregistrement des demandes si vous le voulez)
5. Catalogue (habillage, puis filtres et comparateur)

## Détails techniques
- Les couleurs, polices et arrondis sont regroupés dans styles.css ; les pages lisent le catalogue existant (catalogue.ts), donc aucun contenu produit n'est ressaisi.
- Les maquettes servent de référence uniquement, elles ne sont pas intégrées comme images au site.
- L'envoi réel du formulaire de devis nécessiterait Lovable Cloud : c'est une étape séparée, en option.
