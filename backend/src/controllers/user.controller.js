import prisma from '../utils/db.js';
import argon2 from 'argon2';
import { showError } from '../utils/showError.js';
import { updateUserProfile } from '../models/user.model.js';

/**
 * @route GET /users
 * @description Récupère tous les utilisateurs (admin uniquement)
 * @access Admin
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
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
 * @access Admin
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
        role: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route PUT /users/:id
 * @description Met à jour un utilisateur (admin uniquement)
 * @access Admin
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, roleId } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        role: roleId ? { connect: { id: roleId } } : undefined,
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
 * @access Admin
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
