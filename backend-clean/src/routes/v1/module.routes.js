import express from 'express';
import { requireSession } from '../../middlewares/session.middleware.js';
import {
  getAllModulesController,
  getEnabledModulesController,
  enableModuleController,
  disableModuleController,
} from '../../controllers/v1/module.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Gestion des modules activables par l'utilisateur
 */

router.use(requireSession);

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Liste tous les modules disponibles dans le système
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des modules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   name: { type: string }
 *                   description: { type: string }
 */
router.get('/', getAllModulesController);

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
 *         description: Modules activés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   name: { type: string }
 */
router.get('/enabled', getEnabledModulesController);

/**
 * @swagger
 * /modules/{id}/enable:
 *   patch:
 *     summary: Active un module pour l'utilisateur connecté
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID du module à activer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module activé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 module:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *       404:
 *         description: Module non trouvé
 */
router.patch('/:id/enable', enableModuleController);

/**
 * @swagger
 * /modules/{id}/disable:
 *   patch:
 *     summary: Désactive un module pour l'utilisateur connecté
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID du module à désactiver
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module désactivé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 module:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *       404:
 *         description: Module non trouvé
 */
router.patch('/:id/disable', disableModuleController);

export default router;
