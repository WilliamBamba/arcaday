# Arcaday — mémoire du projet

Dernière synchronisation de la mémoire et contrôle Git local avant le commit de maintenance : **8 novembre 2026 (UTC)**. Les versions d’outils et observations d’authentification datent de l’inspection initiale du même jour ; elles n’ont pas été revérifiées pendant cette synchronisation. Ce document constitue le point d’entrée autonome pour reprendre le projet sans les conversations précédentes. Commencer par la section 8, puis revérifier l’état Git : cet instantané ne remplace pas le dépôt vivant.

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
- Pour la mission actuelle : conserver `docs/project-vision`. L’utilisateur a autorisé le commit `docs: establish automatic project memory maintenance`, limité à `AGENTS.md` et `docs/project-status.md`. Publication, PR et fusion restent interdites pendant cette mission.

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

La documentation de reprise a été validée par l’utilisateur et les deux documents ont été créés par le commit `ea2306f`, vérifié localement. La section `Project Memory & Continuity` ajoutée à `AGENTS.md` a également été validée par l’utilisateur. Restent à effectuer, sans nouvelle numérotation historique : finalisation du commit de maintenance autorisé, publication des nouveaux commits, vérification ou création de la PR de cette branche et vérification des contrôles distants. L’historique local contient déjà des commits de fusion pour les PR #1 (fondations) et #2 (CI) ; l’expression « première PR » dans la roadmap ne doit pas faire oublier ces précédents.

## 6. État actuel

### Vérifié

- Branche de travail : `docs/project-vision` ; aucune nouvelle branche créée.
- Dernier commit vérifié avant le commit de maintenance contenant cette mise à jour : `ea2306ffc430bfe881b73222eb86835a699b8dbb`, `docs: add persistent project memory and architecture decisions`. Il a créé uniquement `docs/project-status.md` et `docs/architecture/decisions.md`. À la reprise, consulter Git pour connaître le dernier commit effectif ; le hash du commit en préparation n’est pas anticipé.
- `main` local pointe sur `3ed43a7` ; il n’a pas été modifié.
- Au début de cette mission, seule la modification validée d’`AGENTS.md` était non committée ; elle est préservée. Cette synchronisation modifie uniquement `docs/project-status.md`. Ces deux fichiers constituent le périmètre du commit autorisé ; `decisions.md` reste inchangé.
- Avant ce commit, la branche est en avance d’un commit sur sa référence de suivi locale, restée à `c7b272a`. Après réussite du commit prévu, l’avance attendue sera de deux commits ; ce résultat devra être vérifié. Aucune consultation distante ne confirme l’état actuel du serveur.
- La section `Project Memory & Continuity` figure dans `AGENTS.md` : la maintenance de la mémoire fait désormais partie des instructions permanentes de Codex. La règle est documentée et cette synchronisation est explicitement demandée ; son application automatique lors des futures missions reste à vérifier. Aucun mécanisme d’exécution automatique supplémentaire n’a été installé.
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

1. Finaliser le commit de maintenance documentaire autorisé, limité à `AGENTS.md` et `docs/project-status.md`.
2. Publier les nouveaux commits de `docs/project-vision` après autorisation ; la publication historique de la vision ne couvre pas ces changements locaux.
3. Créer ou vérifier la première PR de cette branche vers `main`, après autorisation. Ne pas dupliquer une PR existante ; les PR #1 et #2 appartiennent déjà à l’historique du dépôt.
4. Vérifier les contrôles GitHub Actions de cette PR.
5. Tester la reprise dans un nouveau chat ChatGPT avec ce document seul, puis vérifier le diagnostic contre le dépôt. Ce test reste à réaliser.
6. Étudier la sécurisation de l’authentification GitHub pour Codex, avec le minimum de privilèges et sans exposition des secrets.
7. Automatiser progressivement le cycle Git, en conservant les validations humaines de fusion et de déploiement.
8. Définir l’architecture applicative et consigner les choix approuvés dans le registre.
9. Développer le prototype Daily Impossible.
10. Ajouter les agents de test et de revue, ainsi que les tests adaptés.

L’accès GitHub peut devoir être résolu avant les vérifications distantes. Aucun framework, moteur ou orchestrateur personnalisé n’est choisi à ce stade.

## 8. Prochaine action exacte — point de reprise

