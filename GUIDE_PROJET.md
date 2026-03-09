# Guide du projet — Mariage Gregoria & Marcel

Ce document explique chaque partie du projet de manière simple, pour quelqu'un qui découvre le développement web.

---

## 1. Qu'est-ce que ce projet ?

C'est un **site web d'invitation au mariage** qui permet :
- aux invités de confirmer leur présence en ligne (nom + email)
- d'envoyer automatiquement un email d'invitation à chaque personne qui confirme
- à l'administrateur d'envoyer des rappels par email et de gérer la liste des invités

---

## 2. Technologies utilisées

### 2.1 React
**C'est quoi ?** Une bibliothèque JavaScript pour créer des interfaces web interactives.

**Pourquoi ?** Elle permet de découper l'interface en petits morceaux réutilisables (composants) et de les faire réagir automatiquement aux changements de données.

### 2.2 Create React App (CRA)
**C'est quoi ?** Un outil qui génère un projet React prêt à l'emploi.

**Pourquoi ?** Il configure automatiquement le compilateur, les tests, le formatage du code, etc. Tu n'as pas à tout configurer à la main.

### 2.3 Wouter
**C'est quoi ?** Une bibliothèque de **routage** — elle décide quelle page afficher selon l'URL.

**Exemple :**
- `https://ton-site.com/` → page d'accueil (invitation)
- `https://ton-site.com/admin-secret-2026` → panneau d'administration

### 2.4 EmailJS
**C'est quoi ?** Un service qui envoie des emails directement depuis le navigateur, sans serveur backend.

**Pourquoi ?** Pour envoyer les invitations et rappels automatiquement, sans avoir à créer un serveur ou une base de données complexe.

### 2.5 Lucide React
**C'est quoi ?** Une bibliothèque d'**icônes** (cœur, mail, horloge, etc.).

