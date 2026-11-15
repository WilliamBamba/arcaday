# Prévisualisation privée

Le service utilisateur sert uniquement une copie validée du build sur
`127.0.0.1:4173`. Il n’utilise ni Vite dev, ni accès au dépôt, ni secret.
Les fichiers sont dans `~/.local/share/arcaday-preview/releases/<SHA>` ;
`current` sélectionne la version publiée, `previous` conserve la précédente.
Le serveur refuse les listes de répertoires, fichiers cachés et liens sortants.
Il est destiné au test privé, pas à une exposition publique.

## Installation par l’agent, après autorisations natives

Copier `serve-static.py` dans `~/.local/lib/arcaday/`, et l’unité dans
`~/.config/systemd/user/arcaday-preview.service`. Après publication d’un build :

```sh
systemctl --user daemon-reload
systemctl --user enable --now arcaday-preview.service
systemctl --user status arcaday-preview.service
journalctl --user -u arcaday-preview.service -n 50 --no-pager
```

Un administrateur doit autoriser `loginctl enable-linger arcaday` une fois pour
le démarrage sans session utilisateur. Ne pas ajouter de sudoers général.
L’accès privé persistant utilise `tailscale serve --bg --https=8443
http://127.0.0.1:4173`, après vérification que 8443 est libre. Ne jamais activer
Funnel, utiliser `reset`, ni modifier les services déjà présents sur 443.
Les droits Tailscale sont distincts des permissions du système de fichiers.

## Mise à jour du prototype

L’agent synchronise la branche PR approuvée par avance rapide, inspecte le SHA,
exécute `npm ci`, `npm run check`, puis `npm run test:e2e`. Après réussite :

```sh
python3 ops/publish-preview.py dist "$(git rev-parse HEAD)" \
  --root "$HOME/.local/share/arcaday-preview"
curl --fail http://127.0.0.1:4173/release.json
```

Les publications doivent être sérialisées. Un SHA existant n’est pas écrasé.
Si le contrôle HTTP après publication échoue, rétablir atomiquement `current`
vers la cible de `previous`, puis revérifier HTTP. Une publication initiale
sans version précédente doit être arrêtée si son contrôle échoue.
Ne pas supprimer une ancienne version pendant une session de test.

## Version stable future — proposition, non activée

Proposition minimale : une commande lancée par l’agent après approbation humaine
d’un SHA précis de main, déjà fusionné et validé. Elle vérifierait les contrôles
GitHub via un accès en lecture seule. Aucun timer ou déclenchement sur push
n’est proposé pour cette première étape.

1. Télécharger le SHA exact dans un répertoire de travail temporaire isolé,
   sans changer le dépôt de développement ; confirmer qu’il appartient à main.
2. Vérifier les contrôles CI obligatoires pour ce SHA, échouer si résultat
   absent, en cours ou négatif ; ne jamais faire confiance au seul nom de branche.
3. `npm ci`, types, tests unitaires, build et tests navigateur.
4. Préparer une release statique distincte sous `arcaday-stable`, tester son
   serveur local, puis basculer son propre lien `current` atomiquement.
5. Vérifier HTTP et la révision publiée ; rétablir `previous` en cas d’échec.

Un verrou interdit deux déploiements concurrents. Conserver au moins la version
précédente et les journaux. Le service stable aura un port et une carte Homepage
distincts. Le mode d’accès GitHub et la procédure devront être validés avant activation ;
aucun élargissement des permissions de l’App, runner administrateur ou webhook
public n’est nécessaire. Aucun déploiement automatique n’est activé par ces fichiers.
