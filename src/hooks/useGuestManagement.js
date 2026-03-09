import { useState, useEffect, useCallback } from 'react';
import { sendInvitationEmail, sendReminderEmail } from '../services/emailService';

const STORAGE_KEY = 'wedding_gregoria_marcel_guests';

const loadGuestsFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveGuestsToStorage = (guests) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  } catch (e) {
    console.warn('Could not save guests to localStorage', e);
  }
};

export const useGuestManagement = () => {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    setGuests(loadGuestsFromStorage());
  }, []);

  const addGuest = useCallback(async (name, email) => {
    const emailLower = (email || '').trim().toLowerCase();
    const exists = guests.some((g) => (g.email || '').trim().toLowerCase() === emailLower);
    if (exists) {
      return { success: false, error: 'email_already_used' };
    }

    const id = `guest:${Date.now()}`;
    const guest = {
      id,
      name,
      email,
      timestamp: Date.now(),
      confirmed: true,
      emailSent: false,
      reminderSent: false
    };

    const newList = [...guests, guest];
    setGuests(newList);
    saveGuestsToStorage(newList);

    try {
      await sendInvitationEmail(guest);
      guest.emailSent = true;
      const updated = newList.map((g) => (g.id === id ? { ...g, emailSent: true } : g));
      setGuests(updated);
      saveGuestsToStorage(updated);
    } catch (err) {
      console.warn('Invitation email failed:', err);
    }

    return { success: true, guest };
  }, [guests]);

  const clearAllGuests = useCallback(() => {
    setGuests([]);
    saveGuestsToStorage([]);
  }, []);

  const sendReminderToAll = useCallback(async () => {
    let updated = [...guests];
    for (const guest of guests) {
      try {
        await sendReminderEmail(guest);
        updated = updated.map((g) =>
          g.id === guest.id ? { ...g, reminderSent: true } : g
        );
        setGuests(updated);
        saveGuestsToStorage(updated);
      } catch (err) {
        console.warn('Reminder email failed for', guest.email, err);
      }
    }
    return { success: true, count: guests.length };
  }, [guests]);

  return { guests, addGuest, sendReminderToAll, clearAllGuests };
};
