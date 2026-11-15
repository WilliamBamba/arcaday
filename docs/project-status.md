# Arcaday — mémoire du projet

Dernière synchronisation de la mémoire : **15 novembre 2026 (Europe/Paris)**, pendant la préparation du test de revue automatique GitHub, après fusion de la PR #4 et synchronisation locale de `main`. Ce document constitue le point d’entrée autonome pour reprendre le projet sans les conversations précédentes. Commencer par la section 8 ; cet instantané ne remplace pas le dépôt vivant. La présente mise à jour est préparée sans commit sur une branche dédiée.

Les mentions **Vérifié** désignent une observation du dépôt ou de l’environnement ; **Rapporté** désigne les informations fournies par l’utilisateur ; **À confirmer** désigne une information non établie. Une intention produit n’est pas une fonctionnalité opérationnelle.

## 1. Instructions de reprise pour ChatGPT

Tu es l’architecte technique accompagnant le développement d’Arcaday. Le projet utilise principalement Codex CLI ; Codex Desktop a aussi été testé avec succès pour le travail sur le dépôt distant. L’utilisateur privilégie le Harness Engineering et souhaite minimiser les interventions manuelles.

- Travailler étape par étape, avec une seule action concrète à la fois.
- Expliquer brièvement les actions avant de les proposer.
- Privilégier Codex pour les opérations qu’il peut réaliser en sécurité.
- Demander les résultats des commandes avant de poursuivre lorsqu’elles sont confiées à l’utilisateur ; lorsque Codex les exécute, examiner ses résultats avant l’action dépendante.
- Ne pas recommencer les étapes déjà validées ; vérifier uniquement ce qui peut avoir changé.
- Ne pas installer de nouveaux outils sans justification.
- Ne jamais désactiver les mécanismes de sécurité pour simplifier une opération ; conserver le sandbox et utiliser les autorisations natives.
- Préserver et signaler les modifications non committées. Ne jamais développer directement sur `main`.
- Ne jamais fusionner dans `main` sans autorisation explicite ; tout déploiement requiert également une approbation humaine.
- Pour cette mise à jour : branche `docs/update-harness-status`, créée depuis `main` synchronisée ; seul `docs/project-status.md` peut être modifié. Aucun commit, publication, création de PR ou fusion autorisé. Attendre l’autorisation de l’utilisateur avant le commit.

ChatGPT accompagne les décisions et formule les actions ; Codex exécute les opérations autorisées dans le dépôt et en rapporte les résultats. Si l’assistant dispose lui-même des outils nécessaires, il peut les utiliser dans ce périmètre. Sans accès au dépôt, fournir une seule instruction à transmettre à Codex, puis demander son résultat avant de continuer ; ne jamais prétendre avoir vérifié le serveur depuis ce seul document.

Règles permanentes complémentaires : utiliser des branches dédiées et des commits petits et significatifs au format Conventional Commits ; intégrer par PR. Pour un changement important, proposer un plan avant d’implémenter la solution approuvée. Privilégier qualité du gameplay, composants maintenables et performances mobiles. Appliquer le moindre privilège, demander les autorisations natives pour les opérations privilégiées, ne jamais modifier de services serveur sans rapport avec la tâche ni committer de secrets. Respecter licences et vie privée, signaler les exigences Apple/Google Play lors de la préparation mobile et demander une revue des fonctions de monétisation.

L’approbation du contenu documentaire ne vaut pas autorisation de commit, de publication, de création de PR, de fusion ou de déploiement. Ne pas redemander une autorisation déjà explicitement donnée pour l’action concernée ; en l’absence de trace disponible, demander uniquement l’instruction manquante.

Références : [règles des agents](../AGENTS.md), [vision produit](vision.md), [registre des décisions](architecture/decisions.md). Elles complètent ce point d’entrée ; les faits nécessaires à la reprise figurent ci-dessous.

## 2. Présentation du projet

Arcaday est une plateforme de mini-jeux quotidiens sous la marque **NUSINI**. Chaque jeu indépendant propose un défi quotidien identique pour tous, avec des parties courtes et rejouables. Classements, séries et partage des résultats font partie du concept demandé, pas d’une implémentation existante.

