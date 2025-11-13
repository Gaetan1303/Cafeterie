# Cahier des Charges - Application Gestion Café & Thé

## 1. Présentation du projet

### 1.1 Contexte
Application web permettant aux utilisateurs de suivre leurs consommations de café et thé, ainsi que la gestion des stocks collectifs.

### 1.2 Objectifs
- Suivre les consommations individuelles de café/thé
- Gérer un stock partagé
- Avoir une visibilité sur l'historique des consommations
- Base pour évolution future 

---

## 2. Périmètre fonctionnel

### 2.1 Fonctionnalités MVP (Version 1)

#### **Gestion des utilisateurs**
- Création de compte (email, mot de passe, nom/prénom)
- Connexion / Déconnexion
- Profil utilisateur simple


#### **Pointage des consommations**
- Enregistrer un achat de café
- Enregistrer un achat de thé
- Enregistrer un achat de nourriture (gâteaux, viennoiseries, autres)
- Sélection de la quantité
- Sélection du type de nourriture (gâteau, viennoiserie, autre)
- Horodatage automatique
- Validation de l'achat


#### **Gestion du stock**
- Visualisation du stock actuel (café/thé/nourriture)
- Ajout de stock (réapprovisionnement)
- Retrait de stock (automatique lors d'un achat)
- Historique des mouvements de stock
- Alertes stock bas (seuil configurable)

#### **Historique**
- Liste des achats personnels
- Filtrage par type (café/thé)
- Filtrage par date
- Vue globale pour les administrateurs

### 2.2 Fonctionnalités futures (V2+)
- Statistiques personnelles (graphiques de consommation)
- Système de paiement/contribution
- Notifications push (stock bas)
- Export des données (CSV, PDF)
- Mode équipe/entreprise
- Gestion de plusieurs lieux/bureaux
- Types de boissons et nourritures personnalisables

---

### 3.1 Modèle de données

#### **Table Users**
```
id: UUID (PK)
email: string (unique)
password: string (hashed)
firstName: string
lastName: string
role: enum (user, admin)
createdAt: timestamp
updatedAt: timestamp
```


#### **Table Purchases**
```
id: UUID (PK)
userId: UUID (FK -> Users)
type: enum (cafe, the, nourriture)
subtype: string (ex: gateau, viennoiserie, autre) [nullable, utilisé si type = nourriture]
quantity: integer
timestamp: timestamp
createdAt: timestamp
```


#### **Table Stock**
```
id: UUID (PK)
type: enum (cafe, the, nourriture)
subtype: string (ex: gateau, viennoiserie, autre) [nullable, utilisé si type = nourriture]
quantity: integer
threshold: integer (seuil alerte)
lastRestocked: timestamp
updatedAt: timestamp
```

#### **Table StockMovements**
```
id: UUID (PK)
stockId: UUID (FK -> Stock)
type: enum (restock, purchase)
quantity: integer (+ ou -)
userId: UUID (FK -> Users, nullable)
reason: string
timestamp: timestamp
```

---

## 4. Spécifications fonctionnelles détaillées

### 4.1 Authentification

**Inscription**
- Email valide requis
- Mot de passe : min 8 caractères
- Confirmation par email (V2)

**Connexion**
- Email + mot de passe
- Token JWT valide 7 jours
- Refresh token (V2)

### 4.2 Pointage achat


**Flux utilisateur**
1. Utilisateur authentifié accède à la page d'achat
2. Sélectionne le type (café, thé ou nourriture)
3. Si nourriture, sélectionne le sous-type (gâteau, viennoiserie, autre)
4. Choisit la quantité (1 par défaut)
5. Clique sur "Valider"
6. Confirmation visuelle
7. Stock décrémenté automatiquement
8. Achat enregistré dans l'historique

**Règles métier**
- Impossible d'acheter si stock = 0 (pour chaque type/sous-type)
- Warning si stock < seuil
- Quantité max par achat : 5 (configurable)

### 4.3 Gestion stock

**Ajout de stock**
- Réservé aux admins
- Saisie quantité à ajouter
- Commentaire optionnel
- Mise à jour automatique

**Consultation**
- Stock actuel visible pour tous
- Historique mouvements (admins only)
- Indicateur visuel (vert/orange/rouge)

---

## 5. Interface utilisateur

### 5.1 Pages principales

1. **Page connexion/inscription**
2. **Dashboard** : vue d'ensemble (stocks, mes derniers achats)
3. **Pointage** : enregistrer un achat
4. **Mon historique** : liste de mes achats
5. **Gestion stock** (admin) : ajuster les stocks
6. **Profil** : informations personnelles

### 5.2 Principes UX/UI
- Design épuré et moderne
- Actions principales accessibles en 1 clic
- Feedbacks visuels clairs
- Temps de réponse < 200ms
- Dark mode (V2)

---

## 6. Sécurité

### 6.1 Authentification
- Mots de passe hashés (bcrypt)
- Tokens JWT signés
- HTTPS obligatoire en production
- Rate limiting sur login

### 6.2 Autorisations
- Users : CRUD sur leurs propres achats
- Admins : gestion stock + accès global

### 6.3 Validation
- Sanitisation des inputs
- Protection CSRF
- Protection XSS
- Validation côté client ET serveur

---
