import express from 'express';
import {
  getLoginLogs,
  deleteAllLoginLogs,
  deleteLoginLogById,
  getLoginLogsStats,
} from '../controllers/log.controller.js';
import { requireSession } from '../middlewares/session.middleware.js';
import { hasPermission } from '../middlewares/hasPermission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Accès aux journaux système (admin uniquement)
 */

// Middleware global : session requise
router.use(requireSession);

/**
 * @swagger
 * /logs/login:
 *   get:
 *     summary: Liste les connexions réussies des utilisateurs
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *       - in: query
 *         name: ip
 *         schema:
 *           type: string
 *         description: Adresse IP à filtrer
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début (ISO 8601)
 *       - in: query
 *         name: until
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin (ISO 8601)
 *     responses:
 *       200:
 *         description: Liste des connexions
 *       403:
 *         description: Accès refusé
 */
router.get('/login', hasPermission('logs:view'), getLoginLogs);

/**
 * @swagger
 * /logs/stats:
 *   get:
 *     summary: Statistiques sur les connexions utilisateurs
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des connexions
 *       403:
 *         description: Accès refusé
 */
router.get('/stats', hasPermission('logs:view'), getLoginLogsStats);

/**
 * @swagger
 * /logs/login:
 *   delete:
 *     summary: Supprime tous les logs de connexion
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tous les logs ont été supprimés
 *       403:
 *         description: Accès refusé
 */
router.delete('/login', hasPermission('logs:manage'), deleteAllLoginLogs);

/**
 * @swagger
 * /logs/login/{id}:
 *   delete:
 *     summary: Supprime un log de connexion par ID
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du log à supprimer
 *     responses:
 *       204:
 *         description: Log supprimé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Log non trouvé
 */
router.delete('/login/:id', hasPermission('logs:manage'), deleteLoginLogById);

export default router;
