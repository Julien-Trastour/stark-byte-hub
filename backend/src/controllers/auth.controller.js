import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
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

import prisma from '../utils/db.js';

/**
 * @route POST /auth/register
 * @access Public
 * @description Inscrit un nouvel utilisateur
 */
export const register = async (req, res) => {
  await new Promise((r) => setTimeout(r, 300)); // Protection anti-bruteforce

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
 * @access Public
 * @description Connecte un utilisateur via email et mot de passe
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];

  try {
    const user = await findUserByEmail(email);
    let success = false;

    if (user?.password) {
      const valid = await argon2.verify(user.password, password);
      success = valid;
    }

    // Log de la tentative (succès ou échec)
    await prisma.loginLog.create({
      data: {
        email,
        success,
        ip,
        userAgent,
        userId: success ? user.id : null,
      },
    });

    if (!success) {
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
 * @access Utilisateur connecté
 * @description Déconnecte l’utilisateur (supprime le cookie JWT)
 */
export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Déconnecté avec succès.' });
};

/**
 * @route PATCH /auth/profile
 * @access Utilisateur connecté
 * @description Met à jour le profil utilisateur (informations facultatives)
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
 * @access Public
 * @description Envoie un lien de réinitialisation de mot de passe
 */
export const forgotPassword = async (req, res) => {
  await new Promise((r) => setTimeout(r, 300)); // Délai anti-bruteforce

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis.' });

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.json({ message: 'Si l’adresse existe, un email a été envoyé.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

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
 * @access Public
 * @description Réinitialise le mot de passe via un token sécurisé
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
