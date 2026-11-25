# Daily Impossible — règles et level design

Décisions validées par l’utilisateur pour la phase 17, le 25 novembre 2026.
Ce document distingue les règles du produit cible des fonctionnalités livrées.

## Philosophie

Celeste sert de référence pour la précision, la difficulté, la construction des
parcours, la réapparition rapide et le potentiel speedrun. Wordle sert de référence
pour le défi quotidien commun et le résultat définitif. Adapter ces philosophies
au mobile ; ne reprendre aucun niveau, graphisme, son ou autre asset de ces jeux.

Portrait-first, trois boutons gauche/droite/saut, parcours horizontaux, verticaux
ou mixtes. Difficulté élevée dès le lundi et croissante jusqu’au dimanche. Vies
illimitées, pas de checkpoint standard, réapparition rapide au départ. Aucun piège
ne doit imposer une mort inévitable : les dangers doivent être visibles assez tôt
et les passages réalisables avec les mécaniques disponibles.

## Objectifs de calibration — pas des mesures acquises

- Parcours sans erreur : environ 20 à 40 secondes.
- Première réussite : environ 2 à 3 minutes, répétitions comprises.
- Moins de 25 % des joueurs capables de terminer rapidement et sans mourir :
  objectif de bêta. Définir la population, le nombre d’essais et le seuil « rapidement »
  avant d’en tirer une statistique ; aucun taux n’est établi par un test automatisé.

## Défi quotidien futur — non implémenté

- Défi unique, résultat définitif après victoire ; pas d’archives jouables au lancement.
- Possibilité de suspendre, reprendre ou abandonner définitivement le défi.
- Temps et nombre de morts conservés entre sessions.
- Classement d’abord par morts, puis par temps.

Le calcul exact du temps (notamment suspension et arrière-plan), le stockage,
le calendrier et les garanties d’intégrité restent à définir. La phase 17
n’ajoute ni persistance, ni commandes de suspension/abandon, ni backend, ni classement.
Le bouton Rejouer reste volontairement disponible pour les tests, en exception
provisoire au résultat quotidien définitif.

## Évolutions retenues, reportées

Wall Slide, Wall Jump, éditeur de niveaux, trajectoires alternatives et raccourcis
techniques pour speedrunners. La distinction Perfect Run reste à approfondir.
Double saut et dash ne sont pas retenus actuellement. Aucun ajout de mouvement
n’est inclus dans cette phase ; vitesse, gravité et saut variable sont conservés.

## Premier parcours : Traverse 01

Parcours original de 4 800 × 800 pixels, principalement horizontal. La fenêtre
logique reste 360 × 550 ; les commandes et le résultat restent en HTML fixe.

| Portion (x) | Intention |
| --- | --- |
| 0–920 | Entrée sûre, trois pics de largeur croissante ; apprendre le rythme sans zone de tutoriel séparée |
| 920–1800 | Fossés de 80 px et changements de hauteur ; gérer décollage et réception |
| 1800–2550 | Pics plus larges et plateformes élevées optionnelles ; optimiser la ligne et le temps au sol |
| 2550–3300 | Murs bas de 40, 60 puis 80 px ; combiner position de départ et maintien du saut |
| 3300–4050 | Montée sur plateformes de 90 px, séparées de 75 px ; précision progressive |
| 4050–4800 | Descente et arrivée ; garder la maîtrise des réceptions |

Les fossés aboutissent à une zone mortelle visible. Les pics utilisent une hitbox
rectangulaire englobante, comme le prototype. Les plateformes sont solides sur
toutes leurs faces. Les plateformes optionnelles ne garantissent pas un gain de
temps : leur intérêt speedrun doit être mesuré en jeu. Les trajectoires sans arrêt,
les sauts courts et les départs plus tardifs offrent également des optimisations.

Deux tests navigateur suivent les lignes basse et haute, écrites séparément des
données, par commandes clavier sans téléportation ni modification physique. Durées
observées : environ 27,3 et 27,0 secondes, sans mort. Cela vérifie la faisabilité,
pas le confort tactile ni la difficulté ressentie. La durée humaine, la visibilité
des dangers et la fluidité de caméra nécessitent la validation iPhone.
