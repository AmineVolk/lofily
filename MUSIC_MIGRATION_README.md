# Migration de la Gestion de Musique - AzuraCast vers CRUD Lofily

## Vue d'ensemble

Ce document explique comment migrer de l'ancien système AzuraCast vers le nouveau système de gestion de musique intégré dans Lofily.

## Nouveau Système

### Avantages

- **Interface unifiée** : Même logique que Background, Effects, Categories
- **Gestion complète** : CRUD complet avec upload, édition, suppression
- **Intégration native** : Pas de dépendance externe
- **Performance** : Requêtes directes à la base de données
- **Sécurité** : Contrôle total des accès et permissions

### Structure

```
backend/src/modules/music/
├── entities/music.entity.ts          # Entité TypeORM
├── dto/                              # Data Transfer Objects
│   ├── create-music.dto.ts
│   ├── update-music.dto.ts
│   ├── get-one-music.dto.ts
│   └── get-all-music.dto.ts
├── music.service.ts                  # Logique métier
├── music.controller.ts               # Endpoints REST
├── music.repository.ts               # Accès aux données
└── music.module.ts                   # Module NestJS

backoffice/src/components/Music/
├── Container.tsx                     # Gestion des états
├── MusicList.tsx                     # Liste avec pagination
├── SaveMusicDialog.tsx               # Formulaire d'édition
├── TableColumns.tsx                  # Colonnes du tableau
├── UploadMusic.tsx                   # Upload de fichiers
└── index.tsx                         # Export principal
```

## Migration

### 1. Prérequis

- Base de données PostgreSQL configurée
- Catégories existantes dans le système
- Variables d'environnement AzuraCast configurées

### 2. Variables d'Environnement

```bash
# AzuraCast (pour la migration)
AZURACAST_API_URL=https://your-azuracast-instance.com
AZURACAST_API_KEY=your-api-key
AZURACAST_MEDIA_URL=https://your-azuracast-instance.com/media

# Base de données
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-password
POSTGRES_DB=your-database
```

### 3. Exécution de la Migration

```bash
# Compiler le projet
cd backend
npm run build

# Exécuter la migration
npx ts-node scripts/migrate-azuracast-music.ts
```

### 4. Vérification

- Vérifier que les musiques sont dans la base de données
- Tester l'interface backoffice
- Vérifier que les fichiers sont accessibles

## Utilisation

### Backoffice

1. Aller dans la section "Music" du menu
2. Cliquer sur "New music" pour ajouter une musique
3. Uploader un fichier audio
4. Remplir les métadonnées (titre, artiste, catégorie)
5. Sauvegarder

### API

```bash
# Lister toutes les musiques
GET /music?page=1&limit=10&sort=created

# Créer une musique
POST /music
# avec form-data: file, category_id, is_default, title, artist, duration

# Modifier une musique
PUT /music/:id

# Supprimer une musique
DELETE /music/:id

# Musique par défaut
GET /music/default
```

## Structure des Données

### Entité Music

```typescript
{
  id: number;                    // ID unique
  title: string;                 // Titre de la musique
  artist: string;                // Artiste
  url: string;                   // URL du fichier audio
  image_url?: string;            // URL de l'image de couverture
  duration: number;              // Durée en secondes
  duration_text?: string;        // Durée formatée (ex: "3:45")
  artist_link?: string;          // Lien vers l'artiste
  category_id: number;           // ID de la catégorie
  is_default: boolean;           // Musique par défaut pour la catégorie
  is_active: boolean;            // Musique active
  created: Date;                 // Date de création
  updated: Date;                 // Date de modification
}
```

## Désactivation d'AzuraCast

### 1. Migration Complète

- Exécuter le script de migration
- Vérifier que toutes les musiques sont migrées
- Tester le nouveau système

### 2. Mise à Jour du Frontend

- Modifier les composants qui utilisent l'ancienne API
- Remplacer les appels AzuraCast par les nouveaux endpoints

### 3. Suppression des Dépendances

- Retirer les variables d'environnement AzuraCast
- Supprimer l'ancien service music.service.ts
- Nettoyer les imports inutilisés

## Support

En cas de problème :

1. Vérifier les logs de la migration
2. Contrôler la configuration de la base de données
3. Vérifier les permissions des dossiers de fichiers
4. Consulter les logs de l'application

## Notes Techniques

- Les fichiers audio sont stockés dans `backend/public/musics/`
- La base de données utilise TypeORM avec PostgreSQL
- L'interface backoffice utilise React avec TypeScript
- Les uploads sont gérés par Multer avec validation de type
