# Mariage Gregoria & Marcel

Site d'invitation au mariage avec enregistrement des invités et envoi d'emails (invitation + rappel).

## Emails (EmailJS)

Pour que les invitations et rappels soient envoyés par email :

1. Créez un compte sur [EmailJS](https://www.emailjs.com/).
2. Ajoutez un **Email Service** (Gmail, Outlook, etc.) dans le dashboard.
3. Créez **deux templates** (Invitation + Rappel). Pour chaque template :
   - **Champ "To" (destinataire)** : mettez **exactement** `{{to_email}}` ou `{{email}}` — sans cela, erreur « The recipients address is empty ».
   - Dans le corps : `{{guest_name}}`, `{{subject}}`, `{{message}}`.
4. Copiez `.env.example` vers `.env` et renseignez :
   - `REACT_APP_EMAILJS_PUBLIC_KEY` (clé publique du compte)
   - `REACT_APP_EMAILJS_SERVICE_ID` (ID du service email)
   - `REACT_APP_EMAILJS_TEMPLATE_INVITATION` (ID du template invitation)
   - `REACT_APP_EMAILJS_TEMPLATE_RAPPEL` (ID du template rappel)

Sans configuration EmailJS, les invités sont enregistrés mais aucun email n'est envoyé (message dans la console).

## Stockage des invités (Firebase / navigateur)

- **Si les variables Firebase sont définies** dans `.env` (`REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`), les invités sont enregistrés dans **Cloud Firestore** (partagé entre tous les appareils).
  - Créez un projet sur [Firebase Console](https://console.firebase.google.com/), activez Firestore, puis copiez la config web.
  - Déployez des **règles** qui autorisent l’accès à la collection `guests` (voir `firestore.rules` à la racine du projet — à coller ou déployer depuis la console, sinon erreur `permission-denied`).
- **Sinon**, les invités sont enregistrés dans le **localStorage** du navigateur (un seul navigateur / appareil voit la liste admin).

## Admin

- `REACT_APP_ADMIN_PASSWORD` est **obligatoire** pour se connecter au panneau d’administration (plus de mot de passe par défaut dans le code).

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
