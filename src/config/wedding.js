/**
 * Date du mariage (jour de l'événement, fuseau local navigateur pour J-7).
 * À ajuster si la date change.
 */
export const WEDDING_YEAR = 2026;
export const WEDDING_MONTH = 5; // 0 = janvier → 5 = juin
export const WEDDING_DAY = 27;

/** Date du mariage à minuit local (comparaisons « jour civil »). */
export function getWeddingDateStartOfDay() {
  const d = new Date(WEDDING_YEAR, WEDDING_MONTH, WEDDING_DAY);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Premier jour où le rappel auto J-7 est autorisé (7 jours avant le mariage). */
export function getAutoReminderStartDate() {
  const w = getWeddingDateStartOfDay();
  const t = new Date(w);
  t.setDate(t.getDate() - 7);
  return t;
}

/**
 * True si on est dans la fenêtre : du J-7 inclus jusqu'au jour avant le mariage inclus
 * (pas d'envoi auto le jour J ou après).
 */
export function isAutoReminderWindowActive() {
  const today = startOfToday();
  const start = getAutoReminderStartDate();
  const wedding = getWeddingDateStartOfDay();
  return today >= start && today < wedding;
}
