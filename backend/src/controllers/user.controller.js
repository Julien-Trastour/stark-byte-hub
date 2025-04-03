import prisma from '../utils/db.js'
import argon2 from 'argon2'
import crypto from 'node:crypto'
import { showError } from '../utils/showError.js'
import { sendMail } from '../utils/mailer.js'
import { getEmailTemplate } from '../utils/emailTemplates.js'
import { updateUserProfile } from '../models/user.model.js'

/**
 * @route GET /users
 * @description Récupère tous les utilisateurs (admin uniquement)
 * @access Permission: "view_users"
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /users/:id
 * @description Récupère un utilisateur par son ID (admin uniquement)
 * @access Permission: "view_users"
 */
const getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /users
 * @description Crée un utilisateur (admin uniquement)
 * @access Permission: "create_users"
 */
const createUser = async (req, res) => {
  const { firstName, lastName, email, roleId } = req.body

  try {
    if (!firstName || !lastName || !email || !roleId) {
      return res.status(400).json({ error: 'Champs requis manquants.' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
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

    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /users/:id
 * @description Met à jour un utilisateur (admin uniquement)
 * @access Permission: "edit_users" (+ "edit_user_roles" pour changer le rôle)
 */
const updateUser = async (req, res) => {
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
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /users/:id
 * @description Supprime un utilisateur (admin uniquement)
 * @access Permission: "delete_users"
 */
const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.user.delete({ where: { id } })
    res.json({ message: 'Utilisateur supprimé avec succès.' })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /users/me
 * @description Récupère l'utilisateur connecté
 * @access Utilisateur
 */
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non connecté.' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
    })

    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' })

    const formattedUser = {
      ...user,
      role: {
        ...user.role,
        permissions: user.role.permissions.map((p) => p.name),
      },
    }

    res.json({ user: formattedUser })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /users/me
 * @description Met à jour le profil de l’utilisateur connecté
 * @access Utilisateur
 */
const updateOwnProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non connecté.' })
  }

  try {
    const updated = await updateUserProfile(req.user.id, req.body)
    res.json({ user: updated })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /users/password
 * @description Met à jour le mot de passe de l’utilisateur connecté
 * @access Utilisateur
 */
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non connecté.' })
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis.' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    const isValid = await argon2.verify(user.password, currentPassword)

    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect.' })
    }

    const hashed = await argon2.hash(newPassword)

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    })

    res.json({ message: 'Mot de passe mis à jour avec succès.' })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateOwnProfile,
  updatePassword,
}
