# Tests automatisés de création d’un évènement (réunion des anciens dev)

## Fichier : `tests/EventView.test.js`

### Objectif
Vérifier le comportement de la vue `EventView.vue` pour la création d’un évènement de type « réunion des anciens dev » :
- Création d’un évènement avec titre, description, date, participants
- Affichage de l’évènement créé
- Gestion des erreurs (titre manquant, date passée, etc.)

### Outils
- Vitest (runner de test)
- Vue Test Utils (montage de composants)
- Mock du store, de l’API et des participants

### Cas testés

#### 1. Création réussie d’un évènement « réunion des anciens dev »
- **Action** : Création d’un évènement avec titre, description, date future, participants
- **Attendu** : L’évènement apparaît dans la liste, les détails sont corrects

#### 2. Titre manquant
- **Action** : Création d’un évènement sans titre
- **Attendu** : Message d’erreur « Titre obligatoire » affiché

#### 3. Date passée
- **Action** : Création d’un évènement avec une date antérieure à aujourd’hui
- **Attendu** : Message d’erreur « Date invalide » affiché

#### 4. Affichage des détails de l’évènement
- **Action** : Sélection d’un évènement dans la liste
- **Attendu** : Les détails (titre, description, participants) sont affichés

### Lancement des tests

```bash
npx vitest run
```

---


## Résultats des tests automatisés (Vitest)

Tests exécutés le 17/11/2025

```
✓ tests/EventView.test.js (4 tests) 112ms
  ✓ EventView.vue (4)
    ✓ crée un évènement réunion des anciens dev 74ms
    ✓ affiche une erreur si titre manquant 12ms
    ✓ affiche une erreur si date passée 10ms
    ✓ affiche les détails de l’évènement 15ms

Test Files  1 passed (1)
     Tests  4 passed (4)
Start at  13:52:51
Duration  1.07s
```

Tous les tests sont passés avec succès. La création et la validation d’un évènement (réunion des anciens dev) sont robustes côté frontend.

---

### Remarques
- Les mocks permettent de simuler l’API, le store et les participants sans backend réel.
- Les assertions sont commentées dans le code pour chaque cas.
- Adapter selon la gestion d’erreur globale si besoin.
