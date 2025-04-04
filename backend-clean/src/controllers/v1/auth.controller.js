import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { showError } from '../../utils/showError.js'
import { sendMail } from '../../utils/mailer.js'
import { getEmailTemplate } from '../../utils/emailTemplates.js'

import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
  updateUserProfile
} from '../../models/v1/user.model.js'

import {
  createResetToken,
  findResetToken,
  deleteResetToken
} from '../../models/v1/resetToken.model.js'

import {
  logLoginAttempt,
  logAudit
} from '../../models/v1/log.model.js'

/**
 * 🔁 Récupère un utilisateur complet avec rôle + permissions
 * @param {string} userId
 */
const getFullUser = async (userId) => {
  const user = await findUserById(userId)
  return {
    ...user,
    role: {
      ...user.role,
      permissions: user.role.permissions.map((p) => p.name),
    },
  }
}

/**
 * @route POST /auth/register
 * @access Public
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
    } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Champs requis manquants.' })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' })
    }

    const hashedPassword = await argon2.hash(password)

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
    })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    const fullUser = await getFullUser(user.id)

    await logAudit(user.id, 'register')

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ user: fullUser })

    const { subject, html, headers } = getEmailTemplate('welcome', {
      firstName: user.firstName,
    })

    sendMail(email, subject, html, headers).catch((err) => {
      console.error("Erreur lors de l'envoi de l'email de bienvenue :", err)
    })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /auth/login
 * @access Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body
  const ip = req.ip
  const userAgent = req.headers['user-agent']

  try {
    const user = await findUserByEmail(email)
    let success = false

    if (user?.password) {
      const valid = await argon2.verify(user.password, password)
      success = valid
    }

    await logLoginAttempt(email, success, ip, userAgent, success ? user.id : null)

    if (!success) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide.' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    const fullUser = await getFullUser(user.id)

    await logAudit(user.id, 'login', { ip, userAgent })

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ user: fullUser })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /auth/logout
 * @access Privé
 */
export const logout = async (req, res) => {
  await logAudit(req.user.id, 'logout')
  res.clearCookie('token').json({ message: 'Déconnecté avec succès.' })
}

/**
 * @route GET /auth/me
 * @access Privé
 */
export const getMe = async (req, res) => {
  try {
    const fullUser = await getFullUser(req.user.id)
    res.json(fullUser)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /auth/profile
 * @access Privé
 */
export const updateProfile = async (req, res) => {
  try {
    await updateUserProfile(req.user.id, req.body)
    await logAudit(req.user.id, 'profile_updated', { fields: Object.keys(req.body) })
    const refreshedUser = await getFullUser(req.user.id)
    res.json({ user: refreshedUser })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /auth/password
 * @access Privé
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  try {
    const user = await findUserById(req.user.id)
    const valid = await argon2.verify(user.password, currentPassword)

    if (!valid) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect.' })
    }

    const hashed = await argon2.hash(newPassword)
    await updateUserPassword(user.id, hashed)
    await logAudit(user.id, 'password_changed')

    res.json({ message: 'Mot de passe mis à jour.' })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) return res.status(400).json({ error: 'Email requis.' })

  try {
    const user = await findUserByEmail(email)
    if (!user) {
      return res.json({ message: 'Si l’adresse existe, un email a été envoyé.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30)

    await createResetToken(user.id, token, expiresAt)

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    const { subject, html, headers } = getEmailTemplate('resetPassword', {
      firstName: user.firstName,
      resetLink,
    })

    sendMail(email, subject, html, headers).catch((err) => {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation :", err)
    })

    res.json({ message: 'Si l’adresse existe, un email a été envoyé.' })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token et mot de passe requis.' })
  }

  try {
    const reset = await findResetToken(token)
    if (!reset || reset.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Lien expiré ou invalide.' })
    }

    const hashed = await argon2.hash(newPassword)
    await updateUserPassword(reset.userId, hashed)
    await deleteResetToken(token)
    await logAudit(reset.userId, 'password_reset')

    res.json({ message: 'Mot de passe mis à jour avec succès.' })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
