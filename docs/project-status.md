# Arcaday — mémoire du projet

Dernière synchronisation de la mémoire après la revue locale de la PR #3, pendant la correction de ses remarques mineures : **8 novembre 2026 (UTC)**. Les versions d’outils et observations d’authentification datent de l’inspection initiale du même jour ; elles n’ont pas été revérifiées pendant cette synchronisation. Ce document constitue le point d’entrée autonome pour reprendre le projet sans les conversations précédentes. Commencer par la section 8, puis revérifier l’état Git : cet instantané ne remplace pas le dépôt vivant.

Les mentions **Vérifié** désignent une observation du dépôt ou de l’environnement ; **Rapporté** désigne les informations fournies par l’utilisateur ; **À confirmer** désigne une information non établie. Une intention produit n’est pas une fonctionnalité opérationnelle.

## 1. Instructions de reprise pour ChatGPT

Tu es l’architecte technique accompagnant le développement d’Arcaday. Le projet est développé principalement avec Codex CLI. L’utilisateur privilégie le Harness Engineering et souhaite minimiser les interventions manuelles.

- Travailler étape par étape, avec une seule action concrète à la fois.
- Expliquer brièvement les actions avant de les proposer.
- Privilégier Codex pour les opérations qu’il peut réaliser en sécurité.
- Demander les résultats des commandes avant de poursuivre lorsqu’elles sont confiées à l’utilisateur ; lorsque Codex les exécute, examiner ses résultats avant l’action dépendante.
- Ne pas recommencer les étapes déjà validées ; vérifier uniquement ce qui peut avoir changé.
- Ne pas installer de nouveaux outils sans justification.
- Ne jamais désactiver les mécanismes de sécurité pour simplifier une opération ; conserver le sandbox et utiliser les autorisations natives.
- Préserver et signaler les modifications non committées. Ne jamais développer directement sur `main`.
- Ne jamais fusionner dans `main` sans autorisation explicite ; tout déploiement requiert également une approbation humaine.
- Pour la mission de correction de la revue de la PR #3 : conserver `docs/project-vision` et modifier uniquement `docs/architecture/decisions.md`, `docs/vision.md` et `docs/project-status.md`. Ne pas modifier `AGENTS.md` ni aucun autre fichier. Aucun commit, publication, création de PR ou fusion n’est autorisé ; attendre l’autorisation de l’utilisateur avant le commit.

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

| Élément | Observation de l’inspection initiale du 8 novembre 2026, non revérifiée ici |
| --- | --- |
| Système | Ubuntu 24.04.4 LTS, Noble Numbat |
| Répertoire de travail | `/home/arcaday/arcaday` |
| Utilisateur Linux de la session | `arcaday`, UID/GID 1001, shell `/bin/bash`, groupes `arcaday` et `nogroup` |
| Autres utilisateurs concernés | À confirmer ; aucun rôle d’administration supplémentaire établi |
| Dépôt GitHub configuré | `WilliamBamba/arcaday` |
| Remote `origin` | `https://github.com/WilliamBamba/arcaday.git` pour lecture et publication |
| Codex CLI | `0.153.4` |
| Git / GitHub CLI | `2.43.0` / `2.45.0` |
| Node.js / npm | `v20.20.1` / `10.8.2` ; présence des outils, pas choix de stack applicative |
| Python | `3.12.3` ; aucun usage applicatif établi |
| Configuration Git | Dépôt non bare ; identité `WilliamBamba`, adresse GitHub noreply configurée ; suivi de `origin/docs/project-vision` |

Structure présente avant la création de la mémoire : `README.md`, `AGENTS.md`, `docs/vision.md` et `.github/workflows/ci.yml`. Aucun code applicatif, manifeste de dépendances, moteur de jeu, backend, base de données ou configuration de déploiement n’est présent dans les fichiers suivis inspectés. Les deux documents de mémoire complètent cette structure.

**CI vérifiée dans le fichier**, nommée `Arcaday CI` : déclenchement sur les Pull Requests et les pushes vers `main`, job `documentation` sur `ubuntu-latest`, délai maximal de cinq minutes, permission `contents: read`, `actions/checkout@v7` avec `persist-credentials: false`. Le script vérifie qu’`AGENTS.md` est non vide et comporte les titres Project, Git Workflow, Security et Quality. Il ne valide pas les nouveaux documents ni un jeu. Aucun déploiement automatique n’y est défini.

**À confirmer indépendamment** : état distant actuel de la PR et de la CI après les futures corrections, protections de branche GitHub, mécanisme utilisé pour la publication précédente, configuration durable de l’authentification et éventuels services hors dépôt. Le succès CI rapporté par l’utilisateur est consigné en section 6. Ne pas lire ou recopier de secrets pour compléter cette mémoire.

## 5. Historique des étapes validées

La numérotation ci-dessous est celle fournie par l’utilisateur ; elle n’est pas déduite du journal Git.

