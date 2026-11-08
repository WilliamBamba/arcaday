# Arcaday — mémoire du projet

Dernier audit de reprise et contrôle Git local : **8 novembre 2026 (UTC)**. Les versions d’outils et observations d’authentification datent de l’inspection initiale du même jour ; elles n’ont pas été revérifiées pendant cet audit. Ce document constitue le point d’entrée autonome pour reprendre le projet sans les conversations précédentes. Commencer par la section 8, puis revérifier l’état Git : cet instantané ne remplace pas le dépôt vivant.

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
- Pour la mission documentaire actuelle : conserver la branche existante, ne créer ni commit, ni publication, ni PR avant de nouvelles instructions.

ChatGPT accompagne les décisions et formule les actions ; Codex exécute les opérations autorisées dans le dépôt et en rapporte les résultats. Si l’assistant dispose lui-même des outils nécessaires, il peut les utiliser dans ce périmètre. Sans accès au dépôt, fournir une seule instruction à transmettre à Codex, puis demander son résultat avant de continuer ; ne jamais prétendre avoir vérifié le serveur depuis ce seul document.

Règles permanentes complémentaires : utiliser des branches dédiées et des commits petits et significatifs au format Conventional Commits ; intégrer par PR. Pour un changement important, proposer un plan avant d’implémenter la solution approuvée. Privilégier qualité du gameplay, composants maintenables et performances mobiles. Appliquer le moindre privilège, demander les autorisations natives pour les opérations privilégiées, ne jamais modifier de services serveur sans rapport avec la tâche ni committer de secrets. Respecter licences et vie privée, signaler les exigences Apple/Google Play lors de la préparation mobile et demander une revue des fonctions de monétisation.

L’approbation du contenu documentaire ne vaut pas autorisation de commit, de publication, de création de PR, de fusion ou de déploiement. Ne pas redemander une autorisation déjà explicitement donnée pour l’action concernée ; en l’absence de trace disponible, demander uniquement l’instruction manquante.

Références : [règles des agents](../AGENTS.md), [vision produit](vision.md), [registre des décisions](architecture/decisions.md). Elles complètent ce point d’entrée ; les faits nécessaires à la reprise figurent ci-dessous.

## 2. Présentation du projet

Arcaday est une plateforme de mini-jeux quotidiens sous la marque **NUSINI**. Chaque jeu indépendant propose un défi quotidien identique pour tous, avec des parties courtes et rejouables. Classements, séries et partage des résultats font partie du concept demandé, pas d’une implémentation existante.

L’expérience vise le **mobile-first et portrait-first**, avec une première version **Web/PWA** et une évolution envisagée vers iOS et Android. La direction artistique décrite dans la vision est minimaliste et rétro-arcade ; aucune charte graphique détaillée n’a été trouvée.

- **Daily Impossible** : jeu de plateforme 2D rétro, avec un niveau quotidien et une sortie à atteindre.
- **Daily Crime** : jeu d’enquête dans lequel le joueur doit identifier le coupable.

La collection quotidienne, les deux jeux et les plateformes sont décrits dans `docs/vision.md`. Le portrait-first, les classements, les séries et la sortie à atteindre sont des précisions rapportées dans la mission actuelle.

## 3. Objectifs techniques

Construire progressivement un environnement de Harness Engineering reposant sur Codex CLI, Git et GitHub, les tests automatisés, la CI/CD, la revue de code, des agents spécialisés et des déploiements contrôlés. Privilégier les fonctionnalités natives plutôt qu’un orchestrateur personnalisé.

Cette ambition est validée comme direction par l’utilisateur. Elle ne décrit pas un système déjà complet : seuls le dépôt, ses règles, sa documentation et la configuration d’une CI documentaire sont actuellement vérifiés.

## 4. Environnement technique

| Élément | Observation vérifiée localement |
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

Architecture existante avant cette mission : `README.md`, `AGENTS.md`, `docs/vision.md` et `.github/workflows/ci.yml`. Aucun code applicatif, manifeste de dépendances, moteur de jeu, backend, base de données ou configuration de déploiement n’est présent dans les fichiers suivis inspectés. Les deux documents de mémoire complètent cette structure.

**CI vérifiée dans le fichier**, nommée `Arcaday CI` : déclenchement sur les Pull Requests et les pushes vers `main`, job `documentation` sur `ubuntu-latest`, délai maximal de cinq minutes, permission `contents: read`, `actions/checkout@v7` avec `persist-credentials: false`. Le script vérifie qu’`AGENTS.md` est non vide et comporte les titres Project, Git Workflow, Security et Quality. Il ne valide pas les nouveaux documents ni un jeu. Aucun déploiement automatique n’y est défini.

**À confirmer** : succès des exécutions distantes, protections de branche GitHub, mécanisme utilisé pour la publication précédente, configuration durable de l’authentification et éventuels services hors dépôt. Ne pas lire ou recopier de secrets pour compléter cette mémoire.

