# Arcaday — mémoire du projet

État consolidé le **24 novembre 2026 (Europe/Paris)** pour la phase 16, boucle de gameplay. Commencer par la section 8, puis vérifier Git : cet instantané ne remplace pas le dépôt vivant.

**Vérifié** désigne une observation du dépôt, des outils ou des opérations précédentes de cette mission. **Rapporté** désigne une confirmation de l’utilisateur, notamment les essais iPhone. **À confirmer** distingue ce qui n’a pas été établi.

## 1. Instructions de reprise

- Lire [AGENTS.md](../AGENTS.md), la [vision](vision.md) et les [décisions](architecture/decisions.md).
- Préserver les changements locaux ; travailler sur une branche dédiée, jamais directement sur `main`. Utiliser les PR et Conventional Commits.
- L’utilisateur souhaite piloter Arcaday depuis ChatGPT, Codex Desktop et GitHub, sans recopier de commandes sur le serveur. Exécuter les opérations autorisées et utiliser les approbations natives si nécessaire ; elles ne confèrent pas de droits administrateur Linux.
- Ne jamais fusionner sans autorisation explicite. Depuis le 24 novembre, les publications et corrections de développement sur la prévisualisation Tailscale privée existante sont autorisées de façon permanente (AGENTS.md, ADR-015) ; production et infrastructure sont exclues. Des contrôles verts ou une approbation GitHub ne valent pas instruction de fusion.
- Ne pas modifier les services voisins, les protections ni les privilèges ; ne jamais afficher ou committer de secrets. Conserver les configurations privées du serveur hors Git.
- Garder la mémoire autonome, factuelle et concise ; documenter les décisions importantes et les limites des vérifications.

## 2. Produit et périmètre

Arcaday, sous la marque **NUSINI**, vise une collection de mini-jeux quotidiens, mobile-first et portrait-first. Daily Impossible est un jeu de plateforme 2D ; Daily Crime, une future enquête. Web/PWA est la direction produit, avec iOS/Android envisagés ultérieurement.

Le **premier prototype Daily Impossible est terminé et validé sur iPhone réel selon l’utilisateur**, y compris les dernières corrections tactiles. La phase 16 ajoute sur une branche dédiée les pics mortels fixes, la réapparition rapide, le compteur de morts et le drapeau avec résultat et bouton Rejouer. Cette nouvelle boucle est testée automatiquement, mais reste à valider sur iPhone ; elle est publiée sur la prévisualisation privée, mais non fusionnée. Le système quotidien, les classements, séries, partage, backend, stockage et distribution native ne sont pas implémentés. La PWA installable reste ultérieure.

## 3. Objectifs techniques

Privilégier gameplay, lisibilité, performances mobiles et composants simples. La stack adoptée est **TypeScript strict, Vite, Phaser 3 et Arcade Physics**, sans framework UI ni backend. Beige/noir et géométrie simple constituent une direction artistique provisoire.

Le Harness Engineering progresse par GitHub App, tests et CI, revue humaine et publications privées autorisées. Aucun orchestrateur personnalisé, déploiement automatique ou fusion automatique n’est installé.

## 4. Environnement et opérations

- Dépôt : `/home/arcaday/arcaday`, GitHub `WilliamBamba/arcaday` ; utilisateur Linux `arcaday`.
- Node `20.20.1`, npm `10.8.2`, Python `3.12.3` observés lors des missions du prototype ; CI applicative sous Node 22. Versions et dépendances exactes dans le lockfile.
- **GitHub App `arcaday-codex-bot` opérationnelle** : publication Git via le helper existant ; `gh` utilise un jeton temporaire généré par `sudo -n -u william /usr/local/libexec/arcaday/github-token`, fourni uniquement au processus concerné. Ne jamais afficher ou stocker ce jeton. SSH, auteur Git et identité GitHub sont distincts.
- Protection de la clé de l’App et règles `Protect main` rapportées par l’utilisateur, non réauditées ici. Aucun élargissement des droits de l’App effectué. Un ancien refus de publication de workflow ne décrit pas la CI actuellement présente.
- `arcaday-preview.service` : service systemd utilisateur, serveur statique Python, écoute exclusive sur `127.0.0.1:4173`, enabled et active/running observés. `Restart=on-failure`, délai 3 secondes, `Linger=yes` vérifiés après intervention administrative.
- Tailscale Serve persistant : HTTPS privé sur 8443 vers le service local ; routes préexistantes conservées et Funnel inactif lors des contrôles. Carte **Arcaday — Prototype** visible dans Homepage, avec le bon lien. Les données privées de configuration ne sont pas versionnées.
- Releases sous `~/.local/share/arcaday-preview/releases/<SHA>` ; liens atomiques `current` et `previous`. Procédure et logs : [ops/README.md](../ops/README.md). Pas de Vite dev comme serveur permanent.
- Le démarrage au reboot est configuré ; aucun reboot ni crash volontaire n’a été réalisé pour le tester.

