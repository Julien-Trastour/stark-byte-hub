import nodemailer from 'nodemailer';
import { showError } from './showError.js';

/**
 * Transporteur SMTP configuré à partir des variables d’environnement
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envoie un email via Nodemailer
 * 
 * @param {string} to - Destinataire de l’email
 * @param {string} subject - Sujet de l’email
 * @param {string} html - Contenu HTML de l’email
 * @param {object} [headers={}] - En-têtes personnalisés
 * @returns {Promise<object>} Résultat de l’envoi
 */
export const sendMail = async (to, subject, html, headers = {}) => {
  if (!to || !subject || !html) {
    throw new Error('Paramètres requis manquants pour l’envoi d’email.');
  }

  try {
    return await transporter.sendMail({
      from: `"Stark Byte Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, ''),
      headers,
    });
  } catch (err) {
    console.error('Erreur lors de l’envoi du mail :', showError(err));
    throw new Error('Échec de l’envoi de l’email.');
  }
};
