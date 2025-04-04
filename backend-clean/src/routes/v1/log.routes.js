import express from 'express';
import {
  getLoginLogs,
  getLoginLogsStats,
  deleteAllLoginLogs,
  deleteLoginLogById,
  getAuditLogs,
  getAuditLogById,
  deleteAllAuditLogs,
  deleteAuditLogById,
  getRobotLogs,
  getRobotLogById,
  deleteAllRobotLogs,
  deleteRobotLogById,
} from '../../controllers/v1/log.controller.js';
import { requireSession } from '../../middlewares/session.middleware.js';
import { hasPermission } from '../../middlewares/hasPermission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Accès aux journaux système (connexion, audit, robot)
 */

// 🔐 Toutes les routes nécessitent une session active
router.use(requireSession);

// === Connexions ===

/**
 * @swagger
 * /logs/login:
 *   get:
 *     summary: Liste les logs de connexion utilisateur
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.get('/login', hasPermission('logs:view'), getLoginLogs);

/**
 * @swagger
 * /logs/stats:
 *   get:
 *     summary: Statistiques d’activité de connexion
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
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
 */
router.delete('/login/:id', hasPermission('logs:manage'), deleteLoginLogById);

// === Audit ===

/**
 * @swagger
 * /logs/audit:
 *   get:
 *     summary: Liste les logs d’audit (actions utilisateurs)
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.get('/audit', hasPermission('logs:view'), getAuditLogs);

/**
 * @swagger
 * /logs/audit/{id}:
 *   get:
 *     summary: Récupère un log d’audit par ID
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.get('/audit/:id', hasPermission('logs:view'), getAuditLogById);

/**
 * @swagger
 * /logs/audit:
 *   delete:
 *     summary: Supprime tous les logs d’audit
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.delete('/audit', hasPermission('logs:manage'), deleteAllAuditLogs);

/**
 * @swagger
 * /logs/audit/{id}:
 *   delete:
 *     summary: Supprime un log d’audit par ID
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.delete('/audit/:id', hasPermission('logs:manage'), deleteAuditLogById);

// === Logs robots ===

/**
 * @swagger
 * /logs/robot:
 *   get:
 *     summary: Liste les logs des robots
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.get('/robot', hasPermission('logs:view'), getRobotLogs);

/**
 * @swagger
 * /logs/robot/{id}:
 *   get:
 *     summary: Récupère un log robot par ID
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.get('/robot/:id', hasPermission('logs:view'), getRobotLogById);

/**
 * @swagger
 * /logs/robot:
 *   delete:
 *     summary: Supprime tous les logs robot
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.delete('/robot', hasPermission('logs:manage'), deleteAllRobotLogs);

/**
 * @swagger
 * /logs/robot/{id}:
 *   delete:
 *     summary: Supprime un log robot par ID
 *     tags: [Logs]
 *     security:
 *       - cookieAuth: []
 */
router.delete('/robot/:id', hasPermission('logs:manage'), deleteRobotLogById);

export default router;
