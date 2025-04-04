/**
 * @file Génère le contenu d’email HTML en fonction du type
 * @module utils/emailTemplate
 */

/**
 * En-têtes par défaut pour tous les emails
 */
const defaultHeaders = {
  'List-Unsubscribe': '<mailto:support@stark-byte.com>',
};

/**
 * Enveloppe HTML stylisée pour tous les emails
 * @param {string} title - Titre affiché dans le contenu
 * @param {string} content - Contenu HTML principal
 * @returns {string} - HTML complet
 */
const baseHtml = (title, content) => `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #1e1e1e; padding: 20px; border-radius: 8px; border-left: 4px solid #00aaff;">
      <img src="https://stark-byte.com/logo.png" alt="Stark Byte Logo" style="height: 40px; margin-bottom: 20px;" />
      <h1 style="color: #00aaff;">${title}</h1>
      <div style="font-size: 14px; line-height: 1.6;">
        ${content}
      </div>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #2a2a2a;" />
      <p style="font-size: 12px; color: #888;">Cet email vous a été envoyé par <strong>Stark Byte Hub</strong>.</p>
      <p style="font-size: 12px; color: #888;">Si vous n’êtes pas à l’origine de cette action, vous pouvez ignorer ce message.</p>
    </div>
  </body>
  </html>
`;

/**
 * Génère le sujet, contenu HTML et headers pour un type d’email
 *
 * @param {string} type - Type d’email : "resetPassword", "welcome", etc.
 * @param {object} [data={}] - Données spécifiques au template
 * @returns {{ subject: string, html: string, headers: object }}
 */
export const getEmailTemplate = (type, data = {}) => {
  const firstName = data.firstName || 'utilisateur';

  switch (type) {
    case 'resetPassword':
      return {
        subject: 'Réinitialisation de votre mot de passe',
        html: baseHtml(
          'Réinitialisation de mot de passe',
          `
            <p>Bonjour ${firstName},</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez ci-dessous :</p>
            <p><a href="${encodeURI(data.resetLink)}" style="color: #00aaff;">Réinitialiser mon mot de passe</a></p>
            <p><strong>Ce lien est valable 30 minutes.</strong></p>
          `
        ),
        headers: defaultHeaders,
      };

    case 'welcome':
      return {
        subject: 'Bienvenue sur Stark Byte Hub !',
        html: baseHtml(
          'Bienvenue dans Stark Byte Hub',
          `
            <p>Bonjour ${firstName},</p>
            <p>Bienvenue dans l’univers Stark Byte. Nous sommes ravis de vous compter parmi nous !</p>
            <p>Explorez, configurez vos robots, et amusez-vous 🕹️</p>
          `
        ),
        headers: defaultHeaders,
      };

    default:
      return {
        subject: 'Notification',
        html: baseHtml('Notification', '<p>Message non défini.</p>'),
        headers: defaultHeaders,
      };
  }
};
