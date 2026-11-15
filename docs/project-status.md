# Arcaday — mémoire du projet

Dernière synchronisation de la mémoire : **15 novembre 2026 (Europe/Paris)**, après validation du workflow GitHub App avec la PR #6 et son nettoyage. Ce document permet une reprise autonome ; commencer par la section 8 puis vérifier Git, car cet instantané ne remplace pas le dépôt vivant.

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

Cette ambition est validée comme direction par l’utilisateur. Elle ne décrit pas un système déjà complet : le dépôt, la documentation et le workflow de publication/création de PR via GitHub App sont opérationnels ; l’application et le déclenchement automatique des revues restent à développer ou confirmer.

## 4. Environnement technique

| Élément | Observation et provenance |
| --- | --- |
| Système | Ubuntu 24.04.4 LTS, Noble Numbat ; inspection initiale du 8 novembre, non revérifiée ici |
| Répertoire de travail | `/home/arcaday/arcaday` |
| Utilisateur Linux dédié | `arcaday`, vérifié par `whoami` dans cette conversation ; UID/GID 1001 et groupes issus de l’inspection initiale |
| Accès au projet | Connexion SSH dédiée `hetzner-arcaday`, indiquée par l’utilisateur ; répertoire vérifié dans cette conversation |
| Codex Desktop | Testé avec succès : inspection, fetch et synchronisation Git avec autorisations natives |
| Autres utilisateurs concernés | `william`, administrateur selon l’utilisateur ; génération des jetons via une commande sudo dédiée testée |
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

**GitHub App opérationnelle** : `arcaday-codex-bot`. Git push utilise le credential helper configuré ; les commandes `gh` utilisent un jeton temporaire généré par `sudo -n -u william /usr/local/libexec/arcaday/github-token`, uniquement dans `GH_TOKEN` pour la durée de l’opération. Ce chemin désigne le générateur, pas une clé. Ne jamais afficher ni enregistrer le jeton, activer le traçage shell ou copier une clé privée.

**Séparation des accès** : SSH au VPS, identité d’auteur des commits et identité GitHub sont distincts. Selon l’utilisateur, la clé privée de l’App est protégée et directement inaccessible à l’utilisateur Linux `arcaday` ; ses permissions n’ont pas été auditées dans cette mission et son contenu n’a pas été lu. Les jetons temporaires sont utilisables par les processus autorisés sous `arcaday` : protection de la clé ne signifie pas absence de droits GitHub pour l’agent. Le sandbox et ses autorisations natives restent en place.

**Point de sécurité** : les jetons d’installation disposent de droits d’écriture. Une approbation de PR et une CI réussie ne constituent jamais une instruction de fusion pour Codex : toute fusion, même techniquement possible après approbation, nécessite une autorisation humaine explicite. Ne pas activer de fusion automatique. Les déploiements exigent aussi une validation humaine.

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

### Vérifié dans le dépôt et les opérations de cette conversation

- Base de travail : `main` et `origin/main` à **`a257311f19ea49b73f33f6517183598691ed2a5a`**, après la PR #5 squashée selon l’utilisateur. Hash distant confirmé par `git ls-remote` avant cette mission ; arbre initial propre.
- PR #4 intégrée à `81a9b13`, puis PR #5 à `a257311` : synchronisations locales vérifiées. Les anciennes branches locales sont conservées.
- Test autonome réussi : push de `test/codex-pr-workflow` via le credential helper puis création de la **PR #6** via `gh` avec jeton temporaire. Commit de test : `c20d148715a5711b7ff2f331b40342df167c7ced`. Auteur PR vérifié : `app/arcaday-codex-bot` ; l’acteur du push n’a pas été identifié indépendamment dans les événements disponibles.
- PR #6 fermée **sans fusion** ; événement de fermeture attribué à `arcaday-codex-bot[bot]`. Seule sa branche distante a été supprimée, absence vérifiée ; branche locale conservée. Retour sur `main` alignée et propre vérifié. Le fichier de test n’a pas été intégré à `main`.
- Cette actualisation a été proposée dans la PR #7, depuis `codex/document-harness-results`. Vérifier son état sur GitHub à la reprise ; cette référence historique ne vaut pas instruction de recréer une branche ou une PR.
- Documentation, registre des décisions et CI documentaire présents. Aucun jeu, moteur, backend, stockage ou test applicatif implémenté dans le dépôt.