- **Étape en cours** : finalisation du commit de maintenance documentaire, explicitement autorisé par l’utilisateur. Cet instantané est rédigé avant sa création ; il ne déclare pas à l’avance sa réussite.
- **Objectif immédiat** : enregistrer ensemble les instructions permanentes validées et leur état synchronisé, avec le message `docs: establish automatic project memory maintenance`.
- **Déjà effectué** : documentation de reprise validée et committée dans `ea2306f` ; section `Project Memory & Continuity` ajoutée à `AGENTS.md` et validée ; statut synchronisé. La règle de maintenance est documentée, mais son application spontanée lors des prochaines missions reste à vérifier. L’audit précédent n’était pas un test dans un chat réellement vierge.
- **Prochaine action précise** : contrôler les modifications et les validations locales, indexer uniquement `AGENTS.md` et `docs/project-status.md`, examiner `git diff --cached`, exécuter `git diff --cached --check`, puis créer le commit autorisé et vérifier le dernier commit et l’état Git.
- **À la reprise** : exécuter d’abord `git -C /home/arcaday/arcaday status --short --branch`, examiner le résultat, puis `git -C /home/arcaday/arcaday log -1 --oneline`. Si le commit de maintenance est déjà présent, vérifier son contenu et ne pas le recréer. S’il manque, vérifier le périmètre des changements avant de reprendre sa préparation. Préserver tout changement inattendu ; ne rien modifier si la branche est `main` et signaler l’écart sans changer de branche automatiquement.
- **Suite prévue après le commit** : publier `docs/project-vision`, créer ou vérifier sa première Pull Request vers `main`, vérifier les contrôles GitHub Actions, puis tester la reprise dans un nouveau chat ChatGPT. Publication et création de PR nécessitent de nouvelles instructions : elles ne sont pas autorisées dans cette mission.
- **Critères de validation du commit** : message exact, uniquement les deux fichiers autorisés, contrôles locaux réussis, arbre de travail propre après commit, branche conservée, aucun secret introduit ; aucune publication, PR, fusion ou modification de `decisions.md` ou de `main`.
- **Blocages** : aucun blocage local connu pour la préparation ; utiliser les autorisations natives si Git nécessite des droits supplémentaires. L’authentification distante reste à confirmer avant les étapes GitHub. Le test en nouveau chat et l’application automatique de la règle de maintenance ne sont pas encore validés.

## 9. Journal de progression

| Date | Action | Résultat | Référence |
| --- | --- | --- | --- |
| Date non fournie | Étapes 13.3 et 13.4 : essai de branche et suppression | Validées selon l’utilisateur ; non vérifiées indépendamment | Aucune référence fournie |
| 2026-11-08 | Fondations et CI documentaire | Commits de fusion présents dans l’historique local | PR #1 : `4c867b6` ; PR #2 : `3ed43a7` |
| 2026-11-08 | Création de la vision | Fichier et commit vérifiés ; étapes 13.5–13.6 rapportées validées | `c7b272a` |
| Date non fournie | Publication de la branche, étape 13.7 | Rapportée ; référence de suivi locale présente | `origin/docs/project-vision` à `c7b272a` |
| 2026-11-08 | Création de la mémoire et inspection locale | Deux documents rédigés ; validation documentaire locale réussie ; revue utilisateur en attente | Non committé, base `c7b272a` |
| 2026-11-08 | Audit de reprise autonome | Lecture isolée du statut puis comparaison des références ; ambiguïtés corrigées ; contrôles locaux réussis ; validation utilisateur toujours en attente | Seul le statut modifié pendant l’audit ; aucun commit |
| 2026-11-08 | Validation utilisateur et commit de la mémoire | Deux documents créés, contenu du commit vérifié ; aucune publication effectuée | `ea2306f` |
| 2026-11-08 | Instructions permanentes de maintenance | Section `Project Memory & Continuity` ajoutée et validée ; statut synchronisé ; commit autorisé en préparation, application automatique future à vérifier | Base `ea2306f` ; hash à consulter après création du commit |

## 10. Protocole de mise à jour

La section `Project Memory & Continuity` d’`AGENTS.md` impose désormais cette maintenance. Avant de terminer une mission importante, vérifier les besoins d’actualisation des deux documents, effectuer les mises à jour autorisées et signaler les documents actualisés. Les inclure dans le même commit que le travail associé lorsque cela est approprié et autorisé. Ne pas mettre à jour la mémoire pour chaque opération mineure, ni déclencher une boucle de mises à jour documentaires ou des commits servant uniquement à rafraîchir les horodatages. Ces mises à jour n’autorisent jamais automatiquement publication, PR, fusion ou déploiement.

Après chaque étape technique importante, mettre à jour ce document dans la branche de travail : date de vérification, état courant, preuves et limites, prochaine action exacte, puis une entrée concise du journal avec référence Git ou PR si disponible. Actualiser le registre lorsqu’une décision est adoptée, remplacée ou abandonnée.

Vérifier les commandes et leurs résultats avant de déclarer une réussite. Distinguer un contrôle local d’un contrôle distant, une configuration d’un service opérationnel, et une tâche planifiée d’une tâche terminée. Si une information devient invérifiable, la marquer à confirmer plutôt que la déduire.

Pour reproduire les contrôles documentaires, vérifier les dix sections du statut, les neuf décisions initiales et leurs champs, ainsi que les cibles des liens relatifs ; relire les deux fichiers pour exclure les données sensibles et rechercher les motifs courants de jetons ou clés privées sans afficher leurs valeurs. Rejouer localement le bloc `run` du workflow existant avec Bash. Examiner `git diff --check`, l’état Git et la liste des fichiers non suivis : `git diff` seul n’inclut pas ces derniers, qui doivent aussi être lus et contrôlés directement. Ces vérifications ne remplacent ni les tests applicatifs futurs ni un contrôle distant GitHub Actions.

Préserver l’historique utile sans copier les conversations. Ne jamais conserver de secrets, jetons, mots de passe ou sorties sensibles. Après un commit ou une PR autorisés, consigner leur référence lors de la prochaine mise à jour ; ne pas inventer le hash du commit contenant ce fichier. La section 8 doit toujours permettre une reprise immédiate et refléter les autorisations encore nécessaires.
