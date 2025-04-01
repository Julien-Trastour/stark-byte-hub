import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import { showError } from './showError.js';
import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envoie un email via Nodemailer
 * @param {string} to - destinataire
 * @param {string} subject - sujet de l’email
 * @param {string} html - contenu HTML
 * @param {object} headers - en-têtes additionnels (facultatif)
 */
export const sendMail = async (to, subject, html, headers = {}) => {
  try {
    return await transporter.sendMail({
      from: `"Stark Byte Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      headers,
    });
  } catch (err) {
    console.error('Erreur lors de l’envoi du mail :', showError(err));
    throw new Error('Échec de l’envoi de l’email.');
  }
};
