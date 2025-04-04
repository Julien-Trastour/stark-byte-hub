import express from "express";
import {
  getPermissionsController,
  getPermissionController,
  createPermissionController,
  updatePermissionController,
  deletePermissionController,
} from "../../controllers/v1/permission.controller.js";
import { requireSession } from "../../middlewares/session.middleware.js";
import { hasPermission } from "../../middlewares/hasPermission.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Gestion des permissions (admin uniquement)
 */

router.use(requireSession);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Liste toutes les permissions
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des permissions
 *       403:
 *         description: Permission refusée
 */
router.get("/", hasPermission("view_permissions"), getPermissionsController);

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Détail d’une permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la permission
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission trouvée
 *       403:
 *         description: Permission refusée
 *       404:
 *         description: Permission introuvable
 */
router.get("/:id", hasPermission("view_permissions"), getPermissionController);

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Crée une nouvelle permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom unique de la permission
 *     responses:
 *       201:
 *         description: Permission créée avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Permission refusée
 */
router.post("/", hasPermission("create_permission"), createPermissionController);

/**
 * @swagger
 * /permissions/{id}:
 *   patch:
 *     summary: Met à jour une permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la permission
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de la permission
 *     responses:
 *       200:
 *         description: Permission mise à jour
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Permission refusée
 *       404:
 *         description: Permission introuvable
 */
router.patch("/:id", hasPermission("edit_permission"), updatePermissionController);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Supprime une permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la permission
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Permission supprimée
 *       403:
 *         description: Permission refusée
 *       404:
 *         description: Permission introuvable
 */
router.delete("/:id", hasPermission("delete_permission"), deletePermissionController);

export default router;
