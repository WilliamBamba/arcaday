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
aucun port public ou déploiement n’est configuré par ce projet.

## Jouer

- Boutons du bas : gauche, droite et saut ; déplacement + saut simultanés.
- Clavier : flèches gauche/droite, A/Q et D ; Espace, flèche haut, W/Z pour sauter.
- Appui bref = saut court ; maintien = saut haut. Relâcher puis appuyer pour resauter.
- Directions opposées = arrêt. Pas de double saut. Relâchement hors bouton,
  annulation tactile et perte de focus libèrent les commandes.
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
avec `?test` ; elle est supprimée du build de production. La CI existante conserve son contrôle documentaire. Les vérifications applicatives
sont exécutables localement ; leur ajout à GitHub Actions reste à effectuer avec
une autorisation permettant la modification des workflows.

## Structure

- `src/game/` : scène de test et règles de mouvement, paramètres de saut centralisés.
- `src/input/` : état des commandes par doigt/touche et adaptation DOM.
- `src/main.ts`, `src/style.css` : démarrage Phaser et interface sans framework UI.
- `tests/` : règles unitaires et intégration navigateur.
- `docs/` : vision, décisions et état vérifié du projet.

## Validation smartphone restante

Tester sur Safari iOS et Chrome Android réels : deux ou trois doigts, changement
de doigt, interruption (notification, arrière-plan), orientation, barres du navigateur,
encoches, confort des boutons, latence et régularité des images. Ajuster vitesse et
hauteur après ressenti utilisateur. Les tests Chromium ne remplacent pas ces essais.
Le moteur produit un bundle d’environ 342 ko gzip : temps de chargement mobile à mesurer.

Pas de système quotidien, backend, classement, obstacle complexe, décoration détaillée,
PWA installable ni distribution iOS/Android dans cet incrément. Aucun déploiement automatique.