**Utilisation :** Les petites images décoratives dans les boutons ou à côté du texte (ex. l'icône mail sur le bouton « Confirmer ma présence »).

### 2.6 LocalStorage
**C'est quoi ?** Un espace de stockage intégré au navigateur, par ordinateur ou téléphone.

**Pourquoi ?** Pour garder en mémoire la liste des invités même après avoir fermé l'onglet. Les données restent jusqu'à ce qu'on les supprime ou qu'on vide le stockage du navigateur.

---

## 3. Structure du projet

```
wedding-gregoria-marcel/
├── public/              # Fichiers statiques (images, index.html)
│   ├── index.html       # Page HTML de base
│   └── img/             # Images du site
│       ├── lieu/        # Photos du lieu
│       └── couple/     # Photos du couple
│
├── src/                 # Code source du site
│   ├── App.js           # Point d'entrée : définition des routes
│   ├── index.js         # Lancement de l'application React
│   │
│   ├── components/      # Composants réutilisables
│   │   ├── BlackGoldPremium.jsx   # Page principale (invitation)
│   │   └── AdminPanel.jsx        # Liste des invités dans l'admin
│   │
│   ├── pages/           # Pages complètes
│   │   └── Admin.js     # Page d'administration (protégée par mot de passe)
│   │
│   ├── hooks/           # Hooks personnalisés (logique réutilisable)
│   │   └── useGuestManagement.js # Gestion des invités (ajout, rappels, suppression)
│   │
│   ├── services/        # Services qui communiquent avec des APIs externes
│   │   └── emailService.js       # Envoi des emails (invitation + rappel)
│   │
│   ├── config/          # Configuration
│   │   └── images.js    # Liste des noms d'images du lieu et du couple
│   │
│   └── styles/          # Fichiers CSS
│       ├── global.css   # Styles globaux (couleurs, typographie, responsive)
│       ├── blackGold.css
│       └── adminPage.css
│
├── .env                 # Variables secrètes (mots de passe, clés API)
└── package.json         # Dépendances du projet (React, EmailJS, etc.)
```

---

## 4. Description détaillée de chaque partie

### 4.1 `App.js` — Le routeur

**Rôle :** C'est le « chef d'orchestre » des pages.

- Définit quelles URL affichent quelles pages
- `/` → `BlackGoldPremium` (site d'invitation)
- `/admin-secret-2026` → `AdminPage` (panneau admin)

### 4.2 `BlackGoldPremium.jsx` — La page principale

**Rôle :** C'est la page que voient les invités.

Elle contient :
- La barre fixe en haut avec le titre et la date
- La section « hero » (grande photo de fond)
- Le compte à rebours jusqu'au mariage
- Les galeries photos (Le Lieu, Notre Histoire)
- Les infos pratiques (date, lieu, programme, dress code)
- Le formulaire RSVP (nom, email) pour confirmer sa présence

**Logique importante :**
- Vérifie que l'email n'a pas déjà été utilisé
- Envoie les données au hook `useGuestManagement` qui enregistre l'invité et envoie l'email

### 4.3 `Admin.js` — La page d'administration

**Rôle :** Réservée aux organisateurs du mariage.

**Fonctionnalités :**
- Demande un mot de passe avant d'afficher le contenu
- Affiche la liste de tous les invités qui ont confirmé
- Bouton « Envoyer un rappel à tous » pour renvoyer un email à chaque invité
- Bouton « Supprimer tous les invités » pour vider la liste (avec confirmation)

### 4.4 `AdminPanel.jsx` — Liste des invités

**Rôle :** Affiche la liste des invités dans la page admin.

Pour chaque invité : nom, email, et statut (invitation envoyée, rappel envoyé).

### 4.5 `useGuestManagement.js` — Gestion des invités

**Rôle :** Toute la logique liée aux invités est regroupée ici.

**Fonctions principales :**
- `addGuest(name, email)` — Ajoute un invité, envoie l'invitation, vérifie que l'email n'est pas déjà utilisé
- `sendReminderToAll()` — Envoie un email de rappel à chaque invité
- `clearAllGuests()` — Supprime tous les invités du stockage

**Stockage :** Utilise le `localStorage` du navigateur avec la clé `wedding_gregoria_marcel_guests`.

### 4.6 `emailService.js` — Envoi des emails

**Rôle :** Prépare le contenu HTML des emails et les envoie via EmailJS.

**Deux types d'emails :**
1. **Invitation** — Envoyé automatiquement quand quelqu'un confirme sa présence
2. **Rappel** — Envoyé manuellement depuis le panneau admin (bouton « Envoyer un rappel à tous »)

**Variables d'environnement nécessaires :**
- `REACT_APP_EMAILJS_PUBLIC_KEY` — Clé publique du compte EmailJS
- `REACT_APP_EMAILJS_SERVICE_ID` — ID du service email configuré
- `REACT_APP_EMAILJS_TEMPLATE_INVITATION` — ID du template d'invitation
- `REACT_APP_EMAILJS_TEMPLATE_RAPPEL` — ID du template de rappel

### 4.7 `images.js` — Configuration des images

**Rôle :** Liste les noms des fichiers des galeries.

- `lieuImages` — Photos du lieu de la cérémonie (dans `public/img/lieu/`)
- `coupleImages` — Photos du couple (dans `public/img/couple/`)

Pour ajouter ou modifier une photo : mettre le fichier dans le bon dossier et ajouter son nom dans `images.js`.

### 4.8 Fichiers CSS

**`global.css`** — Styles principaux du site :
- Thème noir et or
- Mise en page des sections (hero, countdown, galeries, RSVP)
- **Responsive** : adaptation téléphone, tablette, ordinateur, TV

**`adminPage.css`** — Styles du panneau d'administration

**`blackGold.css`** — Styles supplémentaires (polices, animations)

---

## 5. Fichier `.env` — Configuration secrète

Ce fichier contient des données sensibles et **n'est pas envoyé** sur un dépôt Git public.

| Variable | Description |
|----------|-------------|
| `HOST=0.0.0.0` | Permet de tester sur téléphone depuis le réseau local |
| `REACT_APP_ADMIN_PASSWORD` | Mot de passe pour accéder au panneau admin |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | Clé EmailJS |
| `REACT_APP_EMAILJS_SERVICE_ID` | ID du service email |
| `REACT_APP_EMAILJS_TEMPLATE_INVITATION` | ID du template d'invitation |
| `REACT_APP_EMAILJS_TEMPLATE_RAPPEL` | ID du template de rappel |

---

## 6. Commandes utiles

| Commande | Rôle |
|----------|------|
| `npm start` | Lance le site en mode développement (http://localhost:3000) |
| `npm run build` | Crée une version optimisée pour la mise en ligne |
| `npm test` | Lance les tests automatiques |

---

## 7. Parcours typique d'un invité

1. L'invité ouvre le site → voit la page d'invitation
2. Il remplit son nom et son email → clique sur « Confirmer ma présence »
3. Le site vérifie que l'email n'a pas déjà été utilisé
4. Si tout est bon :
   - l'invité est enregistré dans le `localStorage`
   - un email d'invitation est envoyé
   - un message de confirmation s'affiche
5. Plus tard, l'admin peut envoyer un rappel à tous depuis le panneau protégé

---

## 8. Lexique rapide

- **Composant** : Bloc d'interface (bouton, formulaire, section) réutilisable
- **Hook** : Fonction React qui encapsule une logique (état, effets) réutilisable
- **Route** : Association entre une URL et une page
- **LocalStorage** : Stockage local dans le navigateur, persistant entre les sessions
- **Responsive** : Interface qui s'adapte à la taille de l'écran (mobile, tablette, PC)

---

*Ce guide a été créé pour faciliter la compréhension du projet. Pour toute question, consulte la documentation officielle de [React](https://react.dev/) et [EmailJS](https://www.emailjs.com/).*
