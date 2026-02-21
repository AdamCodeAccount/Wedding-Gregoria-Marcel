/**
 * Service d'envoi d'emails (invitation + rappel).
 * Utilise EmailJS si les variables d'environnement sont définies.
 *
 * Configuration .env :
 *   REACT_APP_EMAILJS_PUBLIC_KEY, REACT_APP_EMAILJS_SERVICE_ID,
 *   REACT_APP_EMAILJS_TEMPLATE_INVITATION, REACT_APP_EMAILJS_TEMPLATE_RAPPEL
 *
 * IMPORTANT - Dans chaque template EmailJS (dashboard) :
 *   - Syntaxe des variables : {{variable}} (double accolades uniquement, pas ${...})
 *   - Champ "To" : {{to_email}} ou {{email}}
 *   - Nom de l'invité (objet, corps, etc.) : {{name}} ou {{guest_name}}
 *   - Sujet : {{subject}}, Corps HTML : {{message}}
 *
 * Compte gratuit : https://www.emailjs.com/
 */

const getEmailJSAvailable = () => {
  const key = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  const service = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const tplInv = process.env.REACT_APP_EMAILJS_TEMPLATE_INVITATION;
  const tplRappel = process.env.REACT_APP_EMAILJS_TEMPLATE_RAPPEL;
  return !!(key && service && tplInv && tplRappel);
};

const invitationHtml = (guest) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(to bottom, #fff5f5, #fffbf0);">
    <div style="text-align: center; padding: 40px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 48px; color: #8b4513; margin: 0;">Gregoria & Marcel</h1>
      <p style="font-size: 18px; color: #666; margin: 20px 0;">Vous invitent à célébrer leur union</p>
      <div style="background: white; border: 2px solid #d4af37; border-radius: 10px; padding: 30px; margin: 30px 0;">
        <h2 style="color: #8b4513; margin-top: 0;">Cher(e) ${guest.name},</h2>
        <p style="color: #555; line-height: 1.6;">
          C'est avec une immense joie que nous vous invitons à partager le plus beau jour de notre vie.
        </p>
        <div style="background: #fff8dc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0; color: #8b4513;"><strong>Date:</strong> 15 Juin 2026</p>
          <p style="margin: 5px 0; color: #8b4513;"><strong>Heure:</strong> 15h00</p>
          <p style="margin: 5px 0; color: #8b4513;"><strong>Lieu:</strong> Château de la Belle Époque, Paris</p>
        </div>
        <p style="color: #555; line-height: 1.6;">Votre présence serait pour nous le plus précieux des cadeaux.</p>
      </div>
      <p style="color: #999; font-size: 14px; margin-top: 30px;">Avec tout notre amour,<br/>Gregoria & Marcel</p>
    </div>
  </div>
`;

const reminderHtml = (guest) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(to bottom, #fff5f5, #fffbf0);">
    <div style="text-align: center; padding: 40px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 42px; color: #8b4513; margin: 0;">Le Grand Jour Approche !</h1>
      <div style="background: white; border: 2px solid #d4af37; border-radius: 10px; padding: 30px; margin: 30px 0;">
        <h2 style="color: #8b4513;">Cher(e) ${guest.name},</h2>
        <p style="color: #555; line-height: 1.6; font-size: 16px;">
          Notre mariage aura lieu dans quelques semaines et nous avons hâte de célébrer ce moment avec vous !
        </p>
        <div style="background: #ffe4e1; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37;">
          <p style="margin: 8px 0; color: #8b4513; font-size: 16px;"><strong>Date:</strong> 15 Juin 2026</p>
          <p style="margin: 8px 0; color: #8b4513; font-size: 16px;"><strong>Heure:</strong> 15h00</p>
          <p style="margin: 8px 0; color: #8b4513; font-size: 16px;"><strong>Lieu:</strong> Château de la Belle Époque</p>
          <p style="margin: 8px 0; color: #8b4513; font-size: 16px;"><strong>Code vestimentaire:</strong> Élégant / Chic</p>
        </div>
      </div>
      <p style="color: #999; font-size: 14px; margin-top: 30px;">Nous avons hâte de vous retrouver !<br/>Gregoria & Marcel</p>
    </div>
  </div>
`;

// Paramètres envoyés à EmailJS. Dans le template (dashboard), utilisez UNIQUEMENT
// la syntaxe EmailJS : {{variable}} (double accolades). N'utilisez jamais ${...} (JavaScript).
// - Destinataire (champ To) : {{to_email}} ou {{email}}
// - Nom de l'invité : {{name}} ou {{guest_name}}
// - Sujet : {{subject}}, Corps HTML : {{message}}
const buildTemplateParams = (guest, subject, html) => {
  const email = (guest.email || '').trim();
  const name = (guest.name || '').trim();
  return {
    to_email: email,
    email: email,
    user_email: email,
    name: name,
    guest_name: name,
    subject: subject || '',
    message: html || ''
  };
};

export const sendInvitationEmail = async (guest) => {
  const subject = '💌 Invitation au Mariage de Gregoria & Marcel';
  const html = invitationHtml(guest);

  if (!getEmailJSAvailable()) {
    console.warn(
      '[Email] Envoi désactivé : configurez REACT_APP_EMAILJS_* dans .env. Invitation pour',
      guest.email
    );
    return { success: true };
  }

  const email = (guest.email || '').trim();
  if (!email) {
    console.error('[Email] Adresse invalide ou vide pour l\'invitation');
    throw new Error('Adresse email du destinataire vide');
  }

  try {
    const emailjs = (await import('@emailjs/browser')).default;
    await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_INVITATION,
      buildTemplateParams(guest, subject, html),
      { publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY }
    );
    return { success: true };
  } catch (err) {
    console.error('Erreur envoi invitation:', err);
    throw err;
  }
};

export const sendReminderEmail = async (guest) => {
  const subject = '⏰ Rappel - Mariage Gregoria & Marcel dans quelques semaines !';
  const html = reminderHtml(guest);

  if (!getEmailJSAvailable()) {
    console.warn('[Email] Envoi désactivé. Rappel pour', guest.email);
    return { success: true };
  }

  const email = (guest.email || '').trim();
  if (!email) {
    console.error('[Email] Adresse invalide ou vide pour le rappel');
    throw new Error('Adresse email du destinataire vide');
  }

  try {
    const emailjs = (await import('@emailjs/browser')).default;
    await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_RAPPEL,
      buildTemplateParams(guest, subject, html),
      { publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY }
    );
    return { success: true };
  } catch (err) {
    console.error('Erreur envoi rappel:', err);
    throw err;
  }
};
