import express from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/role.controller.js';
import { requireSession } from '../middlewares/session.middleware.js';
import { hasPermission } from '../middlewares/hasPermission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestion des rôles et permissions
 */

router.use(requireSession);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Liste tous les rôles
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des rôles
 *       403:
 *         description: Permission refusée
 */
router.get('/', hasPermission('view_roles'), getAllRoles);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Récupère un rôle par ID
 *     tags: [Roles]
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
 *         description: Rôle trouvé
 *       403:
 *         description: Permission refusée
 *       404:
 *         description: Rôle introuvable
 */
router.get('/:id', hasPermission('view_roles'), getRoleById);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crée un nouveau rôle
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, permissions]
 *             properties:
 *               name: { type: string }
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Rôle créé
 *       403:
 *         description: Permission refusée
 */
router.post('/', hasPermission('create_role'), createRole);

/**
 * @swagger
 * /roles/{id}:
 *   patch:
 *     summary: Met à jour un rôle
 *     tags: [Roles]
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
 *               name: { type: string }
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *       403:
 *         description: Permission refusée
 *       404:
 *         description: Rôle introuvable
 */
router.patch('/:id', hasPermission('edit_roles'), updateRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Supprime un rôle
 *     tags: [Roles]
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
 *         description: Rôle supprimé
 *       403:
 *         description: Permission refusée
 *       404:
 *         description: Rôle introuvable
 */
router.delete('/:id', hasPermission('delete_roles'), deleteRole);

export default router;
