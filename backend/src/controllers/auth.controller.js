import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { showError } from '../utils/showError.js';
import { sendMail } from '../utils/mailer.js';
import { getEmailTemplate } from '../utils/emailTemplates.js';

import {
  findUserByEmail,
  createUser,
  updateUserPassword,
  updateUserProfile,
} from '../models/user.model.js';

import {
  createResetToken,
  findResetToken,
  deleteResetToken,
} from '../models/resetToken.model.js';

/**
 * @route POST /auth/register
 */
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      address,
      address2,
      zipCode,
      city,
      country,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await argon2.hash(password);

    const user = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      address,
      address2,
      zipCode,
      city,
      country,
    });

    // Répondre avant d’envoyer l’email
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ user });

    // Envoi de l’email de bienvenue en arrière-plan
    const { subject, html, headers } = getEmailTemplate('welcome', {
      firstName: user.firstName,
    });
    sendMail(email, subject, html, headers).catch((err) => {
      console.error('Erreur lors de l’envoi de l’email de bienvenue :', err);
    });

  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide.' });
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ user });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /auth/logout
 */
export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Déconnecté avec succès.' });
};

/**
 * @route PATCH /auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const updated = await updateUserProfile(req.user.id, req.body);
    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis.' });

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      // On renvoie quand même un message générique
      return res.json({ message: 'Si l’adresse existe, un email a été envoyé.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await createResetToken(user.id, token, expiresAt);

    res.json({ message: 'Si l’adresse existe, un email a été envoyé.' });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const { subject, html, headers } = getEmailTemplate('resetPassword', {
      firstName: user.firstName,
      resetLink,
    });

    sendMail(email, subject, html, headers).catch((err) => {
      console.error('Erreur lors de l’envoi de l’email de réinitialisation :', err);
    });

  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /auth/reset-password
 */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token et mot de passe requis.' });
  }

  try {
    const reset = await findResetToken(token);
    if (!reset || reset.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Lien expiré ou invalide.' });
    }

    const hashed = await argon2.hash(newPassword);
    await updateUserPassword(reset.userId, hashed);
    await deleteResetToken(token);

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};