| Étape | Historique rapporté | Preuve disponible aujourd’hui |
| --- | --- | --- |
| 13.3 | Création de branche Git par Codex avec autorisation native | Rapporté ; mécanisme d’autorisation non reconstitué |
| 13.4 | Suppression de la branche temporaire | Rapporté ; aucune preuve spécifique de suppression examinée |
| 13.5 | Création autonome de `docs/vision.md` et commit `c7b272a` | Fichier et commit vérifiés ; autonomie rapportée |
| 13.6 | Vérification du document et du commit | Validation passée rapportée ; contenu et commit réinspectés lors de cette mission |
| 13.7 | Publication de `docs/project-vision` sur GitHub | Publication rapportée ; référence de suivi à `c7b272a` lors de l’inspection initiale, désormais à `e662714` ; sans vérification distante actuelle |

La création des documents de mémoire dans `ea2306f` et la maintenance via `AGENTS.md` dans `e662714` sont vérifiées dans l’historique local. Leur validation utilisateur a été rapportée lors des missions précédentes. La publication de `docs/project-vision` et l’existence de la PR #3 sont rapportées par l’utilisateur ; la référence locale de suivi pointe désormais sur `e662714`. L’historique local contient aussi les fusions des PR #1 (fondations) et #2 (CI) : la PR #3 est la première PR de cette branche, pas du dépôt.

## 6. État actuel

### Vérifié localement

- Branche conservée : `docs/project-vision`. Dernier commit : `e662714`, `docs: establish automatic project memory maintenance` ; il modifie uniquement `AGENTS.md` et `docs/project-status.md`.
- Le commit `ea2306f`, `docs: add persistent project memory and architecture decisions`, crée les deux documents de mémoire.
- `main` local pointe sur `3ed43a7`. La référence locale `origin/docs/project-vision` pointe sur `e662714`, sans avance ni retard local ; cela ne constitue pas une interrogation actuelle de GitHub.
- L’arbre de travail était propre au début de la correction. Les modifications de cette mission sont limitées aux trois documents autorisés, non committées ; `AGENTS.md` reste inchangé.
- Revue locale Codex terminée : comparaison complète de `main` à `e662714`, trois commits et quatre fichiers examinés. Aucun problème bloquant ni important identifié ; recommandation **COMMENT**.
- Trois remarques mineures ont été identifiées : restriction temporaire de commit dans ADR-003, point de reprise devenu ancien, formulation divergente sur iOS/Android. Leur correction constitue la mission en cours ; les modifications sont préparées localement, sans commit ni publication.
- La section `Project Memory & Continuity` d’`AGENTS.md` impose la maintenance de la mémoire. Aucun mécanisme d’exécution automatique supplémentaire n’a été installé ; son application spontanée lors de futures missions reste à évaluer.
- Pendant la revue locale, le script documentaire de la CI et `git diff --check` ont réussi, les six liens relatifs étaient valides et aucun secret n’a été identifié par lecture et recherche de motifs courants. Les contrôles ont également réussi sur les corrections : script CI local, `git diff --check`, dix sections du statut, neuf ADR complets, six liens relatifs valides et périmètre limité aux trois fichiers autorisés. La relecture des quatre documents n’a pas révélé de contradiction restante ; aucun secret détecté par lecture et recherche de motifs courants, sans garantie exhaustive.
- Aucun code applicatif ni test applicatif n’est présent. Restent à développer les jeux, les défis quotidiens, classements, séries, partage et Web/PWA ; l’implémentation iOS/Android reste à décider.

### Rapporté par l’utilisateur — GitHub distant

- `docs/project-vision` a été publiée sur GitHub ; la PR **#3** existe vers `main`.
- Selon le résultat de `gh` rapporté par l’utilisateur : PR #3 **OPEN**, **MERGEABLE**, **CLEAN** ; contrôle GitHub Actions **Validate project instructions : SUCCESS**.
- Ces résultats distants n’ont pas été revérifiés par Codex pendant la revue ou cette correction locale. Ils précèdent la publication des corrections et ne prouvent pas leur validation par GitHub Actions. Ils ne constituent pas une autorisation de fusion.

### À confirmer et limites

- Revérifier la PR #3 et ses contrôles après publication du futur commit de correction.
- Lors de l’inspection initiale, `gh pr list` demandait une authentification. Cet ancien échec ne contredit pas le résultat ultérieur rapporté par l’utilisateur ; la configuration d’authentification de la session Codex reste à confirmer avant les opérations distantes. Ne pas demander ni recopier de jeton dans la conversation.
- L’inspection initiale de `codex --version` signalait l’impossibilité de créer des alias PATH sur un système de fichiers en lecture seule. Situation non revérifiée ; aucune sécurité modifiée.
- Le test de reprise dans un nouveau chat reste à effectuer après la fusion autorisée. Aucun bug applicatif évalué puisqu’aucune application n’est présente.

## 7. Roadmap

Ces actions restent à réaliser ou à valider, dans cet ordre indicatif :