### Rapporté par l’utilisateur — protections, CI et revues

- **GitHub Actions fonctionnelles** : CI de la PR #6 passée selon l’utilisateur ; workflow local et validations documentaires vérifiés. Aucun résultat distant de CI n’a été réinterrogé pour cette consignation.
- **Protection de `main`** : PR et une approbation obligatoires, révocation des approbations après nouveau commit, Squash and Merge. Le ruleset `Protect main` a aussi été rapporté avec le contrôle **Validate project instructions** obligatoire, branche à jour avant fusion, suppression et force-push interdits. Réglages non audités indépendamment ici.
- **Codex Code Review manuel validé sur la PR #5**, selon l’utilisateur. L’activation pour toutes les PR et à chaque push avait été rapportée ; le **déclenchement automatique reste à confirmer**. Ne pas assimiler revue manuelle réussie et automatisation vérifiée.

### État de l’automatisation

**Validé dans ce workflow** : création de branches, modifications, commits, contrôles documentaires locaux, synchronisation Git et publication avec autorisations natives ; création et fermeture de PR avec l’identité de l’App. La PR #6 valide la publication et la création de PR autonomes depuis Codex Desktop dans le périmètre autorisé, sans identifiants personnels de William affichés.

**À confirmer ou développer** : déclenchement automatique de Codex Code Review, tests applicatifs, déploiement. Les fusions restent sous contrôle humain explicite ; la permission d’écriture d’un jeton ne vaut pas autorisation d’intégration.

### Limites et continuité

- Protection de la clé privée et réglages GitHub rapportés, non réaudités ici ; aucune garantie nouvelle sur leur isolation n’est déduite du seul succès du test.
- Le test de reprise ChatGPT figurait dans une roadmap antérieure ; son résultat n’est pas vérifié indépendamment ici. La nouvelle priorité utilisateur est **Daily Impossible**.
- Le registre architectural conserve ses observations initiales sur l’authentification ; le présent statut décrit les résultats opérationnels plus récents. Une mise à jour ciblée des ADR-002/006 pourra être proposée séparément pour formaliser le mécanisme retenu, sans présumer que le service de publication isolé envisagé lors de l’audit a été implémenté.

## 7. Roadmap

1. **Daily Impossible : prochaine priorité de développement.** Cadrer un premier prototype jouable de plateforme 2D, mobile-first et portrait-first, avec une sortie à atteindre ; proposer une architecture minimale et des critères de validation avant l’implémentation.
2. Après validation du cadrage, développer le prototype sur une branche dédiée avec tests adaptés au gameplay et aux performances mobiles.
3. Confirmer le déclenchement automatique de Codex Code Review sur une prochaine PR autorisée, sans bloquer le cadrage du jeu ni confondre revue et CI.
4. Étendre progressivement les tests et les déploiements contrôlés ; Daily Crime reste une étape ultérieure.

Aucun framework ni moteur n’est encore choisi. Le workflow GitHub App validé peut être réutilisé dans les limites de chaque mission ; aucune fusion ou livraison automatique n’est autorisée.

## 8. Prochaine action exacte — point de reprise

