import argon2 from 'argon2'
import crypto from 'node:crypto'
import { showError } from '../../utils/showError.js'
import { sendMail } from '../../utils/mailer.js'
import { getEmailTemplate } from '../../utils/emailTemplates.js'

import {
  findUserByEmail,
  findUserById,
  getAllUsers as getAllUsersFromModel,
  updateUserProfile,
  updateUserPassword,
  deleteUser as deleteUserById
} from '../../models/v1/user.model.js'

import { logAudit } from '../../models/v1/log.model.js'

/**
 * @route GET /users
 * @desc Récupère tous les utilisateurs (admin uniquement)
 * @access Permission: "view_users"
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromModel()
    const formatted = users.map((user) => ({
      ...user,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /users/:id
 * @desc Récupère un utilisateur par ID
 * @access Permission: "view_users"
 */
export const getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await findUserById(id)
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' })
    res.json({
      ...user,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
    })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /users
 * @desc Crée un nouvel utilisateur (admin uniquement)
 * @access Permission: "create_users"
 */
export const createUser = async (req, res) => {
  const { firstName, lastName, email, roleId } = req.body

  try {
    if (!firstName || !lastName || !email || !roleId) {
      return res.status(400).json({ error: 'Champs requis manquants.' })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' })
    }

    const generatedPassword = crypto.randomBytes(8).toString('base64')
    const hashedPassword = await argon2.hash(generatedPassword)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: { connect: { id: roleId } },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const { subject, html, headers } = getEmailTemplate('welcome', {
      firstName: user.firstName,
      password: generatedPassword,
    })

    sendMail(user.email, subject, html, headers).catch((err) => {
      console.error("Erreur lors de l'envoi de l'email de bienvenue :", err)
    })

    await logAudit(req.user.id, 'user_created', { userId: user.id })

    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /users/:id
 * @desc Met à jour un utilisateur (admin uniquement)
 * @access Permission: "edit_users" (+ "edit_user_roles" si rôle modifié)
 */
export const updateUser = async (req, res) => {
  const { id } = req.params
  const { firstName, lastName, email, roleId } = req.body

  try {
    if (
      roleId &&
      !req.user.role.permissions.includes('edit_user_roles') &&
      req.user.role.permissions.includes('edit_users')
    ) {
      return res.status(403).json({ error: 'Modification du rôle interdite.' })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        role: roleId ? { connect: { id: roleId } } : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    await logAudit(req.user.id, 'user_updated', { targetId: id })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /users/:id
 * @desc Supprime un utilisateur (admin uniquement)
 * @access Permission: "delete_users"
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    await deleteUserById(id)
    await logAudit(req.user.id, 'user_deleted', { targetId: id })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /users/me
 * @desc Met à jour le profil de l’utilisateur connecté
 * @access Utilisateur connecté
 */
export const updateOwnProfile = async (req, res) => {
  try {
    const updated = await updateUserProfile(req.user.id, req.body)
    await logAudit(req.user.id, 'profile_updated', { fields: Object.keys(req.body) })
    res.json({ user: updated })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /users/password
 * @desc Met à jour le mot de passe de l’utilisateur connecté
 * @access Utilisateur connecté
 */
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis.' })
  }

  try {
    const user = await findUserById(req.user.id)
    const isValid = await argon2.verify(user.password, currentPassword)

    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect.' })
    }

    const hashed = await argon2.hash(newPassword)
    await updateUserPassword(user.id, hashed)

    await logAudit(user.id, 'password_changed')

    res.json({ message: 'Mot de passe mis à jour avec succès.' })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