L’expérience vise le **mobile-first et portrait-first**, avec une première version **Web/PWA** prévue et une évolution envisagée vers iOS et Android, dont l’implémentation n’est pas encore décidée. La direction artistique décrite dans la vision est minimaliste et rétro-arcade ; aucune charte graphique détaillée n’a été trouvée.

- **Daily Impossible** : jeu de plateforme 2D rétro, avec un niveau quotidien et une sortie à atteindre.
- **Daily Crime** : jeu d’enquête dans lequel le joueur doit identifier le coupable.

La collection quotidienne, les deux jeux et les plateformes sont décrits dans `docs/vision.md`. Le portrait-first, les classements, les séries et la sortie à atteindre sont des précisions rapportées lors de la création de la mémoire.

## 3. Objectifs techniques

Construire progressivement un environnement de Harness Engineering reposant sur Codex CLI, Git et GitHub, les tests automatisés, la CI/CD, la revue de code, des agents spécialisés et des déploiements contrôlés. Privilégier les fonctionnalités natives plutôt qu’un orchestrateur personnalisé.

Cette ambition est validée comme direction par l’utilisateur. Elle ne décrit pas un système déjà complet : seuls le dépôt, ses règles, sa documentation et la configuration d’une CI documentaire sont actuellement vérifiés.

## 4. Environnement technique

| Élément | Observation et provenance |
| --- | --- |
| Système | Ubuntu 24.04.4 LTS, Noble Numbat ; inspection initiale du 8 novembre, non revérifiée ici |
| Répertoire de travail | `/home/arcaday/arcaday` |
| Utilisateur Linux dédié | `arcaday`, vérifié par `whoami` dans cette conversation ; UID/GID 1001 et groupes issus de l’inspection initiale |
| Accès au projet | Connexion SSH dédiée `hetzner-arcaday`, indiquée par l’utilisateur ; répertoire vérifié dans cette conversation |
| Codex Desktop | Testé avec succès : inspection, fetch et synchronisation Git avec autorisations natives |
| Autres utilisateurs concernés | À confirmer ; aucun rôle d’administration supplémentaire établi |
| Dépôt GitHub configuré | `WilliamBamba/arcaday` |
| Remote `origin` | `https://github.com/WilliamBamba/arcaday.git` pour lecture et publication |
| Codex CLI | `0.153.4`, disponible et vérifié dans cette conversation |
| Git / GitHub CLI | `2.43.0` / `2.45.0` |
| Node.js / npm | `v20.20.1` / `10.8.2` ; présence des outils, pas choix de stack applicative |
| Python | `3.12.3` ; aucun usage applicatif établi |
| Configuration Git | Dépôt non bare ; identité `WilliamBamba`, adresse GitHub noreply configurée ; `main` suit `origin/main` ; branche documentaire actuelle sans suivi distant |

Structure initiale avant la création de la mémoire : `README.md`, `AGENTS.md`, `docs/vision.md` et `.github/workflows/ci.yml`. Aucun code applicatif, manifeste de dépendances, moteur de jeu, backend, base de données ou configuration de déploiement n’est présent dans les fichiers suivis inspectés. Les deux documents de mémoire complètent cette structure.

**CI vérifiée dans le fichier**, nommée `Arcaday CI` : déclenchement sur les Pull Requests et les pushes vers `main`, job `documentation` sur `ubuntu-latest`, délai maximal de cinq minutes, permission `contents: read`, `actions/checkout@v7` avec `persist-credentials: false`. Le script vérifie qu’`AGENTS.md` est non vide et comporte les titres Project, Git Workflow, Security et Quality. Il ne valide pas les nouveaux documents ni un jeu. Aucun déploiement automatique n’y est défini.

Les versions de Git, GitHub CLI, Node.js, npm et Python ci-dessus proviennent de l’inspection initiale du 8 novembre et n’ont pas été revérifiées pendant cette mise à jour.

