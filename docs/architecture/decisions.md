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
- **Conséquences** : vérifier les PR et leurs contrôles avant intégration. Le workflow GitHub App a depuis été vérifié (voir mémoire du projet) ; les protections distantes restent à auditer indépendamment.

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
- **Conséquences** : conserver une authentification adaptée sans copier de jeton dans la mémoire. Le workflow utilise désormais le helper Git existant et un jeton temporaire de l’App pour `gh`, sans stockage dans le dépôt. L’isolation de la clé privée est rapportée, non auditée ; aucun service de publication isolé supplémentaire n’est déclaré installé.

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
- **Conséquences** : évaluer ergonomie tactile et performances dans les futurs prototypes. Le prototype Web est précisé par ADR-010 ; distribution mobile et capacités PWA installables restent à définir.

## ADR-009 — Plusieurs jeux quotidiens indépendants

- **Date** : adoption initiale inconnue ; consignée le 2026-11-08.
- **Statut** : validée comme exigence produit et objectif architectural, pas comme architecture détaillée.
- **Contexte** : Daily Impossible et Daily Crime doivent coexister sous la marque NUSINI.
- **Décision** : concevoir une architecture extensible à plusieurs jeux indépendants, chacun proposant un défi quotidien identique pour tous.
- **Justification** : permettre l’ajout de jeux tout en maintenant une expérience cohérente et des composants réutilisables.
- **Conséquences** : définir les frontières entre jeux et services communs avant l’implémentation. ADR-010 choisit le moteur du premier prototype ; monorepo, backend, stockage, calcul des défis et classements restent à définir.

## ADR-010 — Premier prototype Daily Impossible statique

- **Date** : 2026-11-15.
- **Statut** : validée explicitement par l’utilisateur pour le premier incrément.
- **Contexte** : tester le plaisir de déplacement avant les services quotidiens et les finitions.
- **Décision** : TypeScript strict, Vite, Phaser 3 et Arcade Physics ; application Web statique, sans backend ni framework UI. Sources séparées entre scène, mouvement et commandes ; dépendances verrouillées par npm.
- **Justification** : moteur adapté aux collisions 2D et structure minimale, sans infrastructure supplémentaire.
- **Conséquences** : build dans `dist/`, Node pour le développement uniquement. Vitest teste les règles pures et Playwright les interactions dans Chromium ; les commandes locales vérifient types, tests et build. La CI applicative a été ajoutée à la PR #8 après le refus initial de publication du workflow par l’App : elle vérifie types, tests, build et Chromium, en conservant le contrôle documentaire. Aucun élargissement des permissions de l’App n’est déduit de cet ajout. PWA, distribution native et hébergement public restent ultérieurs. Ce choix précise ADR-008/009 pour ce seul prototype.

## ADR-011 — Commandes portrait et saut variable

- **Date** : 2026-11-15.
- **Statut** : exigences validées par l’utilisateur ; modalités techniques retenues dans le périmètre de l’implémentation.
- **Contexte** : jouer sur mobile avec déplacement et saut simultanés.
- **Décision** : terrain logique 360 × 550 ajusté sans déformation, boutons HTML gauche/droite/saut en bas avec Pointer Events et capture par doigt. Clavier de développement parallèle. Impulsion au sol, gravité Arcade, vitesse ascendante limitée au relâchement pour le saut variable.
- **Justification** : commandes indépendantes de la résolution du canvas, multitouch explicite et règles de mouvement testables sans moteur.
- **Précision validée le 2026-11-16** : le rectangle du bouton initial est vérifié aux coordonnées de chaque pointeur capturé. Sortir désactive, revenir réactive, glisser vers un autre bouton ne le déclenche pas. Les interruptions suppriment l’association. Flèche ↑ accessible comme « Sauter », aide clavier masquée sur tactile et protection des appuis prolongés limitée aux commandes.
- **Conséquences** : les sources clavier/tactile sont indépendantes ; directions opposées neutres, pas de double saut ni rebond automatique. Annulation, perte de capture, focus ou visibilité libèrent les entrées. Plateformes solides sur toutes les faces. Déplacements, collisions, saut variable et ergonomie validés sur iPhone réel par l’utilisateur le 2026-11-16.

