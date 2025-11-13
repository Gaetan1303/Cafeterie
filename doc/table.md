# Liens SQL entre les tables

| Table source      | Champ clé étrangère      | Table cible   | Champ cible   | Type de lien         |
|-------------------|-------------------------|---------------|---------------|----------------------|
| Purchases         | userId                  | Users         | id            | Plusieurs-à-un       |
| Purchases         | type, subtype           | Stock         | type, subtype | Plusieurs-à-un (logique) |
| StockMovements    | stockId                 | Stock         | id            | Plusieurs-à-un       |
| StockMovements    | userId                  | Users         | id            | Plusieurs-à-un (nullable) |

## Détail des liens
- **Purchases.userId → Users.id** : chaque achat est lié à un utilisateur.
- **Purchases.(type,subtype) → Stock.(type,subtype)** : chaque achat correspond à un type précis de stock (café, thé, nourriture/sous-type).
- **StockMovements.stockId → Stock.id** : chaque mouvement de stock concerne un stock précis.
- **StockMovements.userId → Users.id** : l'utilisateur à l'origine du mouvement (optionnel, par exemple pour un réapprovisionnement automatique).


