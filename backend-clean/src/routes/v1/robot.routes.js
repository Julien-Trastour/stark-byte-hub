import { Router } from 'express';
import {
  getUserRobots,
  getAllRobots,
  linkRobotToUser,
  createRobot,
  importRobots,
  getRobotById,
  updateRobot,
  deleteRobot,
} from '../../controllers/v1/robot.controller.js';
import { requireSession } from '../../middlewares/session.middleware.js';
import { hasPermission } from '../../middlewares/hasPermission.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Robots
 *   description: Gestion des robots physiques et virtuels
 */

router.use(requireSession);

/**
 * @swagger
 * /robots:
 *   get:
 *     summary: Liste des robots liés à l'utilisateur connecté
 *     tags: [Robots]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des robots liés à l'utilisateur
 */
router.get('/', hasPermission('view_robot'), getUserRobots);

/**
 * @swagger
 * /robots/all:
 *   get:
 *     summary: Liste de tous les robots en base
 *     tags: [Robots]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste complète des robots
 *       403:
 *         description: Permission refusée
 */
router.get('/all', hasPermission('view_all_robots'), getAllRobots);

/**
 * @swagger
 * /robots/link:
 *   post:
 *     summary: Lier un robot existant à l'utilisateur
 *     tags: [Robots]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serialNumber, linkKey, name]
 *             properties:
 *               serialNumber: { type: string, example: "SBA-MX-V1-24040189" }
 *               linkKey: { type: string, example: "ABC123XYZ" }
 *               name: { type: string, example: "Arachnobot #1" }
 *     responses:
 *       200:
 *         description: Robot lié avec succès
 *       400:
 *         description: Clé ou numéro de série invalide
 */
router.post('/link', hasPermission('link_robot'), linkRobotToUser);

/**
 * @swagger
 * /robots:
 *   post:
 *     summary: Créer un nouveau robot
 *     tags: [Robots]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serialNumber, linkKey, model, firmware, color, controllable]
 *             properties:
 *               serialNumber: { type: string }
 *               linkKey: { type: string }
 *               model: { type: string }
 *               firmware: { type: string }
 *               color: { type: string }
 *               controllable: { type: boolean }
 *     responses:
 *       201:
 *         description: Robot créé
 *       403:
 *         description: Accès refusé
 */
router.post('/', hasPermission('create_robot'), createRobot);

/**
 * @swagger
 * /robots/import:
 *   post:
 *     summary: Importer plusieurs robots depuis un fichier CSV
 *     tags: [Robots]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Robots importés
 *       400:
 *         description: Format de fichier invalide
 *       403:
 *         description: Permission refusée
 */
router.post('/import', hasPermission('import_robots'), importRobots);

/**
 * @swagger
 * /robots/{id}:
 *   get:
 *     summary: Récupère un robot par ID
 *     tags: [Robots]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Robot trouvé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Robot introuvable
 */
router.get('/:id', hasPermission('view_robot'), getRobotById);

/**
 * @swagger
 * /robots/{id}:
 *   put:
 *     summary: Met à jour un robot existant
 *     tags: [Robots]
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
 *               name: { type: string }
 *               firmware: { type: string }
 *               color: { type: string }
 *               controllable: { type: boolean }
 *     responses:
 *       200:
 *         description: Robot mis à jour
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Robot introuvable
 */
router.put('/:id', hasPermission('edit_robot'), updateRobot);

/**
 * @swagger
 * /robots/{id}:
 *   delete:
 *     summary: Supprime un robot
 *     tags: [Robots]
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
 *         description: Robot supprimé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Robot introuvable
 */
router.delete('/:id', hasPermission('delete_robot'), deleteRobot);

export default router;
