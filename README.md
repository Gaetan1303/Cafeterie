# Cafeterie – Application de gestion Café & Thé

> Application web pour suivre les consommations de café/thé, gérer un stock collectif et consulter l’historique des achats.

## Fonctionnalités principales

- Authentification (inscription, connexion, gestion du profil)
- Pointage d’achats (café, thé, nourriture)
- Gestion du stock (visualisation, réapprovisionnement, alertes)
- Historique des achats (filtrage, vue admin)
- Dashboard synthétique
- Sécurité front-end (validation, rôles, feedbacks)

## Prérequis

- Node.js >= 18
- npm >= 9

## Installation

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

Accès sur http://localhost:5173

## Build pour la production

```bash
npm run build
```

Le dossier `dist/` est généré, prêt à être déployé sur un serveur statique (nginx, Vercel, Netlify, etc).

## Déploiement statique (exemple nginx)

1. Copier le contenu de `dist/` sur votre serveur
2. Configurer nginx :

```nginx
server {
    listen 80;
    server_name votre-domaine.fr;
    root /chemin/vers/dist;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Configuration de l’API

L’application front-end attend une API REST compatible avec les routes suivantes :

- POST `/login` : connexion (retourne JWT et infos user)
- POST `/register` : inscription
- GET `/users/me` : profil utilisateur
- PUT `/users/me` : mise à jour profil
- GET `/stock` : stock actuel
- POST `/stock/restock` : réapprovisionnement (admin)
- GET `/purchases/me` : historique personnel
- GET `/purchases` : historique global (admin)
- POST `/purchases` : enregistrer un achat

> Adapter le proxy ou la config CORS selon votre backend.

## Sécurité front-end

- Validation des champs (anti-XSS, regex, feedbacks)
- Navigation conditionnelle selon le rôle
- Gestion du token JWT côté client (stocké localement)

## Personnalisation

- Couleurs et styles modifiables dans les fichiers `.vue` et `App.vue`
- Seuils de stock et types de produits adaptables côté backend

## Contribution

1. Forkez le repo
2. Créez une branche (`feature/ma-fonctionnalite`)
3. Commitez vos modifications
4. Ouvrez une Pull Request

## Licence

Cette application est sous licence de El Mimine ! 
