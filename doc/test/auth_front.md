
# Tests automatisés d’authentification côté frontend (Vue)

## Fichier : `tests/LoginForm.test.js`

### Objectif
Vérifier le comportement du composant `LoginForm.vue` :
- Validation des champs (email, mot de passe)
- Gestion des erreurs
- Succès de la connexion

### Outils
- Vitest (runner de test)
- Vue Test Utils (montage de composants)
- Mock du store et de l’API

### Cas testés

#### 1. Email invalide
- **Action** : Saisie d’un email non valide, soumission du formulaire
- **Attendu** : Message « Email invalide » affiché

#### 2. Mot de passe trop court
- **Action** : Saisie d’un mot de passe < 4 caractères
- **Attendu** : Message « Mot de passe trop court » affiché

#### 3. Connexion réussie
- **Action** : Saisie d’un email et mot de passe valides
- **Attendu** : Pas d’erreur affichée, appel à setToken/setUser

#### 4. Mauvais identifiants
- **Action** : Saisie d’un bon email mais mauvais mot de passe
- **Attendu** : Message d’erreur global (selon la gestion d’erreur du projet)


### Lancement des tests

```bash
npx vitest run
```

---

## Résultats des tests automatisés (Vitest)

Tests exécutés le 17/11/2025

```
✓ tests/LoginForm.test.js (4 tests)
	✓ LoginForm.vue (4)
		✓ affiche une erreur si email invalide
		✓ affiche une erreur si mot de passe trop court
		✓ connexion réussie avec bons identifiants
		✓ affiche une erreur si mauvais identifiants

Test Files  1 passed (1)
		 Tests  4 passed (4)
Start at  13:42:11
Duration  1.09s
```

Tous les tests sont passés avec succès. Le composant LoginForm est conforme aux attentes de validation et de gestion d’erreur côté frontend.

---

### Remarques
- Les mocks permettent de simuler l’API et le store sans backend réel.
- Les assertions sont commentées dans le code pour chaque cas.
- Adapter selon la gestion d’erreur globale si besoin.

---
