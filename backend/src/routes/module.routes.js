import express from 'express';
import { requireSession } from '../middlewares/session.middleware.js';
import { ModuleController } from '../controllers/module.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Gestion des modules utilisateur
 */

// 🔒 Toutes les routes nécessitent une session valide
router.use(requireSession);

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Liste tous les modules disponibles
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des modules disponibles
 */
router.get('/', ModuleController.getAll);

/**
 * @swagger
 * /modules/enabled:
 *   get:
 *     summary: Liste des modules activés pour l'utilisateur connecté
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des modules activés
 */
router.get('/enabled', ModuleController.getEnabledForUser);

/**
 * @swagger
 * /modules/{id}/enable:
 *   patch:
 *     summary: Active un module pour l'utilisateur
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du module à activer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module activé
 */
router.patch('/:id/enable', ModuleController.enable);

/**
 * @swagger
 * /modules/{id}/disable:
 *   patch:
 *     summary: Désactive un module pour l'utilisateur
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du module à désactiver
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module désactivé
 */
router.patch('/:id/disable', ModuleController.disable);

export default router;