## 5. Historique utile

| Étape | Preuve / référence |
| --- | --- |
| Fondations, vision et mémoire | PR #1/#2 ; vision `c7b272a`, mémoire `ea2306f`, règles de maintenance `e662714` |
| Revue documentaire et intégration initiale | Corrections `9cad028`, PR #3 intégrée à `1594d78`, PR #4 à `81a9b13`, PR #5 à `a257311` ; historique local vérifié |
| Workflow App | PR #6 créée puis fermée sans fusion ; branche distante de test supprimée, branche locale conservée ; auteur App vérifié, succès CI du test rapporté |
| Mémoire du Harness Engineering | PR #7, branche `codex/document-harness-results`, tête `20527f6` ; fermée sans fusion, état GitHub vérifié le 24 novembre |
| Prototype | PR #8 fusionnée dans `main` à `438abbb`, vérifié sur GitHub et par fetch ; finalisation documentaire `8cff34a` |
| Prévisualisation privée | Scripts `5f63724`, puis activation administrative du linger, Serve et Homepage ; vérifications privées réussies |
| Ergonomie | `c09e955` : flèche de saut et sélection de texte ; `7140d23` : sortie/retour du doigt dans le bouton d’origine |
| Publication privée et validation iPhone | `7140d235e1056bf6ebfa245c33b40217313cbdac` publié après autorisation ; validation finale sur iPhone confirmée par l’utilisateur |

Les anciens commits d’une PR squashée ne doivent pas être recréés ou refusionnés.

## 6. État actuel et preuves

### Fonctionnalités validées

- Terrain logique 360 × 550, sol, quatre plateformes solides et silhouette géométrique.
- Déplacements, collisions et hauteur de saut variable validés sur iPhone selon l’utilisateur. Ne pas modifier leur comportement pendant la prochaine fonctionnalité sans justification et validation.
- Boutons gauche/droite/↑, nom accessible « Sauter », aide clavier masquée sur les appareils tactiles ; sélection et menus contextuels inhibés uniquement dans la zone des commandes.
- Chaque doigt reste associé à son bouton initial : sortie du rectangle désactive la commande, retour la réactive, passage sur un autre bouton sans activation. Multitouch indépendant ; relâchement, annulation, perte de capture, focus et visibilité nettoient les commandes. Clavier conservé.

### Phase 16 — boucle de gameplay

- Branche `feat/daily-impossible-gameplay-loop`, créée depuis `main` synchronisée par avance rapide à `438abbb` ; dépôt initial propre.
- Trois groupes de pics fixes, compteur, mort unique, réapparition au départ après 180 ms ; corps et commandes remis à zéro, nouvelle pression nécessaire. Victoire unique au drapeau, arrêt du jeu, résultat et Rejouer sans rechargement ; compteur remis à zéro.
- Paramètres de `movement.ts` et géométrie des quatre plateformes inchangés. Parcours complet réalisable au clavier, vérifié sans téléportation par un scénario navigateur.
- TypeScript, 8 tests unitaires, 12 tests Chromium et build réussis localement. Les 8 scénarios navigateur précédents sont conservés ; deux positions de départ de tests d’entrée sont décalées pour éviter les nouveaux pics.
- PR #9 ouverte, commit applicatif `ed5f05f1d60965073f7c6cf6f9e5276eb5f3a303` : deux contrôles GitHub Actions réussis. Le commit documentaire suivant doit être vérifié indépendamment.
- Publication privée effectuée le 24 novembre depuis une archive isolée du SHA exact, après `npm ci`, types, 8 tests unitaires, 12 tests Chromium et build. Révision HTTPS vérifiée : **`ed5f05f1d60965073f7c6cf6f9e5276eb5f3a303`** ; retour arrière conservé : **`7140d235e1056bf6ebfa245c33b40217313cbdac`**.
- Service actif et activé ; certificat HTTPS, HTML et ressources JS/CSS vérifiés, octets identiques au build isolé. Smoke test Chromium sur HTTPS : chargement, sortie/retour tactile, collision mortelle, compteur et nettoyage des entrées réussis, sans erreur détectée. Aucune configuration de service/réseau modifiée.
- À valider sur iPhone : lisibilité et hitboxes des pics, délai de reprise, doigts maintenus pendant une mort, compteur, victoire et Rejouer. La validation du prototype précédent reste acquise, celle de cette boucle reste à faire.

### Tests et publication du prototype précédent

