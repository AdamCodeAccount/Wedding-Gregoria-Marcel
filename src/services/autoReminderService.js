/**
 * Rappel automatique à tous les invités : une fois, à partir de J-7 avant le mariage.
 * Sans serveur : déclenché au chargement du site ; Firestore garantit un seul envoi (doc meta).
 * En localStorage seul : drapeau par navigateur (moins fiable si personne n’ouvre le site).
 */
import {
  collection,
  doc,
  getDocs,
  runTransaction,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { isAutoReminderWindowActive } from '../config/wedding';
import { sendReminderEmail } from './emailService';

const GUESTS_COLLECTION = 'guests';
const LOCAL_FLAG = 'wedding_week_before_auto_reminder_sent';

function loadGuestsFromStorage() {
  try {
    const raw = localStorage.getItem('wedding_gregoria_marcel_guests');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestsToStorage(list) {
  localStorage.setItem('wedding_gregoria_marcel_guests', JSON.stringify(list));
}

async function sendRemindersToGuestsList(guests, onEachUpdated) {
  for (const guest of guests) {
    if (guest.reminderSent) continue;
    try {
      await sendReminderEmail(guest);
      if (typeof onEachUpdated === 'function') {
        await onEachUpdated(guest);
      }
    } catch (err) {
      console.warn('[Auto reminder] Échec pour', guest?.email, err);
    }
  }
}

export async function runWeekBeforeAutoReminderIfNeeded() {
  if (!isAutoReminderWindowActive()) return;

  if (db) {
    const metaRef = doc(db, 'meta', 'automation');
    const outcome = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(metaRef);
      const prev = snap.exists() ? snap.data() : {};
      if (prev.weekBeforeReminderSent === true) {
        return { shouldSend: false };
      }
      transaction.set(
        metaRef,
        {
          weekBeforeReminderSent: true,
          weekBeforeReminderSentAt: Date.now(),
        },
        { merge: true }
      );
      return { shouldSend: true };
    });

    if (!outcome.shouldSend) return;

    const snapshot = await getDocs(collection(db, GUESTS_COLLECTION));
    const guests = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    await sendRemindersToGuestsList(guests, async (guest) => {
      await updateDoc(doc(db, GUESTS_COLLECTION, guest.id), {
        reminderSent: true,
      });
    });
    return;
  }

  // Pas de Firestore : meilleur effort (un navigateur = un envoi max)
  if (localStorage.getItem(LOCAL_FLAG) === '1') return;
  localStorage.setItem(LOCAL_FLAG, '1');

  const guests = loadGuestsFromStorage();
  await sendRemindersToGuestsList(guests, async (guest) => {
    const current = loadGuestsFromStorage();
    const updated = current.map((g) =>
      g.id === guest.id ? { ...g, reminderSent: true } : g
    );
    saveGuestsToStorage(updated);
  });
}
