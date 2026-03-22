import { useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  sendInvitationEmail,
  sendReminderEmail,
  sendOrganizerNotificationEmail,
} from '../services/emailService';

const GUESTS_COLLECTION = 'guests';
const LOCAL_STORAGE_KEY = 'wedding_gregoria_marcel_guests';

const newLocalId = () =>
  `local_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

function loadGuestsFromStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestsToStorage(list) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
}

export const useGuestManagement = () => {
  const [guests, setGuests] = useState([]);
  const useFirestore = isFirebaseConfigured() && db != null;

  const fetchGuests = useCallback(async () => {
    if (useFirestore) {
      const snapshot = await getDocs(collection(db, GUESTS_COLLECTION));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGuests(list);
      return list;
    }
    const list = loadGuestsFromStorage();
    setGuests(list);
    return list;
  }, [useFirestore]);

  const addGuest = useCallback(
    async (name, email) => {
      const emailLower = email.trim().toLowerCase();

      if (useFirestore) {
        try {
          const q = query(
            collection(db, GUESTS_COLLECTION),
            where('emailLower', '==', emailLower)
          );
          const existing = await getDocs(q);
          if (!existing.empty) {
            return { success: false, error: 'email_already_used' };
          }

          const guest = {
            name,
            email,
            emailLower,
            timestamp: Date.now(),
            confirmed: true,
            emailSent: false,
            reminderSent: false,
          };

          const docRef = await addDoc(collection(db, GUESTS_COLLECTION), guest);
          const newGuest = { id: docRef.id, ...guest };
          setGuests((prev) => [...prev, newGuest]);

          try {
            await sendInvitationEmail(newGuest);
            await updateDoc(doc(db, GUESTS_COLLECTION, docRef.id), {
              emailSent: true,
            });
            setGuests((prev) =>
              prev.map((g) =>
                g.id === docRef.id ? { ...g, emailSent: true } : g
              )
            );
          } catch (err) {
            console.warn('Invitation email failed:', err);
          }

          return { success: true, guest: newGuest };
        } catch (err) {
          console.error('[Firestore] addGuest:', err);
          return {
            success: false,
            error: 'firestore_error',
            message:
              err?.code === 'permission-denied'
                ? 'permission_denied'
                : 'unknown',
          };
        }
      }

      // --- localStorage ---
      const list = loadGuestsFromStorage();
      if (list.some((g) => (g.emailLower || g.email || '').toLowerCase() === emailLower)) {
        return { success: false, error: 'email_already_used' };
      }

      const guest = {
        id: newLocalId(),
        name,
        email,
        emailLower,
        timestamp: Date.now(),
        confirmed: true,
        emailSent: false,
        reminderSent: false,
      };

      const next = [...list, guest];
      saveGuestsToStorage(next);
      setGuests(next);

      try {
        await sendInvitationEmail(guest);
        const updated = next.map((g) =>
          g.id === guest.id ? { ...g, emailSent: true } : g
        );
        saveGuestsToStorage(updated);
        setGuests(updated);
      } catch (err) {
        console.warn('Invitation email failed:', err);
      }

      try {
        await sendOrganizerNotificationEmail(guest);
      } catch (err) {
        console.warn('Notification organisateur failed:', err);
      }

      return { success: true, guest };
    },
    [useFirestore]
  );

  const clearAllGuests = useCallback(async () => {
    if (useFirestore) {
      const snapshot = await getDocs(collection(db, GUESTS_COLLECTION));
      await Promise.all(
        snapshot.docs.map((d) =>
          deleteDoc(doc(db, GUESTS_COLLECTION, d.id))
        )
      );
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setGuests([]);
  }, [useFirestore]);

  const sendReminderToAll = useCallback(async () => {
    const list = useFirestore
      ? await (async () => {
          const snapshot = await getDocs(collection(db, GUESTS_COLLECTION));
          return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        })()
      : loadGuestsFromStorage();

    for (const guest of list) {
      try {
        await sendReminderEmail(guest);
        if (useFirestore) {
          await updateDoc(doc(db, GUESTS_COLLECTION, guest.id), {
            reminderSent: true,
          });
        } else {
          const current = loadGuestsFromStorage();
          const updated = current.map((g) =>
            g.id === guest.id ? { ...g, reminderSent: true } : g
          );
          saveGuestsToStorage(updated);
        }
      } catch (err) {
        console.warn('Reminder failed for', guest.email, err);
      }
    }

    if (!useFirestore) {
      setGuests(loadGuestsFromStorage());
    } else {
      await fetchGuests();
    }

    return { success: true, count: list.length };
  }, [useFirestore, fetchGuests]);

  return { guests, fetchGuests, addGuest, sendReminderToAll, clearAllGuests };
};