- **Priorité** : préparer le cadrage de Daily Impossible, pas recommencer le test GitHub App terminé.
- **Action à proposer** : définir le périmètre du prototype, les commandes tactiles, la boucle de jeu, les critères de réussite et une proposition de stack minimale ; faire valider les choix significatifs avant développement. Le niveau quotidien reste un objectif produit à préciser, pas une fonctionnalité existante.
- **À la reprise** : vérifier l’état du dépôt et des travaux déjà intégrés avant de proposer le cadrage. Ne pas recréer les commits ou PR documentaires existants ; les autorisations d’une mission passée ne s’étendent pas aux nouvelles opérations.
- **Méthode** : lire `AGENTS.md`, vérifier branche et état Git, préserver les changements non committés, travailler sur branche dédiée et présenter les validations. Utiliser le helper existant pour Git et un jeton temporaire pour `gh`, jamais de secret dans les documents ou sorties.
- **Sécurité** : une approbation GitHub, des contrôles verts ou les droits d’écriture de l’App ne dispensent jamais d’obtenir l’autorisation explicite de fusion. Garder le sandbox et ses autorisations natives. Ne pas réouvrir ni fusionner la PR #6 de test.

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
| 2026-11-15 (Europe/Paris) | PR #5 et synchronisation | Fusion squash rapportée ; main synchronisée et propre vérifiée ; revue Codex manuelle validée selon l’utilisateur | `a257311` |
| 2026-11-15 (Europe/Paris) | Test GitHub App | Push et création autonome de PR vérifiés ; auteur App confirmé ; succès CI rapporté | PR #6, `c20d148` |
| 2026-11-15 (Europe/Paris) | Nettoyage du test | PR #6 fermée sans fusion par le bot, branche distante supprimée ; branche locale conservée | Retour sur main à `a257311` |
| 2026-11-15 (Europe/Paris) | Actualisation des résultats du Harness Engineering | Protections et limites consignées ; Daily Impossible devient la priorité de développement | `codex/document-harness-results` |

## 10. Protocole de mise à jour

La section `Project Memory & Continuity` d’`AGENTS.md` impose désormais cette maintenance. Avant de terminer une mission importante, vérifier les besoins d’actualisation des deux documents, effectuer les mises à jour autorisées et signaler les documents actualisés. Les inclure dans le même commit que le travail associé lorsque cela est approprié et autorisé. Ne pas mettre à jour la mémoire pour chaque opération mineure, ni déclencher une boucle de mises à jour documentaires ou des commits servant uniquement à rafraîchir les horodatages. Ces mises à jour n’autorisent jamais automatiquement publication, PR, fusion ou déploiement.

Après chaque étape technique importante, mettre à jour ce document dans la branche de travail : date de vérification, état courant, preuves et limites, prochaine action exacte, puis une entrée concise du journal avec référence Git ou PR si disponible. Actualiser le registre lorsqu’une décision est adoptée, remplacée ou abandonnée.

Vérifier les commandes et leurs résultats avant de déclarer une réussite. Distinguer un contrôle local d’un contrôle distant, une configuration d’un service opérationnel, et une tâche planifiée d’une tâche terminée. Si une information devient invérifiable, la marquer à confirmer plutôt que la déduire.

Pour reproduire les contrôles documentaires, vérifier les dix sections du statut, les neuf décisions initiales et leurs champs, ainsi que les cibles des liens relatifs ; relire les deux fichiers pour exclure les données sensibles et rechercher les motifs courants de jetons ou clés privées sans afficher leurs valeurs. Rejouer localement le bloc `run` du workflow existant avec Bash. Examiner `git diff --check`, l’état Git et la liste des fichiers non suivis : `git diff` seul n’inclut pas ces derniers, qui doivent aussi être lus et contrôlés directement. Ces vérifications ne remplacent ni les tests applicatifs futurs ni un contrôle distant GitHub Actions.

Préserver l’historique utile sans copier les conversations. Ne jamais conserver de secrets, jetons, mots de passe ou sorties sensibles. Après un commit ou une PR autorisés, consigner leur référence lors de la prochaine mise à jour ; ne pas inventer le hash du commit contenant ce fichier. La section 8 doit toujours permettre une reprise immédiate et refléter les autorisations encore nécessaires.