1. Vérifier les corrections documentaires des trois remarques mineures et présenter les résultats à l’utilisateur.
2. Après autorisation de l’utilisateur, créer un commit de correction limité aux trois documents autorisés.
3. Publier la branche après autorisation, puis revérifier la PR #3 existante et les contrôles GitHub Actions sur le nouveau commit. Ne pas créer de nouvelle PR.
4. Procéder à la fusion uniquement après validation explicite de l’utilisateur et vérification des contrôles.
5. Tester ensuite la reprise dans un nouveau chat ChatGPT avec ce document seul, puis comparer le diagnostic au dépôt.
6. Étudier la sécurisation de l’authentification GitHub pour Codex, avec le minimum de privilèges et sans exposition des secrets.
7. Automatiser progressivement le cycle Git, en conservant les validations humaines de fusion et de déploiement.
8. Définir l’architecture applicative et consigner les choix approuvés dans le registre.
9. Développer le prototype Daily Impossible.
10. Ajouter les agents de test et de revue, ainsi que les tests adaptés.

Aucun framework, moteur ou orchestrateur personnalisé n’est choisi à ce stade.

## 8. Prochaine action exacte — point de reprise

- **Étape en cours** : correction locale des trois remarques mineures de la revue de la PR #3. Les modifications documentaires sont préparées et les contrôles locaux ont réussi ; leur commit et leur publication ne sont pas réalisés.
- **Déjà effectué** : commits `ea2306f` et `e662714` vérifiés localement ; revue locale Codex effectuée, sans problème bloquant ni important. Publication de la branche, existence de la PR #3 et succès CI rapportés par l’utilisateur, avec les limites de la section 6.
- **Prochaine action précise** : faire valider les corrections documentaires par l’utilisateur et attendre son autorisation explicite avant toute création de commit. La cohérence avec `AGENTS.md`, les liens, la recherche de secrets et `git diff --check` ont été contrôlés localement. À la reprise, vérifier si le diff a changé avant de préparer le commit autorisé.
- **À la reprise** : examiner `git -C /home/arcaday/arcaday status --short --branch`, puis `git -C /home/arcaday/arcaday log -1 --oneline` et le diff. Préserver les corrections non committées ; ne pas recréer les commits déjà présents. Si le commit de correction existe déjà, examiner son contenu avant de déterminer la suite. Signaler toute branche ou modification inattendue sans changer de branche automatiquement.
- **Suite prévue, non réalisée** : après autorisation, créer le commit de correction, publier la branche après autorisation, vérifier de nouveau la PR #3 et la CI, puis fusionner uniquement après validation explicite de l’utilisateur. Tester ensuite la reprise dans un nouveau chat. Aucune nouvelle PR n’est nécessaire.
- **Périmètre du futur commit** : uniquement `docs/architecture/decisions.md`, `docs/vision.md` et `docs/project-status.md`, avec un message Conventional Commits et des contrôles locaux réussis. `AGENTS.md` reste inchangé.
- **Autorisations en attente** : commit, publication et fusion ne sont pas autorisés par la mission de correction. Aucun résultat distant ancien ne dispense de revérifier les contrôles ni d’obtenir la validation humaine de fusion.

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

## 10. Protocole de mise à jour

La section `Project Memory & Continuity` d’`AGENTS.md` impose désormais cette maintenance. Avant de terminer une mission importante, vérifier les besoins d’actualisation des deux documents, effectuer les mises à jour autorisées et signaler les documents actualisés. Les inclure dans le même commit que le travail associé lorsque cela est approprié et autorisé. Ne pas mettre à jour la mémoire pour chaque opération mineure, ni déclencher une boucle de mises à jour documentaires ou des commits servant uniquement à rafraîchir les horodatages. Ces mises à jour n’autorisent jamais automatiquement publication, PR, fusion ou déploiement.

Après chaque étape technique importante, mettre à jour ce document dans la branche de travail : date de vérification, état courant, preuves et limites, prochaine action exacte, puis une entrée concise du journal avec référence Git ou PR si disponible. Actualiser le registre lorsqu’une décision est adoptée, remplacée ou abandonnée.

Vérifier les commandes et leurs résultats avant de déclarer une réussite. Distinguer un contrôle local d’un contrôle distant, une configuration d’un service opérationnel, et une tâche planifiée d’une tâche terminée. Si une information devient invérifiable, la marquer à confirmer plutôt que la déduire.

Pour reproduire les contrôles documentaires, vérifier les dix sections du statut, les neuf décisions initiales et leurs champs, ainsi que les cibles des liens relatifs ; relire les deux fichiers pour exclure les données sensibles et rechercher les motifs courants de jetons ou clés privées sans afficher leurs valeurs. Rejouer localement le bloc `run` du workflow existant avec Bash. Examiner `git diff --check`, l’état Git et la liste des fichiers non suivis : `git diff` seul n’inclut pas ces derniers, qui doivent aussi être lus et contrôlés directement. Ces vérifications ne remplacent ni les tests applicatifs futurs ni un contrôle distant GitHub Actions.

Préserver l’historique utile sans copier les conversations. Ne jamais conserver de secrets, jetons, mots de passe ou sorties sensibles. Après un commit ou une PR autorisés, consigner leur référence lors de la prochaine mise à jour ; ne pas inventer le hash du commit contenant ce fichier. La section 8 doit toujours permettre une reprise immédiate et refléter les autorisations encore nécessaires.