**Séparation des accès** : la connexion SSH au serveur, l’identité d’auteur Git et l’authentification GitHub sont distinctes. Le remote utilise HTTPS. La synchronisation précédente a réussi avec `GIT_TERMINAL_PROMPT=0`, `GIT_ASKPASS=/bin/false` et `git -c credential.helper= fetch` : aucun jeton fourni ni authentification interactive demandée. Cela ne prouve pas que Codex dispose d’un accès de publication. Les écritures dans `.git` ont nécessité les autorisations natives du sandbox pour le fetch, le changement de branche et l’avance rapide ; la création de la branche actuelle a également réussi après autorisation native. Ne pas désactiver le sandbox ni copier de secrets ; arrêter et signaler toute authentification nécessaire.

**À confirmer indépendamment** : protections de branche, mécanisme de publication antérieur, authentification durable de GitHub et éventuels services hors dépôt. Le succès GitHub Actions reste une information rapportée par l’utilisateur ; seul le hash distant de `main` a été contrôlé pendant cette mise à jour, sans vérifier les réglages GitHub ni les résultats de CI.

## 5. Historique des étapes validées

La numérotation ci-dessous est celle fournie par l’utilisateur ; elle n’est pas déduite du journal Git.

| Étape | Historique rapporté | Preuve disponible aujourd’hui |
| --- | --- | --- |
| 13.3 | Création de branche Git par Codex avec autorisation native | Rapporté ; mécanisme d’autorisation non reconstitué |
| 13.4 | Suppression de la branche temporaire | Rapporté ; aucune preuve spécifique de suppression examinée |
| 13.5 | Création autonome de `docs/vision.md` et commit `c7b272a` | Fichier et commit vérifiés ; autonomie rapportée |
| 13.6 | Vérification du document et du commit | Validation passée rapportée ; contenu et commit réinspectés lors de cette mission |
| 13.7 | Publication de `docs/project-vision` sur GitHub | Publication rapportée ; référence de suivi à `c7b272a` lors de l’inspection initiale, à `9cad028` lors de la synchronisation récente ; historique de publication rapporté |

Les réalisations terminées sont : première documentation de vision (`c7b272a`), mémoire persistante et registre des décisions (`ea2306f`), règles de maintenance dans `AGENTS.md` (`e662714`), première revue indépendante locale par Codex, correction des trois remarques documentaires (`9cad028`), validation GitHub Actions rapportée, fusion de la PR #3 et synchronisation locale de `main`.

La revue locale consignée dans la mémoire précédente portait sur `3ed43a7` → `e662714` : aucun problème bloquant ni important, trois remarques mineures, recommandation **COMMENT**. Les corrections concernent ADR-003, le point de reprise et la formulation iOS/Android. Leur commit a été inspecté dans cette conversation : seuls les trois documents autorisés ont changé. La revue est terminée ; elle n’a pas été rejouée ici.

Les PR #1 (fondations) et #2 (CI) précèdent la PR #3. Celle-ci est la première PR documentaire de cette branche, pas la première PR du dépôt.

## 6. État actuel

### Vérifié localement

- `main` et la référence locale `origin/main` pointent sur **`81a9b135d20009826f05ea09173c79d0930a0f4a`**, message `docs: update project status after first merge`. Le 15 novembre 2026, `git ls-remote` a confirmé le même hash sur GitHub, sans authentification interactive. L’arbre était propre avant la création de la branche de travail.
- Selon l’historique de cette conversation, la PR #4 a été fusionnée avec Squash and Merge, puis `main` a avancé de `1594d78` vers `81a9b13` avec `git merge --ff-only origin/main`. La synchronisation a été vérifiée avec un arbre propre ; la fusion de la PR elle-même est rapportée par l’utilisateur.
- Les anciennes branches documentaires sont conservées. Le commit `16f53a7` de `docs/update-project-status-after-first-merge` a fourni la mise à jour intégrée dans `81a9b13`. Les commits d’origine d’une PR squashée ne doivent pas être recréés ni refusionnés.
- Branche de cette mission : **`docs/update-harness-status`**, créée depuis `main` vérifiée à jour. Seul `docs/project-status.md` est modifié ; aucun commit, push, création de PR ou fusion n’est autorisé. À la reprise, vérifier Git avant de déterminer si cet instantané a depuis été committé.
- `README.md`, `AGENTS.md`, `docs/vision.md`, `docs/project-status.md` et `docs/architecture/decisions.md` sont présents. Les règles de maintenance sont intégrées dans `AGENTS.md`.
- Aucun code applicatif ni test applicatif n’est présent dans les fichiers suivis. Jeux, défis quotidiens, classements, séries, partage et Web/PWA restent à développer ; l’implémentation iOS/Android reste à décider.