## 5. Historique des étapes validées

La numérotation ci-dessous est celle fournie par l’utilisateur ; elle n’est pas déduite du journal Git.

| Étape | Historique rapporté | Preuve disponible aujourd’hui |
| --- | --- | --- |
| 13.3 | Création de branche Git par Codex avec autorisation native | Rapporté ; mécanisme d’autorisation non reconstitué |
| 13.4 | Suppression de la branche temporaire | Rapporté ; aucune preuve spécifique de suppression examinée |
| 13.5 | Création autonome de `docs/vision.md` et commit `c7b272a` | Fichier et commit vérifiés ; autonomie rapportée |
| 13.6 | Vérification du document et du commit | Validation passée rapportée ; contenu et commit réinspectés lors de cette mission |
| 13.7 | Publication de `docs/project-vision` sur GitHub | Publication rapportée ; référence locale `origin/docs/project-vision` au même commit, sans vérification distante actuelle |

Les étapes suivantes sont **en attente**, sans nouvelle numérotation historique : revue des documents de mémoire, autorisation de leur commit, vérification ou création de la PR de cette branche, vérification des contrôles distants. L’historique local contient déjà des commits de fusion pour les PR #1 (fondations) et #2 (CI) ; l’expression « première PR » dans la roadmap ne doit pas faire oublier ces précédents.

## 6. État actuel

### Vérifié

- Branche de travail : `docs/project-vision` ; aucune nouvelle branche créée.
- Dernier commit : `c7b272a3645288d3f617e96c4b7eba41ed35743c`, `docs: add Arcaday project vision`, daté du 8 novembre 2026.
- `main` local pointe sur `3ed43a7` ; il n’a pas été modifié.
- Avant la création de la mémoire : arbre de travail propre. Au début de l’audit de reprise : `docs/project-status.md` et `docs/architecture/decisions.md` existent déjà, non suivis et non committés ; ils ont été préservés. L’audit modifie uniquement `docs/project-status.md`.
- La branche et sa référence de suivi locale pointent sur le même commit. Cela ne prouve pas l’état actuel du serveur.
- Test disponible : validation documentaire d’`AGENTS.md` définie dans la CI. Son script a réussi localement lors de cette mission ; l’exécution GitHub Actions reste à confirmer.
- Aucun test applicatif ni fonctionnalité de jeu opérationnelle n’est démontré par le dépôt.
- À développer dans ce dépôt : les deux jeux, la génération/distribution des défis quotidiens, les classements, les séries, le partage, l’application Web/PWA et les versions mobiles.

### Rapporté

La publication de la branche sur GitHub et les étapes 13.3 à 13.7 sont déclarées validées par l’utilisateur, avec les réserves de preuve précisées ci-dessus.

### À confirmer et problèmes connus

- PR ouvertes : non déterminées. Lors de l’inspection initiale, `gh pr list --repo WilliamBamba/arcaday --state open` a échoué car GitHub CLI demandait une authentification. Cet échec ne prouve pas l’absence de PR ni l’impossibilité de tout autre accès GitHub. Ne pas lancer une nouvelle connexion ni demander un jeton dans la conversation pour achever la revue locale.
- Résultats GitHub Actions et état distant de la branche : non consultés avec succès.
- `codex --version` renvoie sa version mais signale l’impossibilité de créer des alias PATH sur un système de fichiers en lecture seule. Impact sur les autres usages non évalué ; aucune sécurité modifiée.
- Aucun bug applicatif évalué, puisqu’aucune application n’est présente.

## 7. Roadmap

Ces actions restent à réaliser ou à valider, dans cet ordre indicatif :

1. Finaliser et faire relire les deux documents de mémoire ; attendre les instructions avant le commit.
2. Vérifier l’existence d’une PR pour `docs/project-vision`, puis la créer si nécessaire et autorisé. Ne pas dupliquer une PR existante.
3. Vérifier les contrôles GitHub Actions de cette PR.
4. Étudier la sécurisation de l’authentification GitHub pour Codex, avec le minimum de privilèges et sans exposition des secrets.
5. Automatiser progressivement le cycle Git, en conservant les validations humaines de fusion et de déploiement.
6. Définir l’architecture applicative et consigner les choix approuvés dans le registre.
7. Développer le prototype Daily Impossible.
8. Ajouter les agents de test et de revue, ainsi que les tests adaptés.

L’accès GitHub peut devoir être résolu avant les vérifications distantes. Aucun framework, moteur ou orchestrateur personnalisé n’est choisi à ce stade.

## 8. Prochaine action exacte — point de reprise

