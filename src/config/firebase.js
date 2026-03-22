import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Configuration Firebase (Firestore).
 * Si REACT_APP_FIREBASE_* manquent, l'app ne plante pas : le hook useGuestManagement
 * utilise alors le localStorage du navigateur.
 */
const getFirebaseConfig = () => ({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
});

export const isFirebaseConfigured = () => {
  const c = getFirebaseConfig();
  return Boolean(c.apiKey && c.authDomain && c.projectId);
};

/** Instance Firestore, ou null si la config n'est pas complète */
let db = null;

if (isFirebaseConfigured()) {
  const config = getFirebaseConfig();
  const app =
    getApps().length === 0 ? initializeApp(config) : getApps()[0];
  db = getFirestore(app);
} else if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.info(
    '[Firebase] Config incomplète — stockage invités : localStorage. ' +
      'Renseignez REACT_APP_FIREBASE_API_KEY, AUTH_DOMAIN et PROJECT_ID pour Firestore.'
  );
}

export { db };