### Rapporté par l’utilisateur — GitHub distant

- PR **#3 fusionnée avec Squash and Merge** ; le commit récupéré et l’égalité des contenus corroborent localement cette intégration. L’état de la PR via l’API n’a pas été interrogé.
- GitHub Actions validé : résultat précédemment rapporté **Validate project instructions : SUCCESS**. Cette preuve historique ne permet pas d’affirmer le résultat d’une exécution sur le commit squash ou sur la présente mise à jour.

- **Ruleset `Protect main` configuré**, selon l’utilisateur : PR obligatoire, squash uniquement, contrôle CI **Validate project instructions** obligatoire, branche à jour avant fusion, suppression et force-push interdits. Configuration et application effective non vérifiées indépendamment dans cette mission.
- **Codex Code Review activé**, selon l’utilisateur : toutes les PR, à chaque push, avec revue exhaustive. Ce réglage rapporté ne prouve pas encore le déclenchement ni la réussite d’une revue réelle ; le test documentaire est la prochaine étape.

### État de l’automatisation

**Fonctionnel**, avec un périmètre de preuve explicite :

- Création de branches et modification de fichiers par Codex : constatées dans cette session.
- Commits : présents et vérifiés dans l’historique, réalisation antérieure par Codex rapportée ; aucun nouveau commit créé pendant cette mission.
- Revue locale et validations documentaires : réalisées lors des missions précédentes et consignées dans la mémoire ; contrôles documentaires à rejouer pour chaque changement pertinent.
- Synchronisation Git avec autorisations natives : fetch, changement de branche et avance rapide réussis dans Codex Desktop.
- CI GitHub Actions : workflow présent, succès distant rapporté par l’utilisateur.

**Pas encore automatisé de bout en bout** : publication des branches et création de Pull Requests directement depuis Codex Desktop, fusion contrôlée et déploiement. La revue automatique GitHub est désormais configurée selon l’utilisateur, mais son fonctionnement sur une vraie PR reste à tester. La fusion manuelle de la PR #3 ne valide pas une automatisation de la fusion. Aucun mécanisme supplémentaire d’exécution automatique n’a été installé par la maintenance documentaire.

### À confirmer et limites

- La priorité immédiate est le test d’une vraie revue automatique sur une PR documentaire. Le test de reprise ChatGPT figurait dans la roadmap précédente ; son résultat n’est pas vérifié indépendamment ici et n’est pas déduit du seul message du commit squash.
- L’authentification GitHub de Codex pour les opérations de publication reste à établir ; un ancien échec de `gh pr list` demandant une authentification ne contredit pas le fetch HTTPS réussi sans gestionnaire d’identifiants.
- `codex --version` a affiché sa version avec un avertissement concernant la création impossible d’alias PATH sur un système de fichiers en lecture seule. Les opérations Git autorisées ont néanmoins réussi ; aucune sécurité n’a été désactivée.
- Aucun bug applicatif évalué, puisqu’aucune application n’est présente.

## 7. Roadmap

Ces actions restent à réaliser ou à valider, dans cet ordre :

1. Tester une vraie revue automatique Codex sur une PR documentaire, après validation de cette modification et autorisation des opérations GitHub nécessaires.
2. Après observation du résultat de la revue, poursuivre le Harness Engineering : définir puis automatiser progressivement le workflow GitHub sécurisé (publication, PR, revue et fusion contrôlée), avec le minimum de privilèges et les validations humaines requises.
3. Définir l’architecture applicative et consigner les choix approuvés dans le registre.
4. Développer le prototype Daily Impossible.
5. Ajouter progressivement les agents de test et de revue, les tests adaptés et les déploiements contrôlés.

