import { Router } from 'express';
import { RobotController } from '../controllers/robot.controller.js';
import { requireSession } from '../middlewares/session.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Robots
 *   description: Gestion des robots
 */

router.use(requireSession);

/**
 * @swagger
 * /robots:
 *   get:
 *     summary: Liste tous les robots liés à l'utilisateur connecté
 *     tags: [Robots]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des robots de l'utilisateur
 */
router.get('/', RobotController.getAllByUser);

/**
 * @swagger
 * /robots/all:
 *   get:
 *     summary: Liste tous les robots existants (admin uniquement)
 *     tags: [Robots]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les robots
 *       403:
 *         description: Accès refusé (non admin)
 */
router.get('/all', isAdmin, RobotController.getAll);

/**
 * @swagger
 * /robots/link:
 *   post:
 *     summary: Lier un robot existant à un utilisateur via n° de série + clé
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
 *               serialNumber:
 *                 type: string
 *               linkKey:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Robot lié avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/link', RobotController.linkToUser);

/**
 * @swagger
 * /robots/{id}:
 *   get:
 *     summary: Détail d’un robot (admin ou propriétaire uniquement)
 *     tags: [Robots]
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
 *         description: Données du robot
 *       404:
 *         description: Robot non trouvé
 */
router.get('/:id', RobotController.getOne);

/**
 * @swagger
 * /robots:
 *   post:
 *     summary: Création complète d’un robot (admin uniquement)
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
 *               serialNumber:
 *                 type: string
 *               linkKey:
 *                 type: string
 *               model:
 *                 type: string
 *               firmware:
 *                 type: string
 *               color:
 *                 type: string
 *               controllable:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Robot créé
 */
router.post('/', isAdmin, RobotController.create);

/**
 * @swagger
 * /robots/{id}:
 *   put:
 *     summary: Modifier un robot (admin ou propriétaire uniquement)
 *     tags: [Robots]
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
 *               firmware:
 *                 type: string
 *               color:
 *                 type: string
 *               controllable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Robot mis à jour
 *       404:
 *         description: Robot non trouvé
 */
router.put('/:id', RobotController.update);

/**
 * @swagger
 * /robots/{id}:
 *   delete:
 *     summary: Supprimer un robot (admin ou propriétaire uniquement)
 *     tags: [Robots]
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
 *         description: Robot supprimé
 *       404:
 *         description: Robot non trouvé
 */
router.delete('/:id', RobotController.remove);

/**
 * @swagger
 * /robots/import:
 *   post:
 *     summary: Importer plusieurs robots depuis un CSV (admin uniquement)
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
 *       200:
 *         description: Robots importés
 *       400:
 *         description: Fichier invalide
 */
router.post('/import', isAdmin, RobotController.importMany);

export default router;
