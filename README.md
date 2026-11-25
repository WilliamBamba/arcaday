# Arcaday — Daily Impossible

Premier parcours de plateforme 2D sous la marque NUSINI. Web statique,
portrait, TypeScript strict, Vite, Phaser 3 et Arcade Physics. Le gameplay prime
sur la finition : beige, noir, silhouette et plateformes géométriques.

## Démarrer

Node.js >= 20.19, npm.

```sh
npm ci
npm run dev
```

Ouvrir l’adresse locale affichée. Pour un téléphone sur le même réseau de
confiance : `npm run dev -- --host 0.0.0.0`, puis ouvrir l’adresse LAN du poste.
Un serveur exécuté sur un VPS n’est pas automatiquement accessible au téléphone ;
la prévisualisation privée persistante utilise Tailscale et le service décrit dans [ops/README.md](ops/README.md), sans exposition publique.

## Jouer

- Boutons du bas : gauche, droite et saut ; déplacement + saut simultanés.
- Clavier : flèches gauche/droite, A/Q et D ; Espace, flèche haut, W/Z pour sauter.
- Appui bref = saut court ; maintien = saut haut. Relâcher puis appuyer pour resauter.
- Directions opposées = arrêt. Pas de double saut. Sortir le doigt du bouton désactive
  sa commande ; glisser entre gauche et droite change immédiatement de direction.
  Entre les boutons, le doigt ne déplace plus le joueur. Le saut reste indépendant.
  Chaque doigt est indépendant ; relâchement, annulation et interruptions nettoient les commandes.
- Traverse 01 : éviter pics et fossés, franchir les murs bas et atteindre le drapeau.
  Monde 4 800 × 800, caméra mobile sur les deux axes, commandes fixes.
- Une mort ajoute 1 au compteur et replace le personnage au départ après 180 ms.
  Relâcher puis appuyer de nouveau sur les commandes après réapparition.
- Au drapeau, le résultat fige la partie ; « Rejouer » remet le compteur à zéro sans recharger la page.

## Vérifications

```sh
npm run check          # TypeScript strict, tests unitaires, build statique
npx playwright install chromium
npm run test:e2e       # Chromium : physique réelle, clavier, multitouch, mise en page
npm run preview       # Examiner le build dans dist/
```

`npm run typecheck`, `npm test` et `npm run build` sont aussi disponibles séparément.
Les tests navigateur utilisent une sonde de scène activée seulement en développement
avec `?test` ; elle est supprimée du build de production. GitHub Actions exécute
le contrôle documentaire et les vérifications applicatives, dont Chromium.

## Structure

- `src/game/` : scène commune, transitions de partie et règles de mouvement.
- `src/levels/` : données sérialisables du parcours et validation géométrique.
- `src/input/` : état des commandes par doigt/touche et adaptation DOM.
- `src/main.ts`, `src/style.css` : démarrage Phaser et interface sans framework UI.
- `tests/` : règles unitaires et intégration navigateur.
- `docs/` : vision, décisions et état vérifié du projet.

## Validation du premier prototype

Le premier prototype, déplacements, collisions, saut variable et dernières corrections
tactiles compris, est validé sur iPhone réel par l’utilisateur. Les tests automatisés
couvrent désormais 16 cas unitaires et 19 scénarios Chromium. Ils ne constituent pas une validation
exhaustive de Safari, d’Android ou des performances de tous les appareils.

La boucle de phase 16 (pics, mort, réapparition, compteur, victoire et Rejouer) est
validée sur iPhone par l’utilisateur. Les corrections suivantes restent à confirmer
sur Safari iPhone : glissement gauche/droite et disparition de la sélection bleue.
La protection contre sélection, menus contextuels et surlignages natifs est limitée
à l’interface du jeu ; Rejouer et le focus clavier restent disponibles.
Aucun réglage de mouvement n’a changé.
Le moteur produit un bundle d’environ 344 ko gzip : temps de chargement mobile à mesurer.

Pas de système quotidien, backend, classement, obstacle complexe, décoration détaillée,
PWA installable ni distribution iOS/Android dans cet incrément. Aucun déploiement automatique.


## Phase 17 — niveaux et caméra

Le parcours original alterne pics, fossés, murs bas et montée de précision ; une
ligne élevée et des trajectoires plus directes sont à explorer. Le test sans mort
avec uniquement des commandes clavier prend environ 27 secondes. Le temps de
première réussite humaine (objectif 2–3 minutes) et le taux de réussite restent à
calibrer sur iPhone et en bêta. Le gameplay de phase 16 est validé ; ce nouveau
parcours et sa caméra attendent leur validation fonctionnelle iPhone.

Voir les [règles de design](docs/daily-impossible-design.md) et le [format des niveaux](docs/level-format.md).
L’ancien terrain est conservé en fixture de non-régression, accessible seulement
en développement avec `?test&level=prototype`. Le build publié contient le nouveau
parcours, sans sélecteur quotidien, persistance ni sonde de test.
