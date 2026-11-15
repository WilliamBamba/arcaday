# Arcaday — Daily Impossible

Premier terrain jouable de plateforme 2D sous la marque NUSINI. Web statique,
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
  sa commande ; revenir la réactive. Glisser vers un autre bouton ne l’active pas.
  Chaque doigt est indépendant ; relâchement, annulation et interruptions nettoient les commandes.
- Terrain d’essai libre : sol et quatre plateformes solides, sans victoire ni score.

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

- `src/game/` : scène de test et règles de mouvement, paramètres de saut centralisés.
- `src/input/` : état des commandes par doigt/touche et adaptation DOM.
- `src/main.ts`, `src/style.css` : démarrage Phaser et interface sans framework UI.
- `tests/` : règles unitaires et intégration navigateur.
- `docs/` : vision, décisions et état vérifié du projet.

## Validation du premier prototype

Le premier prototype, déplacements, collisions, saut variable et dernières corrections
tactiles compris, est validé sur iPhone réel par l’utilisateur. Les tests automatisés
couvrent 5 cas unitaires et 8 scénarios Chromium. Ils ne constituent pas une validation
exhaustive de Safari, d’Android ou des performances de tous les appareils.

La prochaine fonctionnalité sera la boucle de gameplay : obstacles mortels, mort,
recommencement et drapeau de victoire. Elle n’est pas encore implémentée.
Le moteur produit un bundle d’environ 342 ko gzip : temps de chargement mobile à mesurer.

Pas de système quotidien, backend, classement, obstacle complexe, décoration détaillée,
PWA installable ni distribution iOS/Android dans cet incrément. Aucun déploiement automatique.
