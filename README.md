# What Did I Promise?

> Ne laisse plus une promesse oubliée abîmer ta crédibilité, une relation, ou ta tranquillité mentale.

Application mobile **React Native / Expo** pour suivre et honorer ses engagements personnels et professionnels.

---

## Fonctionnalités

- **Capture rapide** — Enregistre une promesse en moins de 10 secondes
- **Gestion des statuts** — Ouverte, en cours, tenue, reportée, annulée, en retard, archivée
- **Priorités** — Faible, normale, élevée, critique
- **Contextes** — Personnel, travail, famille, amitiés, administratif, santé, finances, maison
- **Personnes** — Associe chaque promesse à une personne (ami, famille, collègue, client…)
- **Rappels & notifications** — Rappels avant échéance, check-ins périodiques
- **Score de fiabilité** — Indicateur de taux de tenue des promesses dans le temps
- **Détection de risque** — Identifie automatiquement les promesses à risque
- **Récurrence** — Promesses quotidiennes, hebdomadaires, mensuelles, etc.
- **Notes & pièces jointes** — Enrichis chaque promesse avec du contexte
- **Statistiques** — Vue synthétique de tes engagements et de ta fiabilité
- **Base de données locale** — Toutes les données restent sur l'appareil (SQLite)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | React Native 0.76 + Expo ~52 |
| Navigation | Expo Router ~4 (file-based) |
| Base de données | expo-sqlite ~15 |
| État global | Zustand ^5 |
| Langage | TypeScript ^5.3 |
| Tests | Jest 29 + jest-expo |
| Fonts | Inter via @expo-google-fonts |

---

## Structure du projet

```
app/                        # Pages (Expo Router)
├── (tabs)/                 # Navigation par onglets
│   ├── index.tsx           # Accueil — promesses du jour
│   ├── promises.tsx        # Liste complète des promesses
│   ├── people.tsx          # Gestion des personnes
│   ├── stats.tsx           # Statistiques & fiabilité
│   └── settings.tsx        # Paramètres
├── modal/
│   ├── checkin.tsx         # Modal de check-in
│   └── paywall.tsx         # Paywall
├── person/[id].tsx         # Détail d'une personne
├── promise/
│   ├── [id].tsx            # Détail d'une promesse
│   └── create.tsx          # Création d'une promesse
├── onboarding.tsx
└── index.tsx

src/
├── components/             # Composants UI réutilisables
├── constants/              # Thème, chaînes i18n (FR), datasets
├── db/                     # Initialisation SQLite & schéma
├── hooks/                  # Hooks React personnalisés
├── repositories/           # Couche d'accès aux données
├── services/               # Logique métier
├── store/                  # Stores Zustand
└── types/                  # Types & enums TypeScript
```

---

## Démarrage

### Prérequis

- Node.js ≥ 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- Un émulateur Android / iOS ou l'application **Expo Go** sur votre appareil

### Installation

```bash
npm install
```

### Lancer l'application

```bash
# Expo DevTools (choix plateforme interactif)
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### Tests & qualité

```bash
# Tests unitaires (watch mode)
npm test

# Vérification des types TypeScript
npm run type-check

# Lint
npm run lint
```

---

## Licence

Voir [LICENSE](LICENSE).
