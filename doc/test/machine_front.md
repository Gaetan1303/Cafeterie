# Tests automatisés de lancement d’une machine (cafetière)

## Fichier : `tests/MachineView.test.js`

### Objectif
Vérifier le comportement de la vue `MachineView.vue` pour le lancement d’une machine de type cafetière :
- Sélection d’une machine
- Remplissage et utilisation (remplirEtUtiliserMachine)
- Gestion des erreurs et des états

### Outils
- Vitest (runner de test)
- Vue Test Utils (montage de composants)
- Mock du store, de l’API et du service machine

### Cas testés

#### 1. Sélection d’une machine
- **Action** : Sélection d’une machine de type cafetière
- **Attendu** : Les détails de la machine sont affichés

#### 2. Remplissage et utilisation avec succès
- **Action** : Remplir la machine avec une quantité valide, puis lancer l’utilisation
- **Attendu** : Le niveau de remplissage et le nombre de tasses/tickets sont mis à jour, message de succès affiché

#### 3. Remplissage avec quantité invalide
- **Action** : Tenter de remplir avec une quantité négative ou nulle
- **Attendu** : Aucun changement, message d’erreur ou absence d’action

#### 4. Erreur API lors de l’utilisation
- **Action** : Simuler une erreur lors de l’appel à useMachine
- **Attendu** : Message d’erreur affiché

### Lancement des tests

```bash
npx vitest run
```

---


## Résultats des tests automatisés (Vitest)

Tests exécutés le 17/11/2025

```
✓ tests/MachineView.test.js (4 tests) 71ms
  ✓ MachineView.vue (4)
    ✓ sélectionne et affiche une machine 46ms
    ✓ remplit et utilise la machine avec succès 11ms
    ✓ ne fait rien si quantité invalide 5ms
    ✓ affiche une erreur si l’API échoue 7ms

Test Files  1 passed (1)
     Tests  4 passed (4)
Start at  13:47:11
Duration  1.07s
```

Tous les tests sont passés avec succès. Le lancement et l’utilisation d’une machine (cafetière) sont robustes et conformes côté frontend.

---

### Remarques
- Les mocks permettent de simuler l’API, le store et le service machine sans backend réel.
- Les assertions sont commentées dans le code pour chaque cas.
- Adapter selon la gestion d’erreur globale si besoin.
