# Tests automatisés d’achats côté frontend (Vue)

## Fichier : `tests/PurchaseForm.test.js`

### Objectif
Vérifier le comportement du composant `PurchaseForm.vue` :
- Validation des champs (sélection produit, quantité, solde suffisant)
- Gestion des erreurs (stock insuffisant, solde insuffisant, champs obligatoires)
- Succès de l’achat

### Outils
- Vitest (runner de test)
- Vue Test Utils (montage de composants)
- Mock du store, de l’API et du stock

### Cas testés

#### 1. Produit non sélectionné
- **Action** : Soumission du formulaire sans sélectionner de produit
- **Attendu** : Message « Produit obligatoire » affiché

#### 2. Quantité invalide
- **Action** : Saisie d’une quantité négative ou nulle
- **Attendu** : Message « Quantité invalide » affiché

#### 3. Stock insuffisant
- **Action** : Saisie d’une quantité supérieure au stock disponible
- **Attendu** : Message « Stock insuffisant » affiché

#### 4. Solde insuffisant
- **Action** : Achat d’un produit avec un solde utilisateur trop faible
- **Attendu** : Message « Solde insuffisant » affiché

#### 5. Achat réussi
- **Action** : Sélection d’un produit, quantité valide, stock et solde suffisants
- **Attendu** : Pas d’erreur affichée, appel à la mutation d’achat, formulaire réinitialisé

### Lancement des tests

```bash
npx vitest run
```

---


## Résultats des tests automatisés (Vitest)

Tests exécutés le 17/11/2025

```
✓ tests/PurchaseForm.test.js (5 tests) 76ms
  ✓ PurchaseForm.vue (5)
    ✓ affiche une erreur si produit non sélectionné 47ms
    ✓ affiche une erreur si quantité invalide 8ms
    ✓ affiche une erreur si stock insuffisant 6ms
    ✓ affiche une erreur si solde insuffisant 8ms
    ✓ achat réussi avec données valides 5ms

Test Files  1 passed (1)
     Tests  5 passed (5)
Start at  13:44:46
Duration  1.11s
```

Tous les tests sont passés avec succès. Le composant PurchaseForm est conforme aux attentes de validation et de gestion d’erreur côté frontend.

---

### Remarques
- Les mocks permettent de simuler l’API, le store, le stock et le solde sans backend réel.
- Les assertions sont commentées dans le code pour chaque cas.
- Adapter selon la gestion d’erreur globale si besoin.