## ADR-012 — Priorité au gameplay et graphisme provisoire

- **Date** : 2026-11-15.
- **Statut** : validée explicitement par l’utilisateur.
- **Contexte** : premier incrément jouable, pas une version de distribution.
- **Décision** : sol, quatre plateformes, silhouette géométrique ; palette beige/noir provisoire. Aucun asset externe. Reporter quotidien, backend, classements, obstacles complexes et décorations détaillées.
- **Justification** : concentrer la validation sur déplacement, collision, saut et ergonomie tactile.
- **Conséquences** : terrain libre sans sortie ni condition de victoire pour cet incrément ; la vision quotidienne reste un objectif futur. Aucune décision de monétisation ou de distribution App Store/Google Play.

## ADR-013 — Prévisualisation privée persistante

- **Date** : 2026-11-15.
- **Statut** : objectif validé par l’utilisateur ; service, linger, HTTPS privé et lien Homepage vérifiés le 2026-11-16 après intervention administrative.
- **Contexte** : tester le prototype depuis un iPhone via Tailscale et Homepage, piloté par l’agent sans commandes manuelles.
- **Décision** : service systemd utilisateur non privilégié, serveur statique Python standard sur loopback, releases identifiées par SHA et lien `current` atomique ; proxy Tailscale Serve privé persistant dédié à 8443, sans modifier 443 ni activer Funnel. Configuration Homepage privée hors Git.
- **Justification** : réutiliser Python, systemd et Tailscale existants, sans infrastructure publique ni serveur Vite permanent.
- **Conséquences** : le linger utilisateur nécessite une autorisation système ciblée ; pas de sudoers général. Logs dans le journal utilisateur. La prévisualisation PR reste distincte d’une future version stable ; l’automatisation de main n’est qu’une proposition dans `ops/README.md`, sans timer activé.

## ADR-014 — Boucle de gameplay locale et transitions uniques

- **Date** : 2026-11-24.
- **Statut** : implémentée dans la branche de phase 16 ; validation iPhone et revue à effectuer.
- **Contexte** : prolonger le prototype validé par une boucle courte sans services ni niveau quotidien.
- **Décision** : trois zones de pics fixes, détection par overlap Arcade, drapeau sur la dernière plateforme. Une petite classe `Run` porte les états playing/respawning/won et le compteur de morts. Seul playing accepte mort ou victoire ; une mort précède la réapparition de 180 ms. Rejouer remet toute la partie à zéro, sans recharger la page.
- **Justification** : transitions testables sans moteur, garde contre les collisions répétées, parcours réalisable par les commandes existantes. La scène reste responsable de la physique et de l’affichage minimal HTML.
- **Conséquences** : mort et victoire arrêtent le corps physique et nettoient touches, doigts, captures et saut en attente. Une nouvelle pression est requise après réapparition. Les paramètres de mouvement et la géométrie des plateformes restent inchangés. Hitboxes rectangulaires couvrant les petits groupes de pics ; lisibilité et tolérance à valider sur iPhone. Cette décision prolonge le terrain libre d’ADR-012, sans checkpoints, persistance ni backend.

## Orientations et choix encore à confirmer

- Architecture au-delà du prototype statique, hébergement public et distribution iOS/Android.
- Audit de l’isolation des identifiants GitHub et des protections de branche ; le workflow App est opérationnel.
- Organisation des agents de test et de revue, couverture de tests et futurs contrôles de livraison.
- Détails des classements, séries et partage, ainsi que les règles calendaires des défis quotidiens.

Ces sujets ne sont pas des décisions techniques adoptées. À chaque arbitrage explicite, ajouter une décision avec contexte, justification et conséquences ; conserver les identifiants existants et marquer les décisions remplacées avec un lien vers leur successeur. Ne jamais transformer une hypothèse ou une configuration observée en décision validée sans source.