Aucun framework, moteur ou orchestrateur personnalisé n’est choisi. Le commit de la présente mémoire attend une autorisation séparée ; il ne faut pas confondre sa finalisation avec une nouvelle exécution des étapes de la PR #3.

## 8. Prochaine action exacte — point de reprise

- **Priorité immédiate** : tester une vraie revue automatique Codex sur une PR documentaire. La fusion de la PR #4 et la synchronisation historique à `81a9b13` sont déjà terminées ; ne pas les recommencer.
- **Action immédiate dans cette mission** : présenter le diff et les contrôles de `docs/project-status.md` sur `docs/update-harness-status`, puis attendre la validation de l’utilisateur. Aucun commit, push, création de PR ou fusion autorisé.
- **Test ultérieur, après autorisation** : committer et publier la modification validée, ouvrir une PR documentaire vers `main`, puis observer la revue Codex et le contrôle CI sur le hash publié. Un push ultérieur autorisé permettra de vérifier le déclenchement à chaque push. Ne pas déclarer la revue réussie sur la seule base du réglage rapporté, ni confondre la revue Codex avec GitHub Actions.
- **Critères de validation du test** : identifier la PR, le commit examiné et la réponse de Codex ; distinguer absence de remarque, remarques à traiter, absence de déclenchement et échec. Consigner les résultats effectivement observés, sans garantir l’exhaustivité de détection des défauts. Vérifier séparément la CI ; aucune fusion automatique n’est autorisée.
- **Si accès au dépôt** : lire `AGENTS.md`, examiner `git status --short --branch`, `git log -1 --oneline` et le diff. Préserver les modifications non committées et ne pas recréer les commits existants. Sans accès, présenter ce document comme un instantané ; les réglages `Protect main` et Codex Code Review restent des informations rapportées tant qu’ils ne sont pas vérifiés.
- **Suite** : automatiser la publication des branches et la création de PR directement depuis Codex Desktop, avec séparation des identifiants et maintien du sandbox. L’architecture GitHub App avec service isolé proposée lors de l’audit de phase 14 reste une recommandation non adoptée et non implémentée. Fusions et déploiements exigent toujours une validation humaine.

## 9. Journal de progression

| Date | Action | Résultat | Référence |
| --- | --- | --- | --- |
| Date non fournie | Étapes 13.3 et 13.4 : essai de branche et suppression | Validées selon l’utilisateur ; non vérifiées indépendamment | Aucune référence fournie |
| 2026-11-08 | Fondations et CI documentaire | Commits de fusion présents dans l’historique local | PR #1 : `4c867b6` ; PR #2 : `3ed43a7` |
| 2026-11-08 | Création de la vision | Fichier et commit vérifiés ; étapes 13.5–13.6 rapportées validées | `c7b272a` |
| Date non fournie | Publication de la branche, étape 13.7 | Rapportée ; référence de suivi locale présente | Référence de suivi à `c7b272a` lors de l’inspection initiale |
| 2026-11-08 | Création de la mémoire et inspection locale | Deux documents rédigés ; validation documentaire locale réussie ; revue utilisateur en attente | Non committé, base `c7b272a` |
| 2026-11-08 | Audit de reprise autonome | Lecture isolée du statut puis comparaison des références ; ambiguïtés corrigées ; contrôles locaux réussis ; validation utilisateur toujours en attente | Seul le statut modifié pendant l’audit ; aucun commit |
| 2026-11-08 | Validation utilisateur et commit de la mémoire | Deux documents créés, contenu du commit vérifié ; aucune publication effectuée | `ea2306f` |
| 2026-11-08 | Instructions permanentes de maintenance | Commit vérifié localement : règles ajoutées à `AGENTS.md` et statut synchronisé | `e662714` |
| Date du résultat distant non précisée | Publication et PR #3 | Selon l’utilisateur : branche publiée, PR OPEN, MERGEABLE et CLEAN ; Validate project instructions SUCCESS | Résultat de `gh` rapporté par l’utilisateur, non revérifié par Codex |
| 2026-11-08 | Revue locale Codex de la PR #3 | Aucun problème bloquant ni important ; trois remarques mineures ; recommandation COMMENT | Comparaison locale `3ed43a7` → `e662714` |
| 2026-11-08 | Correction des remarques de revue | Trois documents corrigés localement ; cohérence, script CI, liens, structure, recherche de secrets et diff contrôlés ; aucun commit ni publication | Modifications non committées sur la base `e662714` |
| 2026-11-09 (Europe/Paris) | Vérification des corrections committées | Trois documents uniquement ; arbre propre | `9cad028` sur `docs/project-vision` |
| 2026-11-09 (Europe/Paris) | Fusion de la PR #3 | Squash and Merge rapporté par l’utilisateur ; contenu récupéré identique à la branche documentaire | `1594d78` |
| 2026-11-09 (Europe/Paris) | Test Codex Desktop et synchronisation | Fetch et avance rapide réussis avec autorisations natives ; `main` alignée sur `origin/main`, arbre propre ; ancienne branche conservée | `3ed43a7` → `1594d78` |
| 2026-11-09 (Europe/Paris) | Actualisation de la mémoire après fusion | Branche dédiée créée ; seul le statut actualisé ; commit en attente d’autorisation ; test en nouvelle conversation à réaliser | Base `1594d78` |
| 2026-11-09 (Europe/Paris) | Commit de la mémoire puis fusion PR #4 et synchronisation | Commit local vérifié, fusion squash rapportée ; avance rapide de main vérifiée avec arbre propre | `16f53a7` → squash `81a9b13` |
| 2026-11-15 (Europe/Paris) | Préparation du test de revue automatique | Main locale et distante vérifiées à `81a9b13` ; branche dédiée créée ; règles Protect main et Code Review rapportées par l’utilisateur ; test réel à effectuer | `docs/update-harness-status`, aucun commit |

