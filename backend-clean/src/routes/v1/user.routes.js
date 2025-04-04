import express from 'express'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateOwnProfile,
  updatePassword,
} from '../../controllers/v1/user.controller.js'
import { requireSession } from '../../middlewares/session.middleware.js'
import { hasPermission } from '../../middlewares/hasPermission.middleware.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (admin uniquement)
 */

// 🔐 Authentification requise pour toutes les routes
router.use(requireSession)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/', hasPermission('view_users'), getAllUsers)

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur (admin uniquement)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, roleId]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               roleId: { type: string }
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post('/', hasPermission('create_users'), createUser)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', hasPermission('view_users'), getUserById)

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Met à jour un utilisateur (admin uniquement)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               roleId: { type: string }
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */
router.patch('/:id', hasPermission('edit_users'), updateUser)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 */
router.delete('/:id', hasPermission('delete_users'), deleteUser)

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Met à jour le profil de l’utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address: { type: string }
 *               address2: { type: string }
 *               zipCode: { type: string }
 *               city: { type: string }
 *               country: { type: string }
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.patch('/me', updateOwnProfile)

/**
 * @swagger
 * /users/password:
 *   patch:
 *     summary: Change le mot de passe de l’utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.patch('/password', updatePassword)

export default router
