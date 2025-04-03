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
 * 🔁 Récupère un utilisateur complet avec rôle + permissions (en string[])
 * @param {string} userId
 */
const getFullUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      address: true,
      address2: true,
      zipCode: true,
      city: true,
      country: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: { name: true },
          },
        },
      },
    },
  });

  return {
    ...user,
    role: {
      ...user.role,
      permissions: user.role.permissions.map((p) => p.name),
    },
  };
};

/**
 * @route POST /auth/register
 * @access Public
 */
export const register = async (req, res) => {
  await new Promise((r) => setTimeout(r, 300));

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

    const fullUser = await getFullUser(user.id);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ user: fullUser });

    const { subject, html, headers } = getEmailTemplate('welcome', {
      firstName: user.firstName,
    });

    sendMail(email, subject, html, headers).catch((err) => {
      console.error("Erreur lors de l'envoi de l'email de bienvenue :", err);
    });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /auth/login
 * @access Public
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

    const fullUser = await getFullUser(user.id);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ user: fullUser });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /auth/logout
 * @access Privé
 */
export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Déconnecté avec succès.' });
};

/**
 * @route PATCH /auth/profile
 * @access Privé
 */
export const updateProfile = async (req, res) => {
  try {
    const updated = await updateUserProfile(req.user.id, req.body);
    const refreshedUser = await getFullUser(req.user.id);
    res.json({ user: refreshedUser });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  await new Promise((r) => setTimeout(r, 300));
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email requis.' });

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.json({ message: 'Si l’adresse existe, un email a été envoyé.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await createResetToken(user.id, token, expiresAt);

    res.json({ message: 'Si l’adresse existe, un email a été envoyé.' });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const { subject, html, headers } = getEmailTemplate('resetPassword', {
      firstName: user.firstName,
      resetLink,
    });

    sendMail(email, subject, html, headers).catch((err) => {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation :", err);
    });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /auth/reset-password
 * @access Public
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
