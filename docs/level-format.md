# Format des niveaux

`src/levels/types.ts` définit des données simples, sérialisables en JSON et sans
référence Phaser. `src/levels/first.ts` est le niveau actif. Aucun registre distant,
format d’éditeur, générateur ou système quotidien n’est nécessaire pour l’instant.

- `id` : identifiant stable.
- `world` : largeur/hauteur en pixels du monde, indépendantes de la fenêtre 360 × 550.
- `spawn` : centre du personnage (silhouette actuelle 24 × 36).
- `platforms`, `walls` : rectangles solides, coordonnées du coin supérieur gauche.
- `obstacles` : rectangles avec `kind: 'spikes'`, mortels au contact.
- `deathZones` : rectangles mortels, notamment le fond des fossés, dessinés en dents.
- `goal` : rectangle de déclenchement du drapeau.

Toutes les géométries ont `x`, `y`, `width`, `height`. Les dimensions doivent être
finies, positives et contenues dans le monde. `validateLevel` rejette un départ
hors limites ou recouvrant un solide/danger/arrivée et une arrivée obstruée.
Ce validateur contrôle les objets internes typés : ce n’est pas un parseur de JSON
non fiable. Un futur import utilisateur devra ajouter une validation de structure
et des limites de taille. La faisabilité relève de tests de parcours et du playtest.

`GameScene` construit collisions, dangers, arrivée et limites à partir du niveau
injecté. Les transitions de partie restent dans `Run` et les paramètres dans
`movement.ts`. L’ancien terrain est une fixture chargée uniquement en développement
via `?test&level=prototype` ; ni cette fixture ni la sonde de test ne sont publiées.

La caméra Phaser suit les deux axes, avec interpolation, zone de tolérance
32 × 110 et anticipation horizontale de 48 pixels, inversée progressivement avec
la direction. Les limites de caméra et de physique viennent du monde. Réapparition
et Rejouer recentrent immédiatement sur le départ pour éviter un long panoramique.
Aucun zoom dynamique ni secousse ; l’interface HTML reste indépendante du monde.
