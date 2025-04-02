import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  updateOwnProfile,
  updatePassword,
} from '../controllers/user.controller.js';
import { requireSession } from '../middlewares/session.middleware.js';
import { hasPermission } from '../middlewares/hasPermission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

router.use(requireSession);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupère les infos de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Infos utilisateur récupérées
 *       401:
 *         description: Non autorisé
 */
router.get('/me', getMe);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               address: { type: string }
 *               address2: { type: string }
 *               zipCode: { type: string }
 *               city: { type: string }
 *               country: { type: string }
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non autorisé
 */
router.patch('/me', updateOwnProfile);

/**
 * @swagger
 * /users/password:
 *   patch:
 *     summary: Met à jour le mot de passe de l'utilisateur connecté
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
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 */
router.patch('/password', updatePassword);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs (requiert la permission "view_users")
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       403:
 *         description: Permission refusée
 */
router.get('/', hasPermission('view_users'), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID (requiert la permission "view_users")
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 *       403:
 *         description: Permission refusée
 */
router.get('/:id', hasPermission('view_users'), getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Met à jour un utilisateur par ID (requiert la permission "edit_users")
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
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
 *       404:
 *         description: Utilisateur non trouvé
 *       403:
 *         description: Permission refusée
 */
router.patch('/:id', hasPermission('edit_users'), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par ID (requiert la permission "delete_users")
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 *       403:
 *         description: Permission refusée
 */
router.delete('/:id', hasPermission('delete_users'), deleteUser);

export default router;
