# Arcaday — mémoire du projet

État consolidé le **25 novembre 2026 (Europe/Paris)** pour la phase 17. Commencer
par la section 8, puis vérifier Git et la PR : cet instantané ne remplace pas le dépôt.
**Vérifié** désigne les observations des outils ; **rapporté** les confirmations
utilisateur, notamment les essais iPhone ; les éléments non testés sont signalés.

## 1. Instructions de reprise

- Lire [AGENTS.md](../AGENTS.md), la [vision](vision.md) et les [décisions](architecture/decisions.md).
- Préserver les changements locaux ; branche dédiée, jamais développer sur main ; Conventional Commits et PR.
- L’utilisateur pilote le projet depuis ChatGPT, Codex Desktop et GitHub, sans recopier de commandes serveur. Exécuter les opérations autorisées ; conserver les approbations natives et le moindre privilège.
- Aucune fusion sans instruction humaine explicite. Depuis le 24 novembre, publication et correction des versions de développement autorisées de manière permanente sur la seule prévisualisation privée Tailscale existante (AGENTS.md, ADR-015).
- Cette autorisation exclut production/public, infrastructure, services, réseau et nouveaux privilèges. Ne jamais afficher/committer de secrets. Configurations privées hors Git.
- Un changement documentaire seul ne déclenche ni livraison ni autre commit d’horodatage.

## 2. Produit et règles retenues

Arcaday, sous **NUSINI**, réunit des mini-jeux quotidiens mobile-first et portrait-first.
Daily Impossible est un jeu de plateforme 2D ; Daily Crime reste ultérieur.
Web/PWA est la direction produit, iOS/Android envisagés ensuite.

Les [règles Daily Impossible](daily-impossible-design.md) consignent les décisions
utilisateur de phase 17 : précision et speedrun inspirés de Celeste, défi commun et
résultat définitif inspirés de Wordle, sans reprise de contenu. Trois boutons,
parcours horizontaux/verticaux/mixtes, vies illimitées, pas de checkpoint standard,
réapparition rapide, aucun piège imposant une mort inévitable.

Difficulté élevée dès le lundi et croissante jusqu’au dimanche ; objectifs 20–40 s
sans erreur et 2–3 min pour la première réussite. Moins de 25 % capables de terminer
rapidement et sans mourir est une cible de bêta, pas une mesure acquise.

Résultat quotidien définitif, suspension/reprise/abandon définitif, temps et morts
conservés entre sessions, classement morts puis temps et absence d’archives jouables
sont des décisions **non implémentées**. Rejouer reste provisoirement disponible.
Wall Slide/Jump, éditeur, raccourcis techniques et Perfect Run restent futurs ;
double saut et dash ne sont pas retenus. Aucun backend, compte ou classement livré.

## 3. Architecture actuelle

- TypeScript strict, Vite, Phaser 3 et Arcade Physics, application statique sans framework UI ni backend. Beige/noir, formes géométriques provisoires.
- `src/levels/types.ts` : données sérialisables et validation géométrique ; `first.ts` : premier parcours original. [Format](level-format.md).
- `GameScene` construit monde, plateformes/murs, obstacles, zones mortelles et arrivée à partir du niveau injecté. `Run` porte les transitions ; `movement.ts` garde les paramètres validés.
- Caméra bornée avec suivi interpolé sur les deux axes, zone de tolérance et anticipation horizontale réversible ; retour immédiat au départ après mort/Rejouer. Interface HTML fixe.
- Ancien terrain de phase 16 conservé en fixture de tests, uniquement en développement (`?test&level=prototype`). Sonde et fixture absentes du build publié.
- Pas d’orchestrateur ni déploiement/fusion automatique ; la publication privée est exécutée par l’agent suivant la procédure existante.

## 4. Environnement et opérations

- Dépôt `/home/arcaday/arcaday`, GitHub `WilliamBamba/arcaday`, utilisateur Linux `arcaday`.
- Node `20.20.1`, npm `10.8.2`, Python `3.12.3` observés ; CI sous Node 22. Dépendances dans le lockfile.
- GitHub App opérationnelle : publication Git par le helper existant ; jeton temporaire pour `gh` via `sudo -n -u william /usr/local/libexec/arcaday/github-token`, sans affichage ni stockage. Identité SSH, auteur Git et identité GitHub distincts.
- Protection de la clé App et règles Protect main rapportées par l’utilisateur, non réauditées. Aucun élargissement de permissions effectué. Déclenchement automatique de Codex Code Review à confirmer indépendamment de la CI.
- `arcaday-preview.service` : systemd utilisateur, serveur statique Python sur `127.0.0.1:4173`, active/enabled, Restart=on-failure (3 s), Linger=yes vérifiés lors des publications précédentes. Reboot non testé volontairement.
- Tailscale Serve privé persistant sur 8443, routes 443 préservées, Funnel inactif lors des contrôles précédents ; carte Arcaday dans Homepage. Ne pas reconfigurer ces services.
- Releases sous `~/.local/share/arcaday-preview/releases/<SHA>`, liens atomiques current/previous. Préparation isolée, contrôles et restauration : [ops/README.md](../ops/README.md).
- Chromium local utilise les bibliothèques temporaires sous `/tmp/arcaday-browser-libs/runtime/usr/lib/x86_64-linux-gnu` ; à préparer à nouveau si elles disparaissent. La CI installe ses dépendances navigateur normalement.

