# Documentation technique : DTO, Enums et conventions

Ce document centralise les conventions de structuration des objets de transfert de données (DTO), les énumérations utilisées dans le projet, ainsi que les bonnes pratiques pour la cohérence des échanges entre frontend et backend.

## 1. DTO (Data Transfer Object)

### Définition
Un DTO est un objet structuré servant à transporter des données entre les couches de l’application (API, frontend, backend) sans logique métier.

### Exemples de DTO du projet

#### Utilisateur (UserDTO)
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "admin" | "user",
  "solde": "number"
}
```

#### Achat (PurchaseDTO)
```json
{
  "_id": "string",
  "userId": "string",
  "stockItem": "string",
  "quantity": "number",
  "type": "cafe" | "the" | "nourriture",
  "subtype": "gateau" | "viennoiserie" | "autre" | null,
  "date": "ISODate"
}
```

#### Machine (MachineDTO)
```json
{
  "_id": "string",
  "name": "string",
  "type": "cafe" | "the" | "autre",
  "state": "ok" | "maintenance" | "hors_service",
  "capacity": "number",
  "unit": "string",
  "consumables": [ { "name": "string", "quantity": "number", ... } ]
}
```

#### Évènement (EventDTO)
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "date": "ISODate",
  "participants": ["userId"],
  "maxParticipants": "number"
}
```


## 2. Diagrammes de classe

Le diagramme de classes UML du projet est disponible dans le fichier suivant :

- [Diagramme de classes (PDF/PNG)](./diagramme_classes.md)

Ce diagramme illustre les entités principales (User, Purchase, Machine, Event, Stock, etc.), leurs attributs et relations (composition, héritage, associations).

---

## 3. Liens utiles (non SQL)

- [CDC fonctionnel](./cdc-cafe-app.md) — Cahier des charges complet
- [Table de correspondance](./table.md) — Mapping des entités et champs
- [Tests automatisés frontend](./test/auth_front.md), [achats](./test/purchase_front.md), [machines](./test/machine_front.md), [évènements](./test/event_front.md)
- [Avis et retours](./avis.md)

---

## 4. Enums (énumérations)

### Types de consommables
- `cafe`
- `the`
- `nourriture`

### Sous-types de nourriture
- `gateau`
- `viennoiserie`
- `autre`

### Rôles utilisateur
- `admin`
- `user`

### États machine
- `ok`
- `maintenance`
- `hors_service`

---





*Dernière mise à jour : 17/11/2025*
