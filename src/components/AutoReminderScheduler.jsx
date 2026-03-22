import { useEffect } from 'react';
import { runWeekBeforeAutoReminderIfNeeded } from '../services/autoReminderService';

/**
 * Au chargement du site : si on est à J-7 ou plus (et avant le jour J),
 * envoie une fois le rappel à tous les invités qui ne l’ont pas encore reçu.
 * Firestore (doc meta/automation) évite les doublons entre visiteurs.
 */
let autoReminderJobStarted = false;

const AutoReminderScheduler = () => {
  useEffect(() => {
    if (autoReminderJobStarted) return;
    autoReminderJobStarted = true;

    runWeekBeforeAutoReminderIfNeeded().catch((err) => {
      console.warn('[Auto reminder]', err);
    });
  }, []);

  return null;
};

export default AutoReminderScheduler;