- Sur le code `7140d23` : TypeScript, **5 tests unitaires**, **8 tests Playwright/Chromium** et build réussis localement, également dans une préparation isolée avant publication.
- Test du mécanisme de publication : conservation de la précédente release, bascule et refus des liens symboliques/écrasements vérifiés lors de son installation.
- Deux contrôles GitHub Actions réussis sur `7140d23` : **Validate project instructions** et **Validate playable prototype**. Le second exécute `npm ci`, `npm run check`, installation Chromium et `npm run test:e2e`. Consulter le résultat du dernier commit documentaire sur la PR avant revue ; ne pas lui attribuer automatiquement le résultat du commit précédent.
- Publication historique du prototype : `7140d235e1056bf6ebfa245c33b40217313cbdac`, avec `c09e955` comme précédente release. La version courante est désormais celle de la phase 16 ci-dessus.
- HTTPS et certificat validés ; HTML, JavaScript et CSS comparés aux octets du build isolé. Chargement Chromium et sorties/retours tactiles vérifiés, sans erreur détectée. Un premier contrôle trop rapide a déclenché une restauration vérifiée ; après attente correcte des événements, la publication du même commit a réussi.
- L’environnement local Chromium a nécessité deux bibliothèques extraites temporairement plutôt qu’une installation système. Elles devront être préparées à nouveau si l’environnement temporaire disparaît ; la CI utilise `playwright install --with-deps chromium`.
- Avertissement Vite connu : bundle Phaser d’environ 1,49 Mo minifié / 342 ko gzip. Pas de mesure exhaustive de performances, de validation Android ou de couverture de toutes les versions Safari. Cela n’annule pas la validation utilisateur de ce premier prototype.

### PR #7 et #8

La PR #8 est fusionnée à `438abbb` et la PR #7 fermée sans fusion, états vérifiés sur GitHub le 24 novembre. Les informations utiles de #7 sont conservées dans la mémoire ; son ancien instantané ne doit pas être refusionné. La phase 16 utilise une nouvelle branche et une nouvelle PR.

Les protections (PR, approbation humaine, squash, révocation des approbations, branche à jour) restent des informations rapportées. Codex Code Review manuel a été validé selon l’utilisateur ; son déclenchement automatique reste à confirmer indépendamment de la CI.

## 7. Roadmap

1. Revoir la PR de phase 16 et ses deux contrôles CI, puis valider la boucle sur iPhone depuis la prévisualisation privée publiée.
2. Ajuster uniquement les défauts constatés avant éventuelle intégration autorisée. Le niveau complet de deux minutes, checkpoints et animations détaillées restent hors périmètre.
3. Plus tard : système quotidien, progression des jeux, distribution PWA/native et déploiement stable automatisé après validation. Daily Crime reste ultérieur.

## 8. Prochaine action exacte — point de reprise

- Examiner la branche `feat/daily-impossible-gameplay-loop`, sa PR et les contrôles du dernier commit. Ne pas refaire la PR #8 ni rouvrir #7.
- La boucle est publiée en privé ; recueillir les essais iPhone et corriger si nécessaire. L’autorisation permanente permet de republier les corrections après contrôles sans redemander un accord. Ne pas fusionner automatiquement.
- Préserver les paramètres de mouvement et les commandes validées. Tester sur iPhone les transitions mort/réapparition/victoire/rejouer et la nécessité de réappuyer après une mort.
- La prévisualisation sert `ed5f05f`, avec retour arrière `7140d23`, vérifiés le 24 novembre. Ne pas toucher à Tailscale, Homepage ou aux autres services.
- Automatisation future seulement proposée : commande lancée par l’agent après validation humaine d’un SHA de main, préparation isolée, contrôles, publication atomique, santé HTTPS et retour arrière. Aucun déclenchement automatique actif.

## 9. Journal récent

| Date (Europe/Paris) | Résultat |
| --- | --- |
| 2026-11-16 | Service privé, linger, HTTPS et carte Homepage vérifiés après intervention administrative |
| 2026-11-16 | Corrections ergonomiques `c09e955`, puis `7140d23`, testées, publiées sur #8 et déployées en privé après autorisations distinctes |
| 2026-11-24 | Phase 16 : PR #9, commit `ed5f05f` testé puis publié en privé ; HTTPS vérifié, retour arrière `7140d23`. Autorisation permanente de publication privée consignée, hors production et infrastructure |
| 2026-11-16 | Validation finale iPhone confirmée par l’utilisateur, y compris la sortie/entrée tactile ; mémoire consolidée pour revue de #8, prochaine étape définie : boucle de gameplay |

## 10. Protocole de maintenance

Mettre à jour ce document lors d’un jalon, changement d’environnement, workflow, roadmap ou prochaine action ; pas pour chaque opération mineure. Conserver les preuves utiles et les limites sans recopier les conversations. Documenter les décisions significatives dans le registre, sans inventer une adoption ou une implémentation.

Avant finalisation : vérifier cohérence, liens relatifs, secrets, `git diff --check` et fichiers non suivis ; exécuter les contrôles pertinents. Ne jamais prétendre qu’un test non exécuté a réussi. Inclure la mémoire dans le même commit que le travail associé si approprié et autorisé ; aucune mise à jour documentaire ne déclenche automatiquement une publication, fusion ou livraison, ni un nouveau commit de simple horodatage.