- **Étape en cours** : finalisation de la mémoire persistante ; rédaction et audit documentaire de reprise effectués, validation utilisateur en attente. L’audit a isolé la lecture du seul statut avant comparaison des références ; ce n’est pas un essai dans une nouvelle conversation réellement vierge.
- **Objectif immédiat** : faire approuver le contenu factuel des deux documents avant toute opération de commit.
- **Déjà effectué** : inspection initiale du dépôt et rédaction des deux fichiers ; audit de lisibilité autonome, comparaison avec les trois références, clarification des rôles et autorisations, contrôle des liens, recherche de secrets et nouvelle exécution locale du script documentaire. Les versions n’ont pas été réévaluées lors de l’audit.
- **Reste à faire** : revue par l’utilisateur, corrections éventuelles et instructions explicites concernant le commit. Aucune publication ou PR autorisée pour cette mission.
- **Prochaine action précise** : remettre le résultat de l’audit à l’utilisateur, puis attendre ses instructions. Pour une nouvelle session, la première action technique est d’exécuter `git -C /home/arcaday/arcaday status --short --branch` (ou de demander à Codex de le faire), puis d’examiner le résultat. Vérifier ensuite le dernier commit avec `git -C /home/arcaday/arcaday log -1 --oneline`. Résultat attendu : branche `docs/project-vision`, commit `c7b272a`, uniquement les deux documents non suivis ; Git peut regrouper `decisions.md` sous `?? docs/architecture/`. Si l’état diffère, préserver les changements et actualiser le diagnostic ; si la branche est `main`, ne rien modifier et signaler l’écart, sans créer de branche automatiquement. Si l’état correspond, vérifier les éventuelles instructions utilisateur reçues depuis cet audit avant toute opération Git d’écriture.
- **Critères de validation** : les deux fichiers existent, distinguent preuves et historique rapporté, indiquent une prochaine action, ne contiennent aucun secret ; aucun autre fichier n’a changé ; aucun commit, push, création de PR ou fusion n’a eu lieu pendant cette mission.
- **Blocages** : instructions utilisateur nécessaires avant le commit ; authentification de `gh` indisponible pour la vérification distante, sans bloquer la rédaction locale.

## 9. Journal de progression

| Date | Action | Résultat | Référence |
| --- | --- | --- | --- |
| Date non fournie | Étapes 13.3 et 13.4 : essai de branche et suppression | Validées selon l’utilisateur ; non vérifiées indépendamment | Aucune référence fournie |
| 2026-11-08 | Fondations et CI documentaire | Commits de fusion présents dans l’historique local | PR #1 : `4c867b6` ; PR #2 : `3ed43a7` |
| 2026-11-08 | Création de la vision | Fichier et commit vérifiés ; étapes 13.5–13.6 rapportées validées | `c7b272a` |
| Date non fournie | Publication de la branche, étape 13.7 | Rapportée ; référence de suivi locale présente | `origin/docs/project-vision` à `c7b272a` |
| 2026-11-08 | Création de la mémoire et inspection locale | Deux documents rédigés ; validation documentaire locale réussie ; revue utilisateur en attente | Non committé, base `c7b272a` |
| 2026-11-08 | Audit de reprise autonome | Lecture isolée du statut puis comparaison des références ; ambiguïtés corrigées ; contrôles locaux réussis ; validation utilisateur toujours en attente | Seul le statut modifié pendant l’audit ; aucun commit |

## 10. Protocole de mise à jour

Après chaque étape technique importante, mettre à jour ce document dans la branche de travail : date de vérification, état courant, preuves et limites, prochaine action exacte, puis une entrée concise du journal avec référence Git ou PR si disponible. Actualiser le registre lorsqu’une décision est adoptée, remplacée ou abandonnée.

Vérifier les commandes et leurs résultats avant de déclarer une réussite. Distinguer un contrôle local d’un contrôle distant, une configuration d’un service opérationnel, et une tâche planifiée d’une tâche terminée. Si une information devient invérifiable, la marquer à confirmer plutôt que la déduire.

Pour reproduire les contrôles documentaires, vérifier les dix sections du statut, les neuf décisions initiales et leurs champs, ainsi que les cibles des liens relatifs ; relire les deux fichiers pour exclure les données sensibles et rechercher les motifs courants de jetons ou clés privées sans afficher leurs valeurs. Rejouer localement le bloc `run` du workflow existant avec Bash. Examiner `git diff --check`, l’état Git et la liste des fichiers non suivis : `git diff` seul n’inclut pas ces derniers, qui doivent aussi être lus et contrôlés directement. Ces vérifications ne remplacent ni les tests applicatifs futurs ni un contrôle distant GitHub Actions.

Préserver l’historique utile sans copier les conversations. Ne jamais conserver de secrets, jetons, mots de passe ou sorties sensibles. Après un commit ou une PR autorisés, consigner leur référence lors de la prochaine mise à jour ; ne pas inventer le hash du commit contenant ce fichier. La section 8 doit toujours permettre une reprise immédiate et refléter les autorisations encore nécessaires.
