import prisma from '../utils/db.js';
import argon2 from 'argon2';
import { showError } from '../utils/showError.js';
import { updateUserProfile } from '../models/user.model.js';

/**
 * @route GET /users
 * @description Récupère tous les utilisateurs (admin uniquement)
 * @access Permission: "view_users"
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
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
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /users/:id
 * @description Récupère un utilisateur par son ID (admin uniquement)
 * @access Permission: "view_users"
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;
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
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route PATCH /users/:id
 * @description Met à jour un utilisateur (admin uniquement)
 * @access Permission: "edit_users" (+ "edit_user_roles" pour changer le rôle)
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, roleId } = req.body;

  try {
    // Vérifie si on tente de changer le rôle et qu'on n'a pas la permission
    if (
      roleId &&
      !req.user.role.permissions.includes('edit_user_roles') &&
      req.user.role.permissions.includes('edit_users') // évite les messages trompeurs
    ) {
      return res.status(403).json({ error: 'Modification du rôle interdite.' });
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
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route DELETE /users/:id
 * @description Supprime un utilisateur (admin uniquement)
 * @access Permission: "delete_users"
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /users/me
 * @description Récupère l'utilisateur connecté
 * @access Utilisateur
 */
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non connecté.' });
  }
  res.json({ user: req.user });
};

/**
 * @route PATCH /users/me
 * @description Met à jour le profil de l’utilisateur connecté
 * @access Utilisateur
 */
export const updateOwnProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non connecté.' });
  }

  try {
    const updated = await updateUserProfile(req.user.id, req.body);
    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route PATCH /users/password
 * @description Met à jour le mot de passe de l’utilisateur connecté
 * @access Utilisateur
 */
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non connecté.' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isValid = await argon2.verify(user.password, currentPassword);

    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });
    }

    const hashed = await argon2.hash(newPassword);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};