## 10. Protocole de mise à jour

La section `Project Memory & Continuity` d’`AGENTS.md` impose désormais cette maintenance. Avant de terminer une mission importante, vérifier les besoins d’actualisation des deux documents, effectuer les mises à jour autorisées et signaler les documents actualisés. Les inclure dans le même commit que le travail associé lorsque cela est approprié et autorisé. Ne pas mettre à jour la mémoire pour chaque opération mineure, ni déclencher une boucle de mises à jour documentaires ou des commits servant uniquement à rafraîchir les horodatages. Ces mises à jour n’autorisent jamais automatiquement publication, PR, fusion ou déploiement.

Après chaque étape technique importante, mettre à jour ce document dans la branche de travail : date de vérification, état courant, preuves et limites, prochaine action exacte, puis une entrée concise du journal avec référence Git ou PR si disponible. Actualiser le registre lorsqu’une décision est adoptée, remplacée ou abandonnée.

Vérifier les commandes et leurs résultats avant de déclarer une réussite. Distinguer un contrôle local d’un contrôle distant, une configuration d’un service opérationnel, et une tâche planifiée d’une tâche terminée. Si une information devient invérifiable, la marquer à confirmer plutôt que la déduire.

Pour reproduire les contrôles documentaires, vérifier les dix sections du statut, les neuf décisions initiales et leurs champs, ainsi que les cibles des liens relatifs ; relire les deux fichiers pour exclure les données sensibles et rechercher les motifs courants de jetons ou clés privées sans afficher leurs valeurs. Rejouer localement le bloc `run` du workflow existant avec Bash. Examiner `git diff --check`, l’état Git et la liste des fichiers non suivis : `git diff` seul n’inclut pas ces derniers, qui doivent aussi être lus et contrôlés directement. Ces vérifications ne remplacent ni les tests applicatifs futurs ni un contrôle distant GitHub Actions.

Préserver l’historique utile sans copier les conversations. Ne jamais conserver de secrets, jetons, mots de passe ou sorties sensibles. Après un commit ou une PR autorisés, consigner leur référence lors de la prochaine mise à jour ; ne pas inventer le hash du commit contenant ce fichier. La section 8 doit toujours permettre une reprise immédiate et refléter les autorisations encore nécessaires.
