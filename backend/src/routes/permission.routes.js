import express from "express";
import {
  getPermissionsController,
  getPermissionController,
  createPermissionController,
  updatePermissionController,
  deletePermissionController,
} from "../controllers/permission.controller.js";
import { requireSession } from "../middlewares/session.middleware.js";
import { hasPermission } from "../middlewares/hasPermission.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Gestion des permissions (admin uniquement)
 */

// 🔒 Toutes les routes nécessitent une session utilisateur
router.use(requireSession);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Récupère toutes les permissions (requiert "view_permissions")
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des permissions
 */
router.get("/", hasPermission("view_permissions"), getPermissionsController);

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Récupère une permission par ID (requiert "view_permissions")
 *     tags: [Permissions]
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
 *         description: Permission trouvée
 *       404:
 *         description: Permission non trouvée
 */
router.get("/:id", hasPermission("view_permissions"), getPermissionController);

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Crée une nouvelle permission (requiert "create_permission")
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
 *     responses:
 *       201:
 *         description: Permission créée
 *       400:
 *         description: Données invalides
 */
router.post("/", hasPermission("create_permission"), createPermissionController);

/**
 * @swagger
 * /permissions/{id}:
 *   patch:
 *     summary: Met à jour une permission par ID (requiert "edit_permission")
 *     tags: [Permissions]
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission mise à jour
 *       404:
 *         description: Permission non trouvée
 */
router.patch("/:id", hasPermission("edit_permission"), updatePermissionController);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Supprime une permission par ID (requiert "delete_permission")
 *     tags: [Permissions]
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
 *         description: Permission supprimée
 *       404:
 *         description: Permission non trouvée
 */
router.delete("/:id", hasPermission("delete_permission"), deletePermissionController);

export default router;