## 5. Historique Git utile

- PR #1–#5 : fondations et mémoire, main jusqu’à `a257311` ; PR #6 : workflow App testé, fermée sans fusion, branche distante nettoyée.
- PR #7 fermée sans fusion ; ses informations utiles ont été reprises par #8, ne pas refusionner son ancien instantané.
- PR #8 intégrée à `438abbb` : prototype, CI, publication privée ; corrections `c09e955` et `7140d23`.
- PR #9 **fusionnée à `3484110234747e7b062f8bd361dcc4984cb4c515`**, vérifié sur GitHub et après fetch le 25 novembre. Boucle de gameplay `ed5f05f`, autorisation permanente `436cf60`, glissements et sélection `ba56461`.
- Phase 17 : main synchronisée par avance rapide à `3484110`, dépôt initial propre, branche `feat/daily-impossible-level-design`. Ne pas recréer les anciennes PR squashées.

## 6. État fonctionnel et validation

La boucle de phase 16 est **validée sur iPhone selon l’utilisateur** : déplacements,
collisions, saut variable, pics, réapparition, compteur, commandes, drapeau et Rejouer.
Les glissements gauche/droite et protections Safari ont des tests Chromium ; la
confirmation spécifique de disparition de la sélection bleue n’est pas enregistrée.

Phase 17 : Traverse 01, monde 4 800 × 800, pics de largeur croissante, fossés,
murs bas, ligne élevée et montée de précision. Aucun changement de `movement.ts`
ni de `controls.ts`. Les objectifs de difficulté et de première réussite humaine
restent à calibrer ; la validation finale du nouveau parcours est réservée à l’iPhone.

La suite conserve les 14 scénarios historiques sur la fixture et ajoute cohérence
des données, parcours par commandes seules, caméra, collisions et réapparition.
TypeScript, 16 tests unitaires, 19 tests Chromium et build réussis localement. Les
deux lignes ont été terminées sans mort ni téléportation en environ 27,3 et 27,0 s ;
caméra bornée, plus de 178 px visibles devant le joueur hors bords. Captures portrait
examinées et revue du code effectuée. Les contrôles CI du dernier SHA sont à consulter dans
la PR de phase 17 ; ne pas leur attribuer ceux d’un commit précédent.

Prévisualisation **vérifiée avant publication de phase 17** : `ba5646155fe3bb878b4061c814e8762128c63fab`.
La mission prévoit de publier le nouveau SHA après contrôles. À la reprise, lire
`release.json` et current/previous, puis le rapport de PR pour la révision effectivement
servie et la restauration. Ne pas déduire la version servie du HEAD documentaire.

Limites : tests Chromium, pas de couverture exhaustive Safari/Android ; bundle
Phaser environ 344 ko gzip, performances et temps de chargement mobile à mesurer.
Ni persistance intersession ni chronométrage produit ne sont livrés.

## 7. Roadmap

1. Valider sur iPhone Traverse 01 : visibilité des prochains dangers, confort de caméra, sauts et réapparition ; mesurer durée sans erreur et première réussite.
2. Ajuster le level design selon ces essais, revue de la PR, fusion seulement après instruction humaine.
3. Plus tard : Wall Slide/Jump, éditeur, défis quotidiens/persistance/classement et distribution PWA/native selon priorités explicites. Daily Crime reste ultérieur.

## 8. Prochaine action exacte

- Examiner la branche `feat/daily-impossible-level-design`, sa PR et les deux contrôles GitHub Actions.
- Vérifier le SHA de la prévisualisation et recueillir les essais iPhone. Publier les corrections privées après contrôles selon l’autorisation permanente ; aucune fusion automatique.
- Garder les mouvements et commandes validés ; ne pas ajouter Wall Slide/Jump, double saut ou dash pendant cette phase.
- Ne pas considérer les objectifs de bêta comme des statistiques établies ni les décisions quotidiennes comme déjà développées.
- Version stable future : proposition de commande sur SHA de main approuvé, préparation isolée, contrôles, publication atomique et restauration ; aucun timer/push automatique ni service stable installé.

## 9. Journal récent

| Date | Résultat |
| --- | --- |
| 2026-11-24 | Boucle phase 16 validée iPhone, corrections ergonomiques et autorisation permanente de publication privée |
| 2026-11-25 | Fusion #9 vérifiée à 3484110 ; architecture déclarative, caméra et premier parcours de phase 17 préparés sur nouvelle branche |

## 10. Maintenance

Actualiser pour un jalon, changement d’environnement/workflow/roadmap/prochaine action,
pas pour chaque opération mineure. Conserver preuves et limites ; décisions dans
le registre. Vérifier cohérence, liens, secrets, diff et contrôles pertinents avant
commit. Ne jamais prétendre qu’un test non exécuté a réussi. Aucun commit de simple
horodatage ni publication automatique à la suite d’une mise à jour documentaire.
