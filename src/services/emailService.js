/**
 * Service d'envoi d'emails (invitation + rappel).
 * Utilise EmailJS si les variables d'environnement sont définies.
 *
 * Configuration .env :
 *   REACT_APP_EMAILJS_PUBLIC_KEY, REACT_APP_EMAILJS_SERVICE_ID,
 *   REACT_APP_EMAILJS_TEMPLATE_INVITATION, REACT_APP_EMAILJS_TEMPLATE_RAPPEL
 *   REACT_APP_SITE_URL (optionnel) - URL du site en production pour les images dans les emails
 *
 * IMPORTANT - Dans chaque template EmailJS (dashboard) :
 *   - Syntaxe des variables : {{variable}} (double accolades uniquement, pas ${...})
 *   - Champ "To" : {{to_email}} ou {{email}}
 *   - Nom de l'invité (objet, corps, etc.) : {{name}} ou {{guest_name}}
 *   - Sujet : {{subject}}, Corps HTML : {{message}}
 *
 * Compte gratuit : https://www.emailjs.com/
 */

const getSiteBaseUrl = () => {
  if (process.env.REACT_APP_SITE_URL) return process.env.REACT_APP_SITE_URL;
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return '';
};

const getCoupleImageUrl = (filename) => {
  const base = getSiteBaseUrl();
  return base ? `${base}/img/couple/${filename}` : '';
};

const getEmailJSAvailable = () => {
  const key = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  const service = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const tplInv = process.env.REACT_APP_EMAILJS_TEMPLATE_INVITATION;
  const tplRappel = process.env.REACT_APP_EMAILJS_TEMPLATE_RAPPEL;
  return !!(key && service && tplInv && tplRappel);
};

const invitationHtml = (guest) => {
  const coupleImgUrl = getCoupleImageUrl('couple-3.jpg');
  const imgBlock = coupleImgUrl
    ? `<img src="${coupleImgUrl}" alt="Gregoria & Marcel" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto 32px; border: 2px solid #D4AF37; border-radius: 4px;" />`
    : '';

  return `
  <div style="font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5;">
    <div style="padding: 48px 32px; text-align: center;">
      <div style="border-bottom: 1px solid rgba(212, 175, 55, 0.5); padding-bottom: 24px; margin-bottom: 32px;">
        <h1 style="font-family: 'Cinzel', Georgia, serif; font-size: 36px; color: #D4AF37; margin: 0 0 8px 0; letter-spacing: 0.1em;">Gregoria & Marcel</h1>
        <p style="font-size: 14px; letter-spacing: 0.3em; color: rgba(212, 175, 55, 0.9); margin: 0;">27 JUIN 2026</p>
      </div>
      ${imgBlock}
      <div style="background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(212, 175, 55, 0.4); padding: 36px 28px; margin: 0 0 32px 0; text-align: left;">
        <h2 style="font-family: 'Cinzel', Georgia, serif; color: #D4AF37; font-size: 20px; margin: 0 0 20px 0;">Cher(e) ${guest.name},</h2>
        <p style="color: #c4c4c4; line-height: 1.8; font-size: 15px; margin: 0 0 24px 0;">
          C'est avec une immense joie que nous vous invitons à partager le plus beau jour de notre vie.
        </p>
        <div style="background: rgba(212, 175, 55, 0.08); border-left: 4px solid #D4AF37; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; color: #e5e5e5; font-size: 15px;"><strong style="color: #D4AF37;">Date</strong> — 27 Juin 2026 à 15h00</p>
          <p style="margin: 0 0 12px 0; color: #e5e5e5; font-size: 15px;"><strong style="color: #D4AF37;">Lieu</strong> — Le Château Sainte-Agnès, Sutton (Québec)</p>
          <p style="margin: 0; color: #e5e5e5; font-size: 15px;"><strong style="color: #D4AF37;">Programme</strong> — Cérémonie 16h · Cocktail 17h · Dîner 19h · Soirée</p>
        </div>
        <p style="color: #c4c4c4; line-height: 1.8; font-size: 15px; margin: 0;">
          Votre présence serait pour nous le plus précieux des cadeaux. Dress code : élégance romantique, couleurs douces et estivales.
        </p>
      </div>
      <p style="font-family: 'Cinzel', Georgia, serif; color: #D4AF37; font-size: 16px; margin: 0;">Avec tout notre amour,</p>
      <p style="font-family: 'Cinzel', Georgia, serif; color: #D4AF37; font-size: 18px; font-weight: 600; margin: 8px 0 0 0;">Gregoria & Marcel</p>
    </div>
  </div>
`;
};

const reminderHtml = (guest) => `
  <div style="font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5;">
    <div style="padding: 48px 32px; text-align: center;">
      <div style="border-bottom: 1px solid rgba(212, 175, 55, 0.5); padding-bottom: 24px; margin-bottom: 32px;">
        <h1 style="font-family: 'Cinzel', Georgia, serif; font-size: 32px; color: #D4AF37; margin: 0 0 8px 0; letter-spacing: 0.05em;">Le Grand Jour Approche</h1>
        <p style="font-size: 14px; letter-spacing: 0.3em; color: rgba(212, 175, 55, 0.9); margin: 0;">27 JUIN 2026</p>
      </div>
      <div style="background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(212, 175, 55, 0.4); padding: 36px 28px; margin: 0 0 32px 0; text-align: left;">
        <h2 style="font-family: 'Cinzel', Georgia, serif; color: #D4AF37; font-size: 20px; margin: 0 0 20px 0;">Cher(e) ${guest.name},</h2>
        <p style="color: #c4c4c4; line-height: 1.8; font-size: 15px; margin: 0 0 24px 0;">
          Notre mariage aura lieu dans quelques semaines et nous avons hâte de célébrer ce moment avec vous !
        </p>
        <div style="background: rgba(212, 175, 55, 0.08); border-left: 4px solid #D4AF37; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; color: #e5e5e5; font-size: 15px;"><strong style="color: #D4AF37;">Date</strong> — 27 Juin 2026 à 15h00</p>
          <p style="margin: 0 0 12px 0; color: #e5e5e5; font-size: 15px;"><strong style="color: #D4AF37;">Lieu</strong> — Le Château Sainte-Agnès, Sutton (Québec)</p>
          <p style="margin: 0 0 12px 0; color: #e5e5e5; font-size: 15px;"><strong style="color: #D4AF37;">Programme</strong> — Cérémonie 16h · Cocktail 17h · Dîner 19h · Soirée</p>
          <p style="margin: 0; color: #e5e5e5; font-size: 15px;"><strong style="color: #D4AF37;">Dress code</strong> — Élégance romantique, couleurs douces et estivales</p>
        </div>
      </div>
      <p style="font-family: 'Cinzel', Georgia, serif; color: #D4AF37; font-size: 16px; margin: 0;">Nous avons hâte de vous retrouver !</p>
      <p style="font-family: 'Cinzel', Georgia, serif; color: #D4AF37; font-size: 18px; font-weight: 600; margin: 8px 0 0 0;">Gregoria & Marcel</p>
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
