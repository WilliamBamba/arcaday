# Arcaday — registre des décisions architecturales

Registre initial établi le **8 novembre 2026** à partir d’[AGENTS.md](../../AGENTS.md), de la [vision](../vision.md) et des instructions explicites de l’utilisateur pour la mémoire persistante. Voir l’[état du projet](../project-status.md) pour les preuves d’implémentation et la prochaine action.

**Validée** signifie règle ou direction explicitement retenue, pas implémentation terminée. Les dates d’adoption initiale ne sont pas connues ; la date de consignation n’est pas une date historique inventée. Les choix techniques non tranchés sont regroupés à la fin.

## ADR-001 — Codex CLI comme outil principal

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée par les instructions utilisateur.
- **Contexte** : développement assisté par IA et réduction des interventions manuelles.
- **Décision** : utiliser principalement Codex CLI pour les opérations qu’il peut réaliser en sécurité.
- **Justification** : intégrer l’assistance au travail sur le dépôt et progresser vers le Harness Engineering.
- **Conséquences** : expliciter les consignes et vérifier les résultats ; conserver une mémoire autonome. La présence de Codex CLI est vérifiée, pas l’automatisation complète du développement.

## ADR-002 — GitHub pour le code et les Pull Requests

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée ; remote et historique de PR vérifiés localement.
- **Contexte** : besoin de versionner, revoir et intégrer les changements.
- **Décision** : utiliser Git et le dépôt GitHub `WilliamBamba/arcaday`, avec intégration par Pull Request.
- **Justification** : conserver un historique traçable et utiliser la revue et les contrôles natifs.
- **Conséquences** : vérifier les PR et leurs contrôles avant intégration. L’authentification de `gh` et les protections distantes restent à confirmer.

## ADR-003 — Branches dédiées

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée dans `AGENTS.md`.
- **Contexte** : préserver `main` pendant le développement.
- **Décision** : travailler sur une branche dédiée à chaque tâche, jamais directement sur `main` ; utiliser des commits petits et significatifs au format Conventional Commits.
- **Justification** : rendre les changements isolables et faciles à revoir.
- **Conséquences** : inspecter branche et état Git avant toute modification. Respecter le périmètre autorisé et les autorisations natives de Codex (ADR-005) ; toute fusion dans `main` requiert une validation humaine explicite (ADR-004).

## ADR-004 — Validation humaine des fusions et déploiements

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée dans `AGENTS.md` et réaffirmée par l’utilisateur.
- **Contexte** : l’autonomie de l’assistant ne vaut pas autorisation d’intégration ou de mise en production.
- **Décision** : ne jamais fusionner dans `main` ni déployer sans approbation humaine ; autorisation explicite requise pour la fusion.
- **Justification** : garder le contrôle humain sur les changements intégrés et livrés.
- **Conséquences** : préparer les résultats vérifiables avant approbation. Aucune protection GitHub ni chaîne de déploiement n’est présumée configurée.

## ADR-005 — Sandbox et autorisations natives de Codex

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée par les instructions utilisateur, cohérente avec `AGENTS.md`.
- **Contexte** : certaines opérations nécessitent des droits dépassant le périmètre courant.
- **Décision** : conserver le sandbox et utiliser les autorisations natives ; ne jamais désactiver un mécanisme de sécurité pour simplifier une opération.
- **Justification** : respecter les restrictions et appliquer le moindre privilège.
- **Conséquences** : demander l’autorisation adaptée aux opérations privilégiées et signaler les blocages sans contournement. L’essai historique 13.3 est rapporté, pas une preuve des permissions actuelles.

## ADR-006 — Protection des secrets vis-à-vis des agents

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée par l’utilisateur et les règles de sécurité d’`AGENTS.md`.
- **Contexte** : les opérations GitHub peuvent nécessiter une authentification.
- **Décision** : ne jamais committer de secrets ni les exposer dans les documents ou les sorties destinées aux agents ; limiter les accès au strict nécessaire.
- **Justification** : éviter la divulgation de moyens d’accès et de données sensibles.
- **Conséquences** : étudier une authentification adaptée sans copier de jeton dans la mémoire. Le mécanisme concret de gestion des identifiants reste à définir ; aucun coffre ou dispositif particulier n’est déclaré installé.

## ADR-007 — Préférence pour les capacités natives

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée comme orientation par l’utilisateur.
- **Contexte** : ambition d’automatiser progressivement tests, revue, cycle Git et déploiements contrôlés.
- **Décision** : privilégier Codex, Git/GitHub et leurs capacités natives plutôt que développer un orchestrateur personnalisé.
- **Justification** : limiter la complexité et la maintenance.
- **Conséquences** : justifier tout nouvel outil ; ajouter progressivement les agents spécialisés et contrôles utiles. Leur organisation n’est pas encore définie.

## ADR-008 — Web/PWA, mobile-first et portrait-first

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée comme direction produit ; Web/PWA et mobile-first documentés dans la vision, portrait-first précisé par l’utilisateur.
- **Contexte** : parties courtes et commandes adaptées au mobile.
- **Décision** : cibler d’abord une application Web/PWA conçue pour le mobile et le portrait ; envisager ensuite iOS et Android.
- **Justification** : concentrer le premier développement sur une expérience mobile lisible et performante.
- **Conséquences** : évaluer ergonomie tactile et performances dans les futurs prototypes. Framework, méthode de distribution mobile et capacités PWA restent à choisir ; les applications ne sont pas encore développées.

## ADR-009 — Plusieurs jeux quotidiens indépendants

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée comme exigence produit et objectif architectural, pas comme architecture détaillée.
- **Contexte** : Daily Impossible et Daily Crime doivent coexister sous la marque NUSINI.
- **Décision** : concevoir une architecture extensible à plusieurs jeux indépendants, chacun proposant un défi quotidien identique pour tous.
- **Justification** : permettre l’ajout de jeux tout en maintenant une expérience cohérente et des composants réutilisables.
- **Conséquences** : définir les frontières entre jeux et services communs avant l’implémentation. Aucune décision prise sur monorepo, moteur, backend, stockage, calcul des défis ou classements.

## Orientations et choix encore à confirmer

- Architecture applicative concrète, stack, hébergement et distribution iOS/Android.
- Mécanisme sécurisé d’authentification GitHub pour Codex et protections de branche.
- Organisation des agents de test et de revue, couverture de tests et futurs contrôles de livraison.
- Détails des classements, séries et partage, ainsi que les règles calendaires des défis quotidiens.

Ces sujets ne sont pas des décisions techniques adoptées. À chaque arbitrage explicite, ajouter une décision avec contexte, justification et conséquences ; conserver les identifiants existants et marquer les décisions remplacées avec un lien vers leur successeur. Ne jamais transformer une hypothèse ou une configuration observée en décision validée sans source.
